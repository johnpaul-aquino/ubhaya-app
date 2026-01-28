/**
 * Organization API Routes
 * GET /api/organization - List user's organizations
 * POST /api/organization - Create a new organization
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createOrganizationSchema } from '@/lib/validations/organization';
import { OrgRole } from '@prisma/client';

// GET /api/organization - List user's organizations
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all organizations the user is a member of
    const memberships = await prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      include: {
        organization: {
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
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    const organizations = memberships.map((m) => ({
      ...m.organization,
      myRole: m.orgRole,
      joinedAt: m.joinedAt,
    }));

    return NextResponse.json({
      success: true,
      organizations,
    });
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}

// POST /api/organization - Create a new organization
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createOrganizationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, description } = validation.data;

    // Generate slug from name if not provided
    let slug = validation.data.slug;
    if (!slug) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
    }

    // Ensure slug is unique
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.organization.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    // Create organization with owner as first member
    const organization = await prisma.organization.create({
      data: {
        name,
        slug: uniqueSlug,
        description,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            orgRole: OrgRole.OWNER,
          },
        },
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
        members: {
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
        },
        _count: {
          select: {
            members: true,
            teams: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        organization: {
          ...organization,
          myRole: OrgRole.OWNER,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
