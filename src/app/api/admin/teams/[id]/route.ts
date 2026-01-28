/**
 * Admin Team Detail API Route
 * GET /api/admin/teams/[id] - Get team details
 * PATCH /api/admin/teams/[id] - Update team
 * DELETE /api/admin/teams/[id] - Delete team
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { adminUpdateTeamSchema } from '@/lib/validations/admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { id } = await params;

    const team = await prisma.team.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        avatar: true,
        ownerId: true,
        organizationId: true,
        maxMembers: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        members: {
          select: {
            id: true,
            teamRole: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                role: true,
              },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
        _count: {
          select: {
            members: true,
            contacts: true,
            documents: true,
            activities: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Team not found' },
        { status: 404 }
      );
    }

    // Get owner info
    const owner = await prisma.user.findUnique({
      where: { id: team.ownerId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
      },
    });

    return NextResponse.json({
      success: true,
      team: {
        ...team,
        owner,
      },
    });
  } catch (error) {
    console.error('Failed to fetch team:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const data = adminUpdateTeamSchema.parse(body);

    // Check team exists
    const existingTeam = await prisma.team.findUnique({
      where: { id },
    });

    if (!existingTeam) {
      return NextResponse.json(
        { success: false, error: 'Team not found' },
        { status: 404 }
      );
    }

    // If organizationId is being set, verify it exists
    if (data.organizationId) {
      const org = await prisma.organization.findUnique({
        where: { id: data.organizationId },
      });

      if (!org) {
        return NextResponse.json(
          { success: false, error: 'Organization not found' },
          { status: 400 }
        );
      }
    }

    const team = await prisma.team.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        maxMembers: data.maxMembers,
        isActive: data.isActive,
        organizationId: data.organizationId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        ownerId: true,
        organizationId: true,
        maxMembers: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      team,
    });
  } catch (error) {
    console.error('Failed to update team:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update team' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { id } = await params;

    // Check team exists
    const existingTeam = await prisma.team.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            members: true,
            contacts: true,
            documents: true,
          },
        },
      },
    });

    if (!existingTeam) {
      return NextResponse.json(
        { success: false, error: 'Team not found' },
        { status: 404 }
      );
    }

    // Delete team (cascades to members, but contacts/documents may need handling)
    await prisma.team.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete team:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete team' },
      { status: 500 }
    );
  }
}
