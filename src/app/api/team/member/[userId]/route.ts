/**
 * Team Member Management API Routes
 * DELETE /api/team/member/[userId] - Remove member from team
 * PATCH /api/team/member/[userId] - Update member role
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isTeamLeader } from '@/lib/authorization';
import type { TeamRole } from '@prisma/client';

// Map user role to team role
const userRoleToTeamRole: Record<string, TeamRole> = {
  TEAM_LEADER: 'LEADER',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER',
};

/**
 * Remove a member from the team
 * DELETE /api/team/member/[userId]
 * Query params: teamId (optional) - if not provided, uses first team
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
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

    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    // Get user's team memberships where they have permission to remove members
    const userMemberships = await prisma.teamMember.findMany({
      where: {
        userId: session.user.id,
        teamRole: { in: ['OWNER', 'LEADER'] },
      },
      include: {
        team: true,
      },
    });

    if (userMemberships.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'You must be a team owner or leader',
        },
        { status: 400 }
      );
    }

    // Determine which team
    let targetMembership = userMemberships[0];
    if (teamId) {
      const found = userMemberships.find(m => m.teamId === teamId);
      if (!found) {
        return NextResponse.json(
          {
            success: false,
            error: 'You are not authorized to manage this team',
          },
          { status: 403 }
        );
      }
      targetMembership = found;
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

    // Get member's team membership
    const memberMembership = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: userId,
          teamId: targetMembership.teamId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!memberMembership) {
      return NextResponse.json(
        {
          success: false,
          error: 'Member is not part of this team',
        },
        { status: 400 }
      );
    }

    // Cannot remove the team owner
    if (memberMembership.teamRole === 'OWNER') {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot remove the team owner',
        },
        { status: 400 }
      );
    }

    // Remove member from team
    await prisma.teamMember.delete({
      where: { id: memberMembership.id },
    });

    // Check if removed user has any remaining leadership roles
    const remainingLeadershipRoles = await prisma.teamMember.findMany({
      where: {
        userId: userId,
        teamRole: { in: ['OWNER', 'LEADER'] },
      },
    });

    // If no more leadership roles, reset user's global role
    if (remainingLeadershipRoles.length === 0) {
      const removedUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (removedUser && removedUser.role !== 'ADMIN') {
        await prisma.user.update({
          where: { id: userId },
          data: { role: 'MEMBER' },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${memberMembership.user.firstName} ${memberMembership.user.lastName} has been removed from the team`,
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
 * Update member role within the team
 * PATCH /api/team/member/[userId]
 * Body: { role: string, teamId?: string }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
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

    const { userId } = await params;
    const body = await request.json();
    const { role, teamId: requestedTeamId } = body as { role: string; teamId?: string };

    // Map user role to team role
    const teamRole = userRoleToTeamRole[role];
    if (!teamRole) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Get user's team memberships where they have permission
    const userMemberships = await prisma.teamMember.findMany({
      where: {
        userId: session.user.id,
        teamRole: { in: ['OWNER', 'LEADER'] },
      },
    });

    if (userMemberships.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'You must be a team owner or leader',
        },
        { status: 400 }
      );
    }

    // Determine which team
    let targetTeamId = userMemberships[0].teamId;
    if (requestedTeamId) {
      const found = userMemberships.find(m => m.teamId === requestedTeamId);
      if (!found) {
        return NextResponse.json(
          {
            success: false,
            error: 'You are not authorized to manage this team',
          },
          { status: 403 }
        );
      }
      targetTeamId = requestedTeamId;
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

    // Get member's team membership
    const memberMembership = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: userId,
          teamId: targetTeamId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!memberMembership) {
      return NextResponse.json(
        {
          success: false,
          error: 'Member is not part of this team',
        },
        { status: 400 }
      );
    }

    // Cannot change owner's role
    if (memberMembership.teamRole === 'OWNER') {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot change the team owner\'s role',
        },
        { status: 400 }
      );
    }

    // Update member's team role
    await prisma.teamMember.update({
      where: { id: memberMembership.id },
      data: { teamRole },
    });

    // If promoting to LEADER, update global role if needed
    if (teamRole === 'LEADER') {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (targetUser && targetUser.role !== 'ADMIN' && targetUser.role !== 'TEAM_LEADER') {
        await prisma.user.update({
          where: { id: userId },
          data: { role: 'TEAM_LEADER' },
        });
      }
    } else {
      // If demoting, check if user has any other leadership roles
      const otherLeadershipRoles = await prisma.teamMember.findMany({
        where: {
          userId: userId,
          teamRole: { in: ['OWNER', 'LEADER'] },
        },
      });

      if (otherLeadershipRoles.length === 0) {
        const targetUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });

        if (targetUser && targetUser.role !== 'ADMIN') {
          await prisma.user.update({
            where: { id: userId },
            data: { role: 'MEMBER' },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${memberMembership.user.firstName} ${memberMembership.user.lastName}'s role updated to ${teamRole}`,
      member: {
        id: memberMembership.user.id,
        firstName: memberMembership.user.firstName,
        lastName: memberMembership.user.lastName,
        teamRole: teamRole,
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
