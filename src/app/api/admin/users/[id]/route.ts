/**
 * Admin User Detail API Route
 * GET /api/admin/users/[id] - Get user details
 * PATCH /api/admin/users/[id] - Update user (role, status)
 * DELETE /api/admin/users/[id] - Deactivate user
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { updateUserRoleSchema, updateUserStatusSchema } from '@/lib/validations/admin';
import { UserRole } from '@prisma/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/users/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        avatar: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        teamMemberships: {
          select: {
            id: true,
            teamRole: true,
            team: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        organizationMemberships: {
          select: {
            id: true,
            orgRole: true,
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            documents: true,
            contacts: true,
            activities: true,
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

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { authorized, response, session } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent self-demotion from admin
    if (id === session?.user?.id && body.role && body.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Cannot change your own admin role' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: { role?: UserRole; isActive?: boolean } = {};

    // Handle role update
    if (body.role !== undefined) {
      const roleValidation = updateUserRoleSchema.safeParse({ role: body.role });
      if (!roleValidation.success) {
        return NextResponse.json(
          { success: false, error: roleValidation.error.errors[0].message },
          { status: 400 }
        );
      }
      updateData.role = roleValidation.data.role as UserRole;
    }

    // Handle status update
    if (body.isActive !== undefined) {
      const statusValidation = updateUserStatusSchema.safeParse({ isActive: body.isActive });
      if (!statusValidation.success) {
        return NextResponse.json(
          { success: false, error: statusValidation.error.errors[0].message },
          { status: 400 }
        );
      }

      // Prevent self-deactivation
      if (id === session?.user?.id && !body.isActive) {
        return NextResponse.json(
          { success: false, error: 'Cannot deactivate your own account' },
          { status: 400 }
        );
      }

      updateData.isActive = statusValidation.data.isActive;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Soft delete (deactivate)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { authorized, response, session } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { id } = await params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, firstName: true, lastName: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent self-deletion
    if (id === session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot deactivate your own account' },
        { status: 400 }
      );
    }

    // Soft delete - set isActive to false
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: `${existingUser.firstName} ${existingUser.lastName} has been deactivated`,
    });
  } catch (error) {
    console.error('Failed to deactivate user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to deactivate user' },
      { status: 500 }
    );
  }
}
