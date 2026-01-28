/**
 * Admin Organization Detail API Route
 * GET /api/admin/organizations/[id] - Get organization details
 * PATCH /api/admin/organizations/[id] - Update organization
 * DELETE /api/admin/organizations/[id] - Delete/deactivate organization
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { adminUpdateOrganizationSchema } from '@/lib/validations/admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/organizations/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { id } = await params;

    const organization = await prisma.organization.findUnique({
      where: { id },
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

    return NextResponse.json({ success: true, organization });
  } catch (error) {
    console.error('Failed to fetch organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/organizations/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingOrg) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    const validation = adminUpdateOrganizationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const updateData = validation.data;

    const updatedOrg = await prisma.organization.update({
      where: { id },
      data: updateData,
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
          select: { members: true, teams: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      organization: updatedOrg,
      message: 'Organization updated successfully',
    });
  } catch (error) {
    console.error('Failed to update organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/organizations/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { id } = await params;

    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!existingOrg) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Soft delete - set isActive to false
    await prisma.organization.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: `${existingOrg.name} has been deactivated`,
    });
  } catch (error) {
    console.error('Failed to deactivate organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to deactivate organization' },
      { status: 500 }
    );
  }
}
