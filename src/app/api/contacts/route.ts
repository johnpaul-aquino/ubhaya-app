/**
 * Contacts API Routes
 * GET /api/contacts - List contacts with pagination and filters
 * POST /api/contacts - Create a new contact
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createContactSchema, contactQuerySchema } from '@/lib/validations';
import { Prisma } from '@prisma/client';

/**
 * Get contacts list
 * GET /api/contacts
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Parse and validate query params
    const queryResult = contactQuerySchema.safeParse({
      search: searchParams.get('search') || undefined,
      teamId: searchParams.get('teamId') || undefined,
      organizationId: searchParams.get('organizationId') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      isTeamContact: searchParams.get('isTeamContact') || undefined,
      isOrgContact: searchParams.get('isOrgContact') || undefined,
      page: searchParams.get('page') || 1,
      pageSize: searchParams.get('pageSize') || 20,
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: queryResult.error.flatten() },
        { status: 400 }
      );
    }

    const { search, teamId, organizationId, tags, isTeamContact, isOrgContact, page, pageSize } = queryResult.data;

    // Build where clause
    const where: Prisma.ContactWhereInput = {
      OR: [
        // User's own contacts
        { userId: session.user.id },
        // Team contacts (if user is part of a team)
        ...(session.user.teamId
          ? [{ teamId: session.user.teamId, isTeamContact: true }]
          : []),
        // Organization contacts (if user is part of an organization)
        ...(session.user.organizationId
          ? [{ organizationId: session.user.organizationId, isOrgContact: true }]
          : []),
      ],
    };

    // Add search filter
    if (search) {
      where.AND = [
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { company: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    // Add team filter
    if (teamId) {
      where.teamId = teamId;
    }

    // Add organization filter
    if (organizationId) {
      where.organizationId = organizationId;
    }

    // Add tags filter
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    // Add isTeamContact filter
    if (typeof isTeamContact === 'boolean') {
      where.isTeamContact = isTeamContact;
    }

    // Add isOrgContact filter
    if (typeof isOrgContact === 'boolean') {
      where.isOrgContact = isOrgContact;
    }

    // Get total count
    const total = await prisma.contact.count({ where });

    // Get contacts with pagination
    const contacts = await prisma.contact.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        notes: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            isPinned: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            notes: true,
            comments: true,
            documentLinks: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      success: true,
      contacts,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

/**
 * Create a new contact
 * POST /api/contacts
 */
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

    // Validate input
    const validationResult = createContactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Generate avatar initials and background color
    const nameParts = data.name.trim().split(' ');
    const avatar = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : data.name.slice(0, 2).toUpperCase();

    const avatarColors = [
      '#6B46C1', '#2563EB', '#22c55e', '#f59e0b', '#ef4444',
      '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316',
    ];
    const avatarBg = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    // Create contact
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        company: data.company || null,
        position: data.position || null,
        whatsappNumber: data.whatsappNumber || null,
        website: data.website || null,
        address: data.address || null,
        tags: data.tags || [],
        isTeamContact: data.isTeamContact || false,
        avatar,
        avatarBg,
        userId: session.user.id,
        teamId: data.isTeamContact ? session.user.teamId : null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'CONTACT_CREATED',
        entityType: 'CONTACT',
        entityId: contact.id,
        userId: session.user.id,
        teamId: session.user.teamId,
        metadata: {
          contactName: contact.name,
          isTeamContact: contact.isTeamContact,
        },
      },
    });

    return NextResponse.json({
      success: true,
      contact,
    }, { status: 201 });
  } catch (error) {
    console.error('Create contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}
