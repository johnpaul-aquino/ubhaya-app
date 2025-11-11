/**
 * Team Member Management API Routes
 * DELETE /api/team/member/[userId] - Remove member from team
 * PATCH /api/team/member/[userId] - Update member role
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isTeamLeader } from '@/lib/authorization';

/**
 * Remove a member from the team
 * DELETE /api/team/member/[userId]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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
          error: 'Only team leaders can remove members',
        },
        { status: 403 }
      );
    }

    const { userId } = params;

    // Get user's team
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { team: true },
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

    // Cannot remove yourself
    if (userId === session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot remove yourself. Use leave team instead.',
        },
        { status: 400 }
      );
    }

    // Get member to remove
    const member = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        teamId: true,
      },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    // Check if member is in the same team
    if (member.teamId !== user.team.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Member is not part of your team',
        },
        { status: 400 }
      );
    }

    // Remove member from team
    await prisma.user.update({
      where: { id: userId },
      data: {
        teamId: null,
        role: 'MEMBER', // Reset role to default
      },
    });

    return NextResponse.json({
      success: true,
      message: `${member.firstName} ${member.lastName} has been removed from the team`,
    });
  } catch (error) {
    console.error('Remove member error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while removing member' },
      { status: 500 }
    );
  }
}

/**
 * Update member role
 * PATCH /api/team/member/[userId]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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
          error: 'Only team leaders can update member roles',
        },
        { status: 403 }
      );
    }

    const { userId } = params;
    const body = await request.json();
    const { role } = body;

    // Validate role
    if (!['MEMBER', 'VIEWER', 'TEAM_LEADER'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Get user's team
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { team: true },
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

    // Cannot update own role
    if (userId === session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot update your own role',
        },
        { status: 400 }
      );
    }

    // Get member to update
    const member = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        teamId: true,
        role: true,
      },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    // Check if member is in the same team
    if (member.teamId !== user.team.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Member is not part of your team',
        },
        { status: 400 }
      );
    }

    // Update member role
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({
      success: true,
      message: `${member.firstName} ${member.lastName}'s role updated to ${role}`,
      member: {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        role: role,
      },
    });
  } catch (error) {
    console.error('Update member role error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while updating member role' },
      { status: 500 }
    );
  }
}
