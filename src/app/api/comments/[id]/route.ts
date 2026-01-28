/**
 * Individual Comment API Routes
 * PATCH /api/comments/[id] - Update a comment
 * DELETE /api/comments/[id] - Delete a comment
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateCommentSchema } from '@/lib/validations/comment';

/**
 * PATCH /api/comments/[id]
 * Update a comment (author only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: commentId } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = updateCommentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { content } = validationResult.data;

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        authorId: true,
        documentId: true,
        document: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Only author can update their comment
    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own comments' },
        { status: 403 }
      );
    }

    // Update the comment
    const updatedComment = await prisma.$transaction(async (tx) => {
      const updated = await tx.comment.update({
        where: { id: commentId },
        data: { content },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
          mentions: {
            include: {
              mentioned: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          _count: {
            select: { replies: true },
          },
        },
      });

      // Log activity
      if (comment.documentId) {
        await tx.activity.create({
          data: {
            action: 'COMMENT_UPDATED',
            entityType: 'DOCUMENT',
            entityId: comment.documentId,
            userId: session.user.id,
            metadata: {
              commentId: updated.id,
              documentTitle: comment.document?.title,
            },
          },
        });
      }

      return updated;
    });

    return NextResponse.json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    console.error('Update comment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/comments/[id]
 * Delete a comment (author or admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: commentId } = await params;

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        authorId: true,
        documentId: true,
        document: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
        _count: {
          select: { replies: true },
        },
      },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Check permissions: author, document author, or admin can delete
    const isCommentAuthor = comment.authorId === session.user.id;
    const isDocumentAuthor = comment.document?.authorId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isCommentAuthor && !isDocumentAuthor && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to delete this comment' },
        { status: 403 }
      );
    }

    // Delete the comment (cascades to replies and mentions)
    await prisma.$transaction(async (tx) => {
      await tx.comment.delete({
        where: { id: commentId },
      });

      // Log activity
      if (comment.documentId) {
        await tx.activity.create({
          data: {
            action: 'COMMENT_DELETED',
            entityType: 'DOCUMENT',
            entityId: comment.documentId,
            userId: session.user.id,
            metadata: {
              commentId,
              documentTitle: comment.document?.title,
              repliesDeleted: comment._count.replies,
            },
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
