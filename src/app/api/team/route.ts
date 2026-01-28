/**
 * Team API Routes
 * GET /api/team - Get user's teams information
 * DELETE /api/team - Delete a team (owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Get user's teams information
 * GET /api/team
 * Query params:
 *   - teamId: Get specific team (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    // Get user with all team memberships
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        teamMemberships: {
          include: {
            team: {
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
                        avatar: true,
                        createdAt: true,
                        lastLoginAt: true,
                      },
                    },
                  },
                  orderBy: {
                    joinedAt: 'asc',
                  },
                },
              },
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // If specific team requested, return just that team
    if (teamId) {
      const membership = user.teamMemberships.find(m => m.teamId === teamId);
      if (!membership) {
        return NextResponse.json(
          { success: false, error: 'Team not found or not a member' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          team: {
            id: membership.team.id,
            name: membership.team.name,
            slug: membership.team.slug,
            description: membership.team.description,
            avatar: membership.team.avatar,
            ownerId: membership.team.ownerId,
            maxMembers: membership.team.maxMembers,
            isActive: membership.team.isActive,
            createdAt: membership.team.createdAt,
            myRole: membership.teamRole,
            members: membership.team.members.map(m => ({
              id: m.user.id,
              firstName: m.user.firstName,
              lastName: m.user.lastName,
              email: m.user.email,
              role: m.user.role,
              teamRole: m.teamRole,
              avatar: m.user.avatar,
              createdAt: m.user.createdAt,
              lastLoginAt: m.user.lastLoginAt,
              joinedAt: m.joinedAt,
            })),
          },
        },
      });
    }

    // Return all teams the user is a member of
    const teams = user.teamMemberships.map(membership => ({
      id: membership.team.id,
      name: membership.team.name,
      slug: membership.team.slug,
      description: membership.team.description,
      avatar: membership.team.avatar,
      ownerId: membership.team.ownerId,
      maxMembers: membership.team.maxMembers,
      isActive: membership.team.isActive,
      createdAt: membership.team.createdAt,
      myRole: membership.teamRole,
      memberCount: membership.team.members.length,
      members: membership.team.members.map(m => ({
        id: m.user.id,
        firstName: m.user.firstName,
        lastName: m.user.lastName,
        email: m.user.email,
        role: m.user.role,
        teamRole: m.teamRole,
        avatar: m.user.avatar,
        createdAt: m.user.createdAt,
        lastLoginAt: m.user.lastLoginAt,
        joinedAt: m.joinedAt,
      })),
    }));

    // For backwards compatibility, also include first team as "team"
    const firstTeam = teams.length > 0 ? teams[0] : null;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        team: firstTeam, // Backwards compatibility
        teams, // All teams
      },
    });
  } catch (error) {
    console.error('Get team error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while fetching team' },
      { status: 500 }
    );
  }
}

/**
 * Delete a team
 * DELETE /api/team
 * Body: { teamId?: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { teamId } = body as { teamId?: string };

    // Find team where user is owner
    let team;
    if (teamId) {
      team = await prisma.team.findFirst({
        where: {
          id: teamId,
          ownerId: session.user.id,
        },
        include: {
          members: true,
        },
      });
    } else {
      // Find first team user owns
      team = await prisma.team.findFirst({
        where: {
          ownerId: session.user.id,
        },
        include: {
          members: true,
        },
      });
    }

    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Team not found or not owner' },
        { status: 404 }
      );
    }

    // Only allow deletion if team has only the owner
    if (team.members.length > 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete team with other members. Remove all members first.' },
        { status: 400 }
      );
    }

    // Delete team (cascade will delete TeamMember records)
    await prisma.team.delete({
      where: { id: team.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    console.error('Delete team error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while deleting team' },
      { status: 500 }
    );
  }
}
