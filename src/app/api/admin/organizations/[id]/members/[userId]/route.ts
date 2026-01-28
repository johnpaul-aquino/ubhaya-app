/**
 * Admin Organization Member Detail API Route
 * PATCH /api/admin/organizations/[id]/members/[userId] - Update member role
 * DELETE /api/admin/organizations/[id]/members/[userId] - Remove member
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { adminUpdateOrgMemberSchema } from '@/lib/validations/admin';
import { OrgRole } from '@prisma/client';

interface RouteParams {
  params: Promise<{ id: string; userId: string }>;
}

// PATCH /api/admin/organizations/[id]/members/[userId]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { id: organizationId, userId } = await params;
    const body = await request.json();

    const validation = adminUpdateOrgMemberSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { role } = validation.data;

    // Get membership
    const membership = await prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId, organizationId } },
      include: {
        user: { select: { firstName: true, lastName: true } },
        organization: { select: { ownerId: true } },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    // If changing to OWNER, need to transfer ownership
    if (role === 'OWNER') {
      // Find current owner
      const currentOwner = await prisma.organizationMember.findFirst({
        where: { organizationId, orgRole: 'OWNER' },
      });

      // Update in transaction
      await prisma.$transaction([
        // Demote current owner to ADMIN
        ...(currentOwner
          ? [
              prisma.organizationMember.update({
                where: { id: currentOwner.id },
                data: { orgRole: 'ADMIN' },
              }),
            ]
          : []),
        // Promote new owner
        prisma.organizationMember.update({
          where: { userId_organizationId: { userId, organizationId } },
          data: { orgRole: 'OWNER' },
        }),
        // Update organization owner
        prisma.organization.update({
          where: { id: organizationId },
          data: { ownerId: userId },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: `${membership.user.firstName} ${membership.user.lastName} is now the owner`,
      });
    }

    // Regular role update
    const updatedMembership = await prisma.organizationMember.update({
      where: { userId_organizationId: { userId, organizationId } },
      data: { orgRole: role as OrgRole },
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

// DELETE /api/admin/organizations/[id]/members/[userId]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { id: organizationId, userId } = await params;

    // Get membership
    const membership = await prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId, organizationId } },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    // Cannot remove owner
    if (membership.orgRole === 'OWNER') {
      return NextResponse.json(
        { success: false, error: 'Cannot remove the organization owner. Transfer ownership first.' },
        { status: 400 }
      );
    }

    // Remove member
    await prisma.organizationMember.delete({
      where: { userId_organizationId: { userId, organizationId } },
    });

    return NextResponse.json({
      success: true,
      message: `${membership.user.firstName} ${membership.user.lastName} has been removed`,
    });
  } catch (error) {
    console.error('Failed to remove member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove member' },
      { status: 500 }
    );
  }
}
