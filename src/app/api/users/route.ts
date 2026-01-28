/**
 * Users API Routes
 * GET /api/users - List all users (for team invites)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Get all users
 * GET /api/users
 * Query params:
 *   - search: filter by name or email
 *   - excludeTeam: exclude users already in a specific team
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
    const search = searchParams.get('search') || '';
    const excludeTeamId = searchParams.get('excludeTeam') || null;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Exclude users already in a specific team
    if (excludeTeamId) {
      where.NOT = {
        teamMemberships: {
          some: {
            teamId: excludeTeamId,
          },
        },
      };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        role: true,
        teamMemberships: {
          select: {
            teamId: true,
            teamRole: true,
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' },
      ],
      take: 50, // Limit results
    });

    // Transform to include backwards-compatible teamId
    const transformedUsers = users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      // For backwards compatibility - first team
      teamId: user.teamMemberships.length > 0 ? user.teamMemberships[0].teamId : null,
      team: user.teamMemberships.length > 0 ? user.teamMemberships[0].team : null,
      // New field - all teams
      teams: user.teamMemberships.map(m => ({
        id: m.team.id,
        name: m.team.name,
        teamRole: m.teamRole,
      })),
    }));

    return NextResponse.json({
      success: true,
      users: transformedUsers,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
