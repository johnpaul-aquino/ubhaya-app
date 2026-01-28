/**
 * Contact Detail API Routes
 * GET /api/contacts/[id] - Get contact details
 * PATCH /api/contacts/[id] - Update contact
 * DELETE /api/contacts/[id] - Delete contact
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateContactSchema } from '@/lib/validations';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * Get contact details
 * GET /api/contacts/[id]
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
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        notes: {
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
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
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
        },
        documentLinks: {
          include: {
            document: {
              select: {
                id: true,
                title: true,
                type: true,
                createdAt: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error('Get contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

/**
 * Update contact
 * PATCH /api/contacts/[id]
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        OR: [
          { userId: session.user.id },
          // Team leaders and admins can edit team contacts
          ...(session.user.teamId && ['ADMIN', 'TEAM_LEADER'].includes(session.user.role || '')
            ? [{ teamId: session.user.teamId, isTeamContact: true }]
            : []),
        ],
      },
    });

    if (!existingContact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = updateContactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Update avatar if name changed
    let avatarUpdate = {};
    if (data.name && data.name !== existingContact.name) {
      const nameParts = data.name.trim().split(' ');
      const avatar = nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : data.name.slice(0, 2).toUpperCase();
      avatarUpdate = { avatar };
    }

    // Update contact
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...data,
        ...avatarUpdate,
        // Handle empty strings as null for optional fields
        email: data.email || null,
        phone: data.phone || null,
        company: data.company || null,
        position: data.position || null,
        whatsappNumber: data.whatsappNumber || null,
        website: data.website || null,
        address: data.address || null,
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
        action: 'CONTACT_UPDATED',
        entityType: 'CONTACT',
        entityId: contact.id,
        userId: session.user.id,
        teamId: session.user.teamId,
        metadata: {
          contactName: contact.name,
          updatedFields: Object.keys(data),
        },
      },
    });

    return NextResponse.json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error('Update contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

/**
 * Delete contact
 * DELETE /api/contacts/[id]
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        OR: [
          { userId: session.user.id },
          // Team leaders and admins can delete team contacts
          ...(session.user.teamId && ['ADMIN', 'TEAM_LEADER'].includes(session.user.role || '')
            ? [{ teamId: session.user.teamId, isTeamContact: true }]
            : []),
        ],
      },
    });

    if (!existingContact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found or access denied' },
        { status: 404 }
      );
    }

    // Delete contact (cascade will handle notes, comments, document links)
    await prisma.contact.delete({
      where: { id },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'CONTACT_DELETED',
        entityType: 'CONTACT',
        entityId: id,
        userId: session.user.id,
        teamId: session.user.teamId,
        metadata: {
          contactName: existingContact.name,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
