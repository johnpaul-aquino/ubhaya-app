/**
 * Document Links API Route
 * GET /api/documents/[id]/links - Get document links
 * POST /api/documents/[id]/links - Link document to entity
 * DELETE /api/documents/[id]/links - Remove document link
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createDocumentLinkSchema } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Get document links
 * GET /api/documents/[id]/links
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check document exists
    const document = await prisma.document.findUnique({
      where: { id },
      select: { authorId: true, visibility: true, teamId: true },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check permission
    const canView =
      document.authorId === session.user.id ||
      document.visibility === 'SHARED' ||
      (document.visibility === 'TEAM' && document.teamId === session.user.teamId);

    if (!canView) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get links
    const links = await prisma.documentLink.findMany({
      where: { documentId: id },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            company: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      links,
    });
  } catch (error) {
    console.error('Get document links error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch document links' },
      { status: 500 }
    );
  }
}

/**
 * Link document to an entity
 * POST /api/documents/[id]/links
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check document exists and user has permission
    const document = await prisma.document.findUnique({
      where: { id },
      select: { authorId: true, visibility: true, teamId: true, title: true },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Only author or team members (for team docs) can add links
    const canLink =
      document.authorId === session.user.id ||
      (document.visibility === 'TEAM' && document.teamId === session.user.teamId);

    if (!canLink) {
      return NextResponse.json(
        { success: false, error: 'Only the author can link this document' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = createDocumentLinkSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check for duplicate link
    const existingLink = await prisma.documentLink.findFirst({
      where: {
        documentId: id,
        ...(data.contactId && { contactId: data.contactId }),
        ...(data.facilityId && { facilityId: data.facilityId }),
      },
    });

    if (existingLink) {
      return NextResponse.json(
        { success: false, error: 'Document is already linked to this entity' },
        { status: 409 }
      );
    }

    // Verify the target entity exists
    if (data.linkType === 'CONTACT' && data.contactId) {
      const contact = await prisma.contact.findUnique({
        where: { id: data.contactId },
        select: { id: true, userId: true, teamId: true },
      });

      if (!contact) {
        return NextResponse.json(
          { success: false, error: 'Contact not found' },
          { status: 404 }
        );
      }

      // Verify user has access to the contact
      const canAccessContact =
        contact.userId === session.user.id ||
        contact.teamId === session.user.teamId;

      if (!canAccessContact) {
        return NextResponse.json(
          { success: false, error: 'Access denied to this contact' },
          { status: 403 }
        );
      }
    }

    // Create link
    const link = await prisma.documentLink.create({
      data: {
        documentId: id,
        linkType: data.linkType,
        contactId: data.contactId || null,
        facilityId: data.facilityId || null,
      },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'DOCUMENT_LINKED',
        entityType: 'DOCUMENT',
        entityId: id,
        userId: session.user.id,
        teamId: session.user.teamId,
        metadata: {
          documentTitle: document.title,
          linkType: data.linkType,
          linkedEntityId: data.contactId || data.facilityId,
        },
      },
    });

    return NextResponse.json(
      { success: true, link },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create document link error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create document link' },
      { status: 500 }
    );
  }
}

/**
 * Remove document link
 * DELETE /api/documents/[id]/links?linkId=xxx
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get('linkId');

    if (!linkId) {
      return NextResponse.json(
        { success: false, error: 'Link ID is required' },
        { status: 400 }
      );
    }

    // Check document exists and user has permission
    const document = await prisma.document.findUnique({
      where: { id },
      select: { authorId: true, visibility: true, teamId: true },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Only author or team members (for team docs) can remove links
    const canUnlink =
      document.authorId === session.user.id ||
      (document.visibility === 'TEAM' && document.teamId === session.user.teamId);

    if (!canUnlink) {
      return NextResponse.json(
        { success: false, error: 'Only the author can unlink this document' },
        { status: 403 }
      );
    }

    // Check link exists
    const link = await prisma.documentLink.findUnique({
      where: { id: linkId },
    });

    if (!link || link.documentId !== id) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    // Delete link
    await prisma.documentLink.delete({
      where: { id: linkId },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'DOCUMENT_UNLINKED',
        entityType: 'DOCUMENT',
        entityId: id,
        userId: session.user.id,
        teamId: session.user.teamId,
        metadata: {
          linkType: link.linkType,
          unlinkedEntityId: link.contactId || link.facilityId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Document link removed',
    });
  } catch (error) {
    console.error('Delete document link error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove document link' },
      { status: 500 }
    );
  }
}
