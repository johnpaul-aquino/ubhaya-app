/**
 * Team Settings API Route
 * PATCH /api/team/settings - Update team settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isTeamLeader } from '@/lib/authorization';
import { z } from 'zod';

const updateTeamSettingsSchema = z.object({
  name: z
    .string()
    .min(2, 'Team name must be at least 2 characters')
    .max(100, 'Team name must be less than 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  maxMembers: z.number().min(2).max(50).optional(),
});

/**
 * Update team settings
 * PATCH /api/team/settings
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is a team leader or admin
    if (!isTeamLeader(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Only team leaders can update team settings',
        },
        { status: 403 }
      );
    }

    // Get user's team
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!user?.team) {
      return NextResponse.json(
        {
          success: false,
          error: 'You must be part of a team',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = updateTeamSettingsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { name, description, maxMembers } = validationResult.data;

    // If updating maxMembers, check current member count
    if (maxMembers !== undefined && user.team.members.length > maxMembers) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot set max members below current member count (${user.team.members.length})`,
        },
        { status: 400 }
      );
    }

    // Update team
    const updatedTeam = await prisma.team.update({
      where: { id: user.team.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(maxMembers !== undefined && { maxMembers }),
      },
      select: {
        id: true,
        name: true,
        description: true,
        maxMembers: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Team settings updated successfully',
      team: updatedTeam,
    });
  } catch (error) {
    console.error('Update team settings error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while updating team settings' },
      { status: 500 }
    );
  }
}
