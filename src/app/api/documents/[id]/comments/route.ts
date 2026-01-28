/**
 * Document Comments API Routes
 * GET /api/documents/[id]/comments - List comments for a document
 * POST /api/documents/[id]/comments - Create a new comment
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createCommentSchema, commentQuerySchema } from '@/lib/validations/comment';

/**
 * Parse @mentions from comment content
 * Returns array of user IDs mentioned
 */
function parseMentions(content: string): string[] {
  // Match @[userId] pattern
  const mentionPattern = /@\[([a-z0-9]+)\]/gi;
  const matches = content.matchAll(mentionPattern);
  const userIds: string[] = [];

  for (const match of matches) {
    if (match[1]) {
      userIds.push(match[1]);
    }
  }

  return [...new Set(userIds)]; // Remove duplicates
}

/**
 * GET /api/documents/[id]/comments
 * List comments for a document with pagination
 */
export async function GET(
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

    const { id: documentId } = await params;
    const { searchParams } = new URL(request.url);

    // Parse query params
    const queryResult = commentQuerySchema.safeParse({
      documentId,
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: queryResult.error.flatten() },
        { status: 400 }
      );
    }

    const { page, pageSize } = queryResult.data;

    // Check if document exists and user has access
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: {
        id: true,
        authorId: true,
        visibility: true,
        teamId: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    const hasAccess = await checkDocumentAccess(document, session.user.id, session.user.teamId);
    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Fetch top-level comments (no parentId) with their replies
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          documentId,
          parentId: null, // Only top-level comments
        },
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
              mentionedUser: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          replies: {
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
                  mentionedUser: {
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
            orderBy: { createdAt: 'asc' },
            take: 5, // Limit nested replies
          },
          _count: {
            select: { replies: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.comment.count({
        where: {
          documentId,
          parentId: null,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      comments,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/documents/[id]/comments
 * Create a new comment on a document
 */
export async function POST(
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

    const { id: documentId } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = createCommentSchema.safeParse({
      ...body,
      documentId,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { content, parentId } = validationResult.data;

    // Check if document exists and user has access
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: {
        id: true,
        title: true,
        authorId: true,
        visibility: true,
        teamId: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    const hasAccess = await checkDocumentAccess(document, session.user.id, session.user.teamId);
    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // If replying, verify parent comment exists and belongs to this document
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { documentId: true },
      });

      if (!parentComment || parentComment.documentId !== documentId) {
        return NextResponse.json(
          { success: false, error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    // Parse mentions from content
    const mentionedUserIds = parseMentions(content);

    // Create comment with mentions in a transaction
    const comment = await prisma.$transaction(async (tx) => {
      // Create the comment
      const newComment = await tx.comment.create({
        data: {
          content,
          documentId,
          authorId: session.user.id,
          parentId: parentId || null,
        },
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
        },
      });

      // Create mentions if any
      if (mentionedUserIds.length > 0) {
        // Verify mentioned users exist
        const validUsers = await tx.user.findMany({
          where: { id: { in: mentionedUserIds } },
          select: { id: true, firstName: true, lastName: true },
        });

        const validUserIds = validUsers.map(u => u.id);

        // Create mention records
        await tx.mention.createMany({
          data: validUserIds.map(userId => ({
            commentId: newComment.id,
            mentionerId: session.user.id,
            mentionedId: userId,
          })),
        });

        // Create notifications for mentioned users (excluding self-mentions)
        const notificationsData = validUsers
          .filter(u => u.id !== session.user.id)
          .map(user => ({
            type: 'MENTION' as const,
            title: 'You were mentioned',
            message: `${session.user.firstName} ${session.user.lastName} mentioned you in a comment on "${document.title}"`,
            userId: user.id,
            entityType: 'COMMENT' as const,
            entityId: newComment.id,
          }));

        if (notificationsData.length > 0) {
          await tx.notification.createMany({ data: notificationsData });
        }
      }

      // Notify document author of new comment (if not the commenter)
      if (document.authorId !== session.user.id) {
        await tx.notification.create({
          data: {
            type: 'COMMENT',
            title: 'New comment on your document',
            message: `${session.user.firstName} ${session.user.lastName} commented on "${document.title}"`,
            userId: document.authorId,
            entityType: 'DOCUMENT',
            entityId: documentId,
          },
        });
      }

      // Log activity
      await tx.activity.create({
        data: {
          action: 'COMMENT_ADDED',
          entityType: 'DOCUMENT',
          entityId: documentId,
          userId: session.user.id,
          metadata: {
            commentId: newComment.id,
            documentTitle: document.title,
            isReply: !!parentId,
          },
        },
      });

      return newComment;
    });

    // Fetch the complete comment with mentions
    const completeComment = await prisma.comment.findUnique({
      where: { id: comment.id },
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
            mentionedUser: {
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

    return NextResponse.json({
      success: true,
      comment: completeComment,
    }, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

/**
 * Check if user has access to the document
 */
async function checkDocumentAccess(
  document: { authorId: string; visibility: string; teamId: string | null },
  userId: string,
  userTeamId: string | null | undefined
): Promise<boolean> {
  // Author always has access
  if (document.authorId === userId) return true;

  // Shared documents are accessible to all
  if (document.visibility === 'SHARED') return true;

  // Team documents are accessible to team members
  if (document.visibility === 'TEAM' && document.teamId) {
    // Check if user is member of the document's team
    const membership = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: document.teamId,
        },
      },
    });
    return !!membership;
  }

  // Private documents are only accessible to the author
  return false;
}
