/**
 * Leave Team API Route
 * POST /api/team/leave
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Leave a team
 * POST /api/team/leave
 * Body: { teamId?: string } - if not provided, leaves the first team
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

    const body = await request.json().catch(() => ({}));
    const { teamId: requestedTeamId } = body as { teamId?: string };

    // Get user's team memberships
    const userMemberships = await prisma.teamMember.findMany({
      where: { userId: session.user.id },
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    if (userMemberships.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'You are not part of any team',
        },
        { status: 400 }
      );
    }

    // Find the membership to leave
    let membershipToLeave = userMemberships[0];
    if (requestedTeamId) {
      const found = userMemberships.find(m => m.teamId === requestedTeamId);
      if (!found) {
        return NextResponse.json(
          {
            success: false,
            error: 'You are not a member of this team',
          },
          { status: 400 }
        );
      }
      membershipToLeave = found;
    }

    const team = membershipToLeave.team;

    // Check if user is the team owner
    if (team.ownerId === session.user.id) {
      // If owner is leaving and there are other members, prevent leaving
      if (team.members.length > 1) {
        return NextResponse.json(
          {
            success: false,
            error:
              'As the team owner, you must transfer ownership or remove all members before leaving',
          },
          { status: 400 }
        );
      }

      // If owner is the only member, delete the team
      await prisma.team.delete({
        where: { id: team.id },
      });

      // Check if user still has other teams, if not reset role to MEMBER
      const remainingMemberships = await prisma.teamMember.count({
        where: { userId: session.user.id },
      });

      if (remainingMemberships === 0) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { role: 'MEMBER' },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Team deleted successfully',
      });
    }

    // Regular member leaving team - just delete the TeamMember record
    await prisma.teamMember.delete({
      where: { id: membershipToLeave.id },
    });

    // Check if user still has other team memberships where they're owner/leader
    const leadershipMemberships = await prisma.teamMember.findMany({
      where: {
        userId: session.user.id,
        teamRole: { in: ['OWNER', 'LEADER'] },
      },
    });

    // If user has no more leadership roles and isn't admin, reset to MEMBER
    if (leadershipMemberships.length === 0) {
      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });

      if (currentUser && currentUser.role !== 'ADMIN') {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { role: 'MEMBER' },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'You have left the team',
    });
  } catch (error) {
    console.error('Leave team error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while leaving team' },
      { status: 500 }
    );
  }
}
