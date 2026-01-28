/**
 * Contact Notes API Routes
 * GET /api/contacts/[id]/notes - Get notes for a contact
 * POST /api/contacts/[id]/notes - Add a note to a contact
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createContactNoteSchema } from '@/lib/validations';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * Get contact notes
 * GET /api/contacts/[id]/notes
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if contact exists and user has access
    const contact = await prisma.contact.findFirst({
      where: {
        id,
        OR: [
          { userId: session.user.id },
          ...(session.user.teamId
            ? [{ teamId: session.user.teamId, isTeamContact: true }]
            : []),
        ],
      },
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    const notes = await prisma.contactNote.findMany({
      where: { contactId: id },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error('Get contact notes error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

/**
 * Add a note to a contact
 * POST /api/contacts/[id]/notes
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if contact exists and user has access
    const contact = await prisma.contact.findFirst({
      where: {
        id,
        OR: [
          { userId: session.user.id },
          ...(session.user.teamId
            ? [{ teamId: session.user.teamId, isTeamContact: true }]
            : []),
        ],
      },
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = createContactNoteSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Create note
    const note = await prisma.contactNote.create({
      data: {
        content: data.content,
        isPinned: data.isPinned || false,
        contactId: id,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'CONTACT_NOTE_ADDED',
        entityType: 'CONTACT',
        entityId: id,
        userId: session.user.id,
        teamId: session.user.teamId,
        metadata: {
          contactName: contact.name,
          notePreview: data.content.slice(0, 100),
        },
      },
    });

    return NextResponse.json({
      success: true,
      note,
    }, { status: 201 });
  } catch (error) {
    console.error('Create contact note error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create note' },
      { status: 500 }
    );
  }
}
