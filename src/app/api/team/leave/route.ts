/**
 * Leave Team API Route
 * POST /api/team/leave
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Leave current team
 * POST /api/team/leave
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

    // Get user with team information
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
          error: 'You are not part of any team',
        },
        { status: 400 }
      );
    }

    // Check if user is the team owner
    if (user.team.ownerId === session.user.id) {
      // If owner is leaving and there are other members, prevent leaving
      if (user.team.members.length > 1) {
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
        where: { id: user.team.id },
      });

      // User's teamId will be set to null automatically due to cascade
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          teamId: null,
          role: 'MEMBER', // Reset role
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Team deleted successfully',
      });
    }

    // Regular member leaving team
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        teamId: null,
        role: 'MEMBER', // Reset role
      },
    });

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
