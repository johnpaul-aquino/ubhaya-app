/**
 * Document Detail API Routes
 * GET /api/documents/[id] - Get document details
 * PATCH /api/documents/[id] - Update document
 * DELETE /api/documents/[id] - Delete document
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateDocumentSchema } from '@/lib/validations';
import { deleteFromS3 } from '@/lib/s3';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Get document details
 * GET /api/documents/[id]
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

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        links: {
          include: {
            contact: {
              select: {
                id: true,
                name: true,
                company: true,
              },
            },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            links: true,
            comments: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check permission - user can view if they are author, document is shared, on the same team, or in the same organization
    const canView =
      document.authorId === session.user.id ||
      document.visibility === 'SHARED' ||
      (document.visibility === 'TEAM' && document.teamId === session.user.teamId) ||
      (document.visibility === 'ORGANIZATION' && document.organizationId === session.user.organizationId);

    if (!canView) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

/**
 * Update document
 * PATCH /api/documents/[id]
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if document exists and user has permission
    const existingDocument = await prisma.document.findUnique({
      where: { id },
      select: { authorId: true, teamId: true },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Only author can update
    if (existingDocument.authorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Only the author can update this document' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = updateDocumentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Update document
    const document = await prisma.document.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.contentJson !== undefined && { contentJson: data.contentJson }),
        ...(data.contentFormat && { contentFormat: data.contentFormat }),
        ...(data.type && { type: data.type }),
        ...(data.visibility && { visibility: data.visibility }),
        // Handle TEAM visibility
        ...(data.visibility === 'TEAM' && {
          teamId: data.teamId || session.user.teamId,
          organizationId: null,
        }),
        // Handle ORGANIZATION visibility
        ...(data.visibility === 'ORGANIZATION' && {
          teamId: null,
          organizationId: session.user.organizationId,
        }),
        // Clear team and org for PRIVATE or SHARED
        ...(data.visibility && data.visibility !== 'TEAM' && data.visibility !== 'ORGANIZATION' && {
          teamId: null,
          organizationId: null,
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        links: true,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'DOCUMENT_UPDATED',
        entityType: 'DOCUMENT',
        entityId: document.id,
        userId: session.user.id,
        teamId: session.user.teamId,
        metadata: {
          documentTitle: document.title,
          updatedFields: Object.keys(data),
        },
      },
    });

    return NextResponse.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error('Update document error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

/**
 * Delete document
 * DELETE /api/documents/[id]
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

    // Check if document exists and user has permission
    const existingDocument = await prisma.document.findUnique({
      where: { id },
      select: { authorId: true, title: true, s3Key: true, type: true },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Only author can delete
    if (existingDocument.authorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Only the author can delete this document' },
        { status: 403 }
      );
    }

    // Delete file from S3 if it exists
    if (existingDocument.s3Key) {
      const deleteResult = await deleteFromS3(existingDocument.s3Key);
      if (!deleteResult.success) {
        console.warn('Failed to delete file from S3:', deleteResult.error);
        // Continue with database deletion even if S3 deletion fails
      }
    }

    // Delete document (cascade will handle links and comments)
    await prisma.document.delete({
      where: { id },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: 'DOCUMENT_DELETED',
        entityType: 'DOCUMENT',
        entityId: id,
        userId: session.user.id,
        teamId: session.user.teamId,
        metadata: {
          documentTitle: existingDocument.title,
          documentType: existingDocument.type,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
