/**
 * Team Invitation API Route
 * POST /api/team/invite
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { inviteMemberSchema } from '@/lib/validations/user';
import { isTeamLeader } from '@/lib/authorization';

/**
 * Invite a member to the team
 * POST /api/team/invite
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

    // Check if user is a team leader or admin
    if (!isTeamLeader(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Only team leaders can invite members',
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
          error: 'You must be part of a team to invite members',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

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

    // Check if team has reached max members
    if (user.team.members.length >= user.team.maxMembers) {
      return NextResponse.json(
        {
          success: false,
          error: `Team has reached maximum capacity (${user.team.maxMembers} members)`,
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
        teamId: true,
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

    // Check if user is already in a team
    if (invitedUser.teamId) {
      if (invitedUser.teamId === user.team.id) {
        return NextResponse.json(
          {
            success: false,
            error: 'User is already a member of this team',
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'User is already a member of another team',
          },
          { status: 400 }
        );
      }
    }

    // Add user to team
    await prisma.user.update({
      where: { id: invitedUser.id },
      data: {
        teamId: user.team.id,
        role: role,
      },
    });

    // TODO: Send invitation email notification
    console.log(
      `User ${invitedUser.email} invited to team ${user.team.name} as ${role}`
    );

    return NextResponse.json({
      success: true,
      message: `${invitedUser.firstName} ${invitedUser.lastName} has been added to the team`,
      member: {
        id: invitedUser.id,
        email: invitedUser.email,
        firstName: invitedUser.firstName,
        lastName: invitedUser.lastName,
        role: role,
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
