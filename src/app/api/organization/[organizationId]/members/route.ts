/**
 * Organization Members API Routes
 * GET /api/organization/[organizationId]/members - List members
 * POST /api/organization/[organizationId]/members - Invite a member
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { inviteOrgMemberSchema } from '@/lib/validations/organization';
import { OrgRole } from '@prisma/client';

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

// GET /api/organization/[organizationId]/members - List members
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
    const { allowed } = await checkPermission(
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

    const members = await prisma.organizationMember.findMany({
      where: { organizationId },
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
            lastLoginAt: true,
          },
        },
      },
      orderBy: [
        { orgRole: 'asc' }, // OWNER first
        { joinedAt: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      members,
    });
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

// POST /api/organization/[organizationId]/members - Invite a member
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { organizationId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has permission to invite (OWNER or ADMIN only)
    const { allowed } = await checkPermission(
      session.user.id,
      organizationId,
      ['OWNER', 'ADMIN']
    );

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to invite members' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = inviteOrgMemberSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, role } = validation.data;

    // Find the user by email
    const userToInvite = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToInvite) {
      return NextResponse.json(
        { success: false, error: 'User not found. They must have an account first.' },
        { status: 404 }
      );
    }

    // Check if already a member
    const existingMembership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: userToInvite.id,
          organizationId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { success: false, error: 'User is already a member of this organization' },
        { status: 400 }
      );
    }

    // Check organization capacity
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        _count: { select: { members: true } },
      },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    if (organization._count.members >= organization.maxMembers) {
      return NextResponse.json(
        { success: false, error: 'Organization has reached maximum member capacity' },
        { status: 400 }
      );
    }

    // Create membership
    const membership = await prisma.organizationMember.create({
      data: {
        userId: userToInvite.id,
        organizationId,
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
            role: true,
          },
        },
      },
    });

    // TODO: Send invitation email notification

    return NextResponse.json(
      {
        success: true,
        member: membership,
        message: `${userToInvite.firstName} ${userToInvite.lastName} has been added to the organization`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to invite member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to invite member' },
      { status: 500 }
    );
  }
}
