/**
 * Contact Note Detail API Routes
 * PATCH /api/contacts/[id]/notes/[noteId] - Update a note
 * DELETE /api/contacts/[id]/notes/[noteId] - Delete a note
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateContactNoteSchema } from '@/lib/validations';

type RouteParams = { params: Promise<{ id: string; noteId: string }> };

/**
 * Update a contact note
 * PATCH /api/contacts/[id]/notes/[noteId]
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id, noteId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if note exists and user has access (author or admin)
    const existingNote = await prisma.contactNote.findFirst({
      where: {
        id: noteId,
        contactId: id,
        OR: [
          { authorId: session.user.id },
          // Admins and team leaders can edit all team notes
          ...(session.user.teamId && ['ADMIN', 'TEAM_LEADER'].includes(session.user.role || '')
            ? [{
                contact: {
                  teamId: session.user.teamId,
                  isTeamContact: true,
                },
              }]
            : []),
        ],
      },
      include: {
        contact: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!existingNote) {
      return NextResponse.json(
        { success: false, error: 'Note not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = updateContactNoteSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Update note
    const note = await prisma.contactNote.update({
      where: { id: noteId },
      data: {
        ...(data.content !== undefined && { content: data.content }),
        ...(data.isPinned !== undefined && { isPinned: data.isPinned }),
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

    return NextResponse.json({
      success: true,
      note,
    });
  } catch (error) {
    console.error('Update contact note error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

/**
 * Delete a contact note
 * DELETE /api/contacts/[id]/notes/[noteId]
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id, noteId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if note exists and user has access
    const existingNote = await prisma.contactNote.findFirst({
      where: {
        id: noteId,
        contactId: id,
        OR: [
          { authorId: session.user.id },
          // Admins and team leaders can delete all team notes
          ...(session.user.teamId && ['ADMIN', 'TEAM_LEADER'].includes(session.user.role || '')
            ? [{
                contact: {
                  teamId: session.user.teamId,
                  isTeamContact: true,
                },
              }]
            : []),
        ],
      },
    });

    if (!existingNote) {
      return NextResponse.json(
        { success: false, error: 'Note not found or access denied' },
        { status: 404 }
      );
    }

    // Delete note
    await prisma.contactNote.delete({
      where: { id: noteId },
    });

    return NextResponse.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact note error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
