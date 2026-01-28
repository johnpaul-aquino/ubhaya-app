/**
 * Team Invitation API Route
 * POST /api/team/invite
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { inviteMemberSchema } from '@/lib/validations/user';
import { isTeamLeader } from '@/lib/authorization';
import type { TeamRole } from '@prisma/client';

// Map user role to team role
const userRoleToTeamRole: Record<string, TeamRole> = {
  TEAM_LEADER: 'LEADER',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER',
};

/**
 * Invite a member to the team
 * POST /api/team/invite
 * Body: { email: string, role: string, teamId?: string }
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

    // Check if user is a team leader or admin (global permission)
    if (!isTeamLeader(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Only team leaders can invite members',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { teamId: requestedTeamId } = body as { teamId?: string };

    // Validate input
    const validationResult = inviteMemberSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { email, role } = validationResult.data;

    // Get user's team memberships where they can invite (OWNER or LEADER)
    const userMemberships = await prisma.teamMember.findMany({
      where: {
        userId: session.user.id,
        teamRole: { in: ['OWNER', 'LEADER'] },
      },
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
          error: 'You must be a team owner or leader to invite members',
        },
        { status: 400 }
      );
    }

    // Determine which team to invite to
    let targetMembership = userMemberships[0];
    if (requestedTeamId) {
      const found = userMemberships.find(m => m.teamId === requestedTeamId);
      if (!found) {
        return NextResponse.json(
          {
            success: false,
            error: 'You are not authorized to invite to this team',
          },
          { status: 403 }
        );
      }
      targetMembership = found;
    }

    const team = targetMembership.team;

    // Check if team has reached max members
    if (team.members.length >= team.maxMembers) {
      return NextResponse.json(
        {
          success: false,
          error: `Team has reached maximum capacity (${team.maxMembers} members)`,
        },
        { status: 400 }
      );
    }

    // Find the user to invite
    const invitedUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        teamMemberships: {
          where: { teamId: team.id },
        },
      },
    });

    if (!invitedUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            'User not found. They must register first before being invited.',
        },
        { status: 404 }
      );
    }

    // Check if user is already in this team
    if (invitedUser.teamMemberships.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'User is already a member of this team',
        },
        { status: 400 }
      );
    }

    // Map user role to team role
    const teamRole = userRoleToTeamRole[role] || 'MEMBER';

    // Add user to team via TeamMember
    await prisma.teamMember.create({
      data: {
        userId: invitedUser.id,
        teamId: team.id,
        teamRole: teamRole,
      },
    });

    // TODO: Send invitation email notification
    console.log(
      `User ${invitedUser.email} invited to team ${team.name} as ${teamRole}`
    );

    return NextResponse.json({
      success: true,
      message: `${invitedUser.firstName} ${invitedUser.lastName} has been added to the team`,
      member: {
        id: invitedUser.id,
        email: invitedUser.email,
        firstName: invitedUser.firstName,
        lastName: invitedUser.lastName,
        teamRole: teamRole,
      },
    });
  } catch (error) {
    console.error('Invite member error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while inviting member' },
      { status: 500 }
    );
  }
}
