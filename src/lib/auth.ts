/**
 * NextAuth.js v5 Configuration
 * Handles authentication with credentials provider
 */

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import type { UserRole, OrgRole } from '@prisma/client';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            teamMemberships: {
              include: { team: true },
              take: 1, // Get first team for backwards compatibility
            },
            organizationMemberships: {
              include: { organization: true },
              take: 1, // Get first organization for backwards compatibility
            },
          },
        });

        if (!user || !user.isActive) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        // Get first team ID for backwards compatibility
        const teamId = user.teamMemberships.length > 0
          ? user.teamMemberships[0].teamId
          : null;

        // Get first organization for backwards compatibility
        const orgMembership = user.organizationMemberships.length > 0
          ? user.organizationMemberships[0]
          : null;

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          teamId: teamId,
          organizationId: orgMembership?.organizationId || null,
          orgRole: orgMembership?.orgRole || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
        token.teamId = user.teamId as string | null;
        token.organizationId = user.organizationId as string | null;
        token.orgRole = user.orgRole as OrgRole | null;
        token.firstName = user.firstName as string;
        token.lastName = user.lastName as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.teamId = token.teamId as string | null;
        session.user.organizationId = token.organizationId as string | null;
        session.user.orgRole = token.orgRole as OrgRole | null;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    },
  },
});
