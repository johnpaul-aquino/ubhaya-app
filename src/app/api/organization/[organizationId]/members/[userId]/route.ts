/**
 * Organization Member Detail API Routes
 * PATCH /api/organization/[organizationId]/members/[userId] - Update member role
 * DELETE /api/organization/[organizationId]/members/[userId] - Remove member
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateOrgMemberSchema } from '@/lib/validations/organization';
import { OrgRole } from '@prisma/client';

interface RouteParams {
  params: Promise<{ organizationId: string; userId: string }>;
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

// PATCH /api/organization/[organizationId]/members/[userId] - Update member role
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { organizationId, userId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has permission to update roles (OWNER or ADMIN only)
    const { allowed, membership: actorMembership } = await checkPermission(
      session.user.id,
      organizationId,
      ['OWNER', 'ADMIN']
    );

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to update member roles' },
        { status: 403 }
      );
    }

    // Cannot update own role
    if (userId === session.user.id) {
      return NextResponse.json(
        { success: false, error: 'You cannot update your own role' },
        { status: 400 }
      );
    }

    // Get target member
    const targetMembership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: { userId, organizationId },
      },
    });

    if (!targetMembership) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    // Cannot change owner's role
    if (targetMembership.orgRole === 'OWNER') {
      return NextResponse.json(
        { success: false, error: 'Cannot change the owner\'s role' },
        { status: 400 }
      );
    }

    // Admin cannot change other admin's role (only owner can)
    if (actorMembership?.orgRole === 'ADMIN' && targetMembership.orgRole === 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only the owner can change an admin\'s role' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updateOrgMemberSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { role } = validation.data;

    // Update the member's role
    const updatedMembership = await prisma.organizationMember.update({
      where: {
        userId_organizationId: { userId, organizationId },
      },
      data: {
        orgRole: role as OrgRole,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      member: updatedMembership,
      message: 'Member role updated successfully',
    });
  } catch (error) {
    console.error('Failed to update member role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update member role' },
      { status: 500 }
    );
  }
}

// DELETE /api/organization/[organizationId]/members/[userId] - Remove member
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { organizationId, userId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has permission to remove members (OWNER or ADMIN only)
    const { allowed, membership: actorMembership } = await checkPermission(
      session.user.id,
      organizationId,
      ['OWNER', 'ADMIN']
    );

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to remove members' },
        { status: 403 }
      );
    }

    // Get target member
    const targetMembership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: { userId, organizationId },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!targetMembership) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    // Cannot remove the owner
    if (targetMembership.orgRole === 'OWNER') {
      return NextResponse.json(
        { success: false, error: 'Cannot remove the organization owner' },
        { status: 400 }
      );
    }

    // Admin cannot remove other admins (only owner can)
    if (actorMembership?.orgRole === 'ADMIN' && targetMembership.orgRole === 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only the owner can remove an admin' },
        { status: 403 }
      );
    }

    // Cannot remove yourself through this endpoint
    if (userId === session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Use the leave organization endpoint to leave' },
        { status: 400 }
      );
    }

    // Remove the member
    await prisma.organizationMember.delete({
      where: {
        userId_organizationId: { userId, organizationId },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${targetMembership.user.firstName} ${targetMembership.user.lastName} has been removed from the organization`,
    });
  } catch (error) {
    console.error('Failed to remove member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove member' },
      { status: 500 }
    );
  }
}
