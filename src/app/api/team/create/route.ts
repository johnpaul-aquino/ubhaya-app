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

    // Check if user already belongs to a team
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { teamId: true },
    });

    if (user?.teamId) {
      return NextResponse.json(
        {
          success: false,
          error: 'You already belong to a team. Leave your current team first.',
        },
        { status: 400 }
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

    // Create team and assign user as owner
    const team = await prisma.team.create({
      data: {
        name,
        slug,
        description,
        ownerId: session.user.id,
        members: {
          connect: { id: session.user.id },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Update user role to TEAM_LEADER
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: 'TEAM_LEADER' },
    });

    return NextResponse.json({
      success: true,
      message: 'Team created successfully',
      team: {
        id: team.id,
        name: team.name,
        slug: team.slug,
        description: team.description,
        memberCount: team.members.length,
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
