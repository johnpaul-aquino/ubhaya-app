/**
 * NextAuth Type Extensions
 * Extends the default NextAuth types to include our custom user fields
 */

import { UserRole, OrgRole } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      teamId: string | null;
      organizationId: string | null;
      orgRole: OrgRole | null;
      firstName: string;
      lastName: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: UserRole;
    teamId?: string | null;
    organizationId?: string | null;
    orgRole?: OrgRole | null;
    firstName: string;
    lastName: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    teamId: string | null;
    organizationId: string | null;
    orgRole: OrgRole | null;
    firstName: string;
    lastName: string;
  }
}
