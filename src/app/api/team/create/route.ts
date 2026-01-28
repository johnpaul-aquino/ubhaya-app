/**
 * Team Creation API Route
 * POST /api/team/create
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createTeamSchema } from '@/lib/validations/user';

/**
 * Create a new team
 * POST /api/team/create
 * Note: Users can now be part of multiple teams
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = createTeamSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { name, slug, description } = validationResult.data;

    // Check if slug is already taken
    const existingTeam = await prisma.team.findUnique({
      where: { slug },
    });

    if (existingTeam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Team slug already taken. Please choose another.',
        },
        { status: 400 }
      );
    }

    // Create team with owner as first member via TeamMember junction table
    const team = await prisma.team.create({
      data: {
        name,
        slug,
        description,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            teamRole: 'OWNER',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    // Update user role to TEAM_LEADER if not already admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser && currentUser.role !== 'ADMIN') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role: 'TEAM_LEADER' },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Team created successfully',
      team: {
        id: team.id,
        name: team.name,
        slug: team.slug,
        description: team.description,
        memberCount: team.members.length,
        members: team.members.map(m => ({
          id: m.user.id,
          firstName: m.user.firstName,
          lastName: m.user.lastName,
          email: m.user.email,
          role: m.user.role,
          teamRole: m.teamRole,
        })),
      },
    });
  } catch (error) {
    console.error('Create team error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while creating team' },
      { status: 500 }
    );
  }
}
