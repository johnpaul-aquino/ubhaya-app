/**
 * Organization Detail API Routes
 * GET /api/organization/[organizationId] - Get organization details
 * PATCH /api/organization/[organizationId] - Update organization
 * DELETE /api/organization/[organizationId] - Delete organization
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateOrganizationSchema } from '@/lib/validations/organization';

interface RouteParams {
  params: Promise<{ organizationId: string }>;
}

// Helper to check if user has permission
async function checkPermission(userId: string, organizationId: string, requiredRoles: string[]) {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: { userId, organizationId },
    },
  });

  if (!membership) {
    return { allowed: false, membership: null };
  }

  return {
    allowed: requiredRoles.includes(membership.orgRole),
    membership,
  };
}

// GET /api/organization/[organizationId] - Get organization details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { organizationId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is a member of the organization
    const { allowed, membership } = await checkPermission(
      session.user.id,
      organizationId,
      ['OWNER', 'ADMIN', 'MEMBER', 'GUEST']
    );

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        members: {
          include: {
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
        teams: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            _count: { select: { members: true } },
          },
        },
        _count: {
          select: {
            members: true,
            teams: true,
            contacts: true,
            documents: true,
          },
        },
      },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      organization: {
        ...organization,
        myRole: membership?.orgRole,
      },
    });
  } catch (error) {
    console.error('Failed to fetch organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization' },
      { status: 500 }
    );
  }
}

// PATCH /api/organization/[organizationId] - Update organization
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { organizationId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has permission to update (OWNER or ADMIN only)
    const { allowed } = await checkPermission(
      session.user.id,
      organizationId,
      ['OWNER', 'ADMIN']
    );

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to update this organization' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updateOrganizationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, description, maxTeams, maxMembers } = validation.data;

    const organization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(maxTeams && { maxTeams }),
        ...(maxMembers && { maxMembers }),
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            members: true,
            teams: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error('Failed to update organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}

// DELETE /api/organization/[organizationId] - Delete organization
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { organizationId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is the owner
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        _count: {
          select: { members: true, teams: true },
        },
      },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    if (organization.ownerId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Only the owner can delete this organization' },
        { status: 403 }
      );
    }

    // Check if organization has other members
    if (organization._count.members > 1) {
      return NextResponse.json(
        { success: false, error: 'Please remove all members before deleting the organization' },
        { status: 400 }
      );
    }

    // Check if organization has teams
    if (organization._count.teams > 0) {
      return NextResponse.json(
        { success: false, error: 'Please delete all teams before deleting the organization' },
        { status: 400 }
      );
    }

    // Delete organization (cascade will handle members)
    await prisma.organization.delete({
      where: { id: organizationId },
    });

    return NextResponse.json({
      success: true,
      message: 'Organization deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete organization' },
      { status: 500 }
    );
  }
}
