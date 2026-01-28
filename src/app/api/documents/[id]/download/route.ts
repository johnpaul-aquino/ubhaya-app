/**
 * Document Download API Route
 * GET /api/documents/[id]/download - Get presigned download URL
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPresignedDownloadUrl } from '@/lib/s3';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Get presigned download URL for a document
 * GET /api/documents/[id]/download
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
      select: {
        authorId: true,
        visibility: true,
        teamId: true,
        type: true,
        s3Key: true,
        fileName: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check if this is a file type document
    if (document.type !== 'FILE' || !document.s3Key) {
      return NextResponse.json(
        { success: false, error: 'This document is not a downloadable file' },
        { status: 400 }
      );
    }

    // Check permission - user can download if they are author, document is shared, same team, or same organization
    const canDownload =
      document.authorId === session.user.id ||
      document.visibility === 'SHARED' ||
      (document.visibility === 'TEAM' && document.teamId === session.user.teamId) ||
      (document.visibility === 'ORGANIZATION' && document.organizationId === session.user.organizationId);

    if (!canDownload) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Generate presigned URL
    const urlResult = await getPresignedDownloadUrl(document.s3Key, 3600); // 1 hour

    if (!urlResult.success) {
      return NextResponse.json(
        { success: false, error: urlResult.error },
        { status: 500 }
      );
    }

    // Log download activity
    await prisma.activity.create({
      data: {
        action: 'FILE_DOWNLOADED',
        entityType: 'DOCUMENT',
        entityId: id,
        userId: session.user.id,
        teamId: session.user.teamId,
        metadata: {
          fileName: document.fileName,
        },
      },
    });

    return NextResponse.json({
      success: true,
      downloadUrl: urlResult.url,
      fileName: document.fileName,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error('Get download URL error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}
