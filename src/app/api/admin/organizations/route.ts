/**
 * Admin Organizations API Route
 * GET /api/admin/organizations - List all organizations
 * POST /api/admin/organizations - Create organization (assign owner)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { organizationFilterSchema, adminCreateOrganizationSchema } from '@/lib/validations/admin';

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// GET /api/admin/organizations
export async function GET(request: NextRequest) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const params = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
      search: searchParams.get('search') || undefined,
      isActive: searchParams.get('isActive') || undefined,
    };

    const validation = organizationFilterSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { page, limit, search, isActive } = validation.data;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Get organizations and total count
    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          isActive: true,
          maxTeams: true,
          maxMembers: true,
          createdAt: true,
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
              contacts: true,
              documents: true,
            },
          },
        },
      }),
      prisma.organization.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      organizations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}

// POST /api/admin/organizations
export async function POST(request: NextRequest) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const body = await request.json();
    const validation = adminCreateOrganizationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, description, ownerId, maxTeams, maxMembers } = validation.data;

    // Check if owner exists
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { id: true, firstName: true, lastName: true },
    });

    if (!owner) {
      return NextResponse.json(
        { success: false, error: 'Owner user not found' },
        { status: 404 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(name);
    let slugExists = await prisma.organization.findUnique({ where: { slug } });
    let counter = 1;
    while (slugExists) {
      slug = `${generateSlug(name)}-${counter}`;
      slugExists = await prisma.organization.findUnique({ where: { slug } });
      counter++;
    }

    // Create organization and add owner as OWNER member
    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        description,
        ownerId,
        maxTeams,
        maxMembers,
        members: {
          create: {
            userId: ownerId,
            orgRole: 'OWNER',
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
        _count: {
          select: { members: true, teams: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      organization,
      message: 'Organization created successfully',
    });
  } catch (error) {
    console.error('Failed to create organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
