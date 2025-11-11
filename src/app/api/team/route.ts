/**
 * Team API Routes
 * GET /api/team - Get team information
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Get team information
 * GET /api/team
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

    // Get user with team information
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        team: {
          include: {
            members: {
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
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    });

    if (!user?.team) {
      return NextResponse.json(
        {
          success: false,
          error: 'You are not part of any team',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      team: {
        id: user.team.id,
        name: user.team.name,
        slug: user.team.slug,
        description: user.team.description,
        avatar: user.team.avatar,
        ownerId: user.team.ownerId,
        maxMembers: user.team.maxMembers,
        isActive: user.team.isActive,
        createdAt: user.team.createdAt,
        members: user.team.members,
        memberCount: user.team.members.length,
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
