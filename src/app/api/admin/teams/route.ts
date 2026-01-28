/**
 * Admin Teams API Route
 * GET /api/admin/teams - List all teams with filters
 * POST /api/admin/teams - Create a new team (admin)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { prisma } from '@/lib/prisma';
import { teamFilterSchema, adminCreateTeamSchema } from '@/lib/validations/admin';

export async function GET(request: NextRequest) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = teamFilterSchema.parse({
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      search: searchParams.get('search') || undefined,
      organizationId: searchParams.get('organizationId') || undefined,
      isActive: searchParams.get('isActive') || undefined,
    });

    const where: Record<string, unknown> = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { slug: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.organizationId) {
      where.organizationId = filters.organizationId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { createdAt: 'desc' },
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
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              members: true,
              contacts: true,
              documents: true,
            },
          },
        },
      }),
      prisma.team.count({ where }),
    ]);

    // Get owner info for each team
    const ownerIds = [...new Set(teams.map((t) => t.ownerId))];
    const owners = await prisma.user.findMany({
      where: { id: { in: ownerIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
    const ownerMap = new Map(owners.map((o) => [o.id, o]));

    const teamsWithOwners = teams.map((team) => ({
      ...team,
      owner: ownerMap.get(team.ownerId) || null,
    }));

    return NextResponse.json({
      success: true,
      teams: teamsWithOwners,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch teams:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { authorized, response } = await requireAdmin();

  if (!authorized) {
    return response;
  }

  try {
    const body = await request.json();
    const data = adminCreateTeamSchema.parse(body);

    // Generate slug from name
    const baseSlug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check for slug uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.team.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Verify owner exists
    const owner = await prisma.user.findUnique({
      where: { id: data.ownerId },
    });

    if (!owner) {
      return NextResponse.json(
        { success: false, error: 'Owner not found' },
        { status: 400 }
      );
    }

    // If organizationId is provided, verify it exists
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

    // Create team
    const team = await prisma.team.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        ownerId: data.ownerId,
        organizationId: data.organizationId || null,
        maxMembers: data.maxMembers,
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
      },
    });

    // Add owner as team member with OWNER role
    await prisma.teamMember.create({
      data: {
        userId: data.ownerId,
        teamId: team.id,
        teamRole: 'OWNER',
      },
    });

    return NextResponse.json({
      success: true,
      team,
    });
  } catch (error) {
    console.error('Failed to create team:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create team' },
      { status: 500 }
    );
  }
}
