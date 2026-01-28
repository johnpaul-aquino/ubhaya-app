/**
 * Admin Organization Members API Route
 * GET /api/admin/organizations/[id]/members - List organization members
 * POST /api/admin/organizations/[id]/members - Add member to organization
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { adminAddOrgMemberSchema } from '@/lib/validations/admin';
import { OrgRole } from '@prisma/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/organizations/[id]/members
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { id } = await params;

    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    const members = await prisma.organizationMember.findMany({
      where: { organizationId: id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            role: true,
            isActive: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    return NextResponse.json({
      success: true,
      members,
      organization: { id: organization.id, name: organization.name },
    });
  } catch (error) {
    console.error('Failed to fetch organization members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

// POST /api/admin/organizations/[id]/members
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const validation = adminAddOrgMemberSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { userId, role } = validation.data;

    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: { id },
      select: { id: true, name: true, maxMembers: true, _count: { select: { members: true } } },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Check member limit
    if (organization._count.members >= organization.maxMembers) {
      return NextResponse.json(
        { success: false, error: 'Organization has reached maximum member limit' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const existingMembership = await prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId, organizationId: id } },
    });

    if (existingMembership) {
      return NextResponse.json(
        { success: false, error: 'User is already a member of this organization' },
        { status: 400 }
      );
    }

    // Add member
    const membership = await prisma.organizationMember.create({
      data: {
        userId,
        organizationId: id,
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
      member: membership,
      message: `${user.firstName} ${user.lastName} added to ${organization.name}`,
    });
  } catch (error) {
    console.error('Failed to add member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add member' },
      { status: 500 }
    );
  }
}
