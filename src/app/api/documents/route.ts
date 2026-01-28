/**
 * Documents API Routes
 * GET /api/documents - List documents with pagination and filters
 * POST /api/documents - Create a new document or upload a file
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createDocumentSchema, fileUploadSchema, documentQuerySchema } from '@/lib/validations';
import { uploadToS3, generateS3Key, validateFile, getExtensionFromContentType } from '@/lib/s3';
import { Prisma } from '@prisma/client';

/**
 * Get documents list
 * GET /api/documents
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
    const queryResult = documentQuerySchema.safeParse({
      search: searchParams.get('search') || undefined,
      type: searchParams.get('type') || undefined,
      visibility: searchParams.get('visibility') || undefined,
      teamId: searchParams.get('teamId') || undefined,
      authorId: searchParams.get('authorId') || undefined,
      linkedContactId: searchParams.get('linkedContactId') || undefined,
      linkedFacilityId: searchParams.get('linkedFacilityId') || undefined,
      page: searchParams.get('page') || 1,
      pageSize: searchParams.get('pageSize') || 20,
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: queryResult.error.flatten() },
        { status: 400 }
      );
    }

    const {
      search,
      type,
      visibility,
      teamId,
      authorId,
      linkedContactId,
      linkedFacilityId,
      page,
      pageSize,
    } = queryResult.data;

    // Build where clause - user can see their own documents, team documents, org documents, and shared documents
    const where: Prisma.DocumentWhereInput = {
      OR: [
        // User's own documents
        { authorId: session.user.id },
        // Team documents (if user is part of a team)
        ...(session.user.teamId
          ? [{ teamId: session.user.teamId, visibility: 'TEAM' as const }]
          : []),
        // Organization documents (if user is part of an organization)
        ...(session.user.organizationId
          ? [{ organizationId: session.user.organizationId, visibility: 'ORGANIZATION' as const }]
          : []),
        // Shared documents
        { visibility: 'SHARED' as const },
      ],
    };

    // Add search filter
    if (search) {
      where.AND = [
        {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
            { fileName: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    // Add type filter
    if (type) {
      where.type = type;
    }

    // Add visibility filter
    if (visibility) {
      where.visibility = visibility;
    }

    // Add team filter
    if (teamId) {
      where.teamId = teamId;
    }

    // Add author filter
    if (authorId) {
      where.authorId = authorId;
    }

    // Add linked contact filter
    if (linkedContactId) {
      where.links = {
        some: { contactId: linkedContactId },
      };
    }

    // Add linked facility filter
    if (linkedFacilityId) {
      where.links = {
        some: { facilityId: linkedFacilityId },
      };
    }

    // Get total count
    const total = await prisma.document.count({ where });

    // Get documents with pagination
    const documents = await prisma.document.findMany({
      where,
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
              },
            },
          },
        },
        _count: {
          select: {
            links: true,
            comments: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      success: true,
      documents,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

/**
 * Create a new document or upload a file
 * POST /api/documents
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

    const contentType = request.headers.get('content-type') || '';

    // Handle file upload (multipart form data)
    if (contentType.includes('multipart/form-data')) {
      return handleFileUpload(request, session.user.id, session.user.teamId);
    }

    // Handle document/note creation (JSON)
    const body = await request.json();
    const validationResult = createDocumentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Create document
    const document = await prisma.document.create({
      data: {
        title: data.title,
        content: data.content || null,
        contentJson: data.contentJson || null,
        contentFormat: data.contentFormat || 'PLAIN',
        type: data.type,
        visibility: data.visibility,
        authorId: session.user.id,
        teamId: data.visibility === 'TEAM' ? (data.teamId || session.user.teamId) : null,
        organizationId: data.visibility === 'ORGANIZATION' ? session.user.organizationId : null,
      },
      include: {
        author: {
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
        action: 'DOCUMENT_CREATED',
        entityType: 'DOCUMENT',
        entityId: document.id,
        userId: session.user.id,
        teamId: session.user.teamId,
        metadata: {
          documentTitle: document.title,
          documentType: document.type,
        },
      },
    });

    return NextResponse.json(
      { success: true, document },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create document error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create document' },
      { status: 500 }
    );
  }
}

/**
 * Handle file upload
 */
async function handleFileUpload(
  request: NextRequest,
  userId: string,
  teamId?: string | null
) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string || '';
    const visibility = formData.get('visibility') as string || 'PRIVATE';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const fileValidation = validateFile(file.type, file.size);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { success: false, error: fileValidation.error },
        { status: 400 }
      );
    }

    // Validate metadata
    const metadataValidation = fileUploadSchema.safeParse({
      title: title || file.name,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      visibility,
    });

    if (!metadataValidation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid file metadata', details: metadataValidation.error.flatten() },
        { status: 400 }
      );
    }

    // Generate S3 key
    const s3Key = generateS3Key(userId, file.name, fileValidation.category);

    // Upload to S3
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadToS3(fileBuffer, s3Key, file.type, {
      'original-name': file.name,
      'uploaded-by': userId,
    });

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error },
        { status: 500 }
      );
    }

    // Create document record
    const document = await prisma.document.create({
      data: {
        title: metadataValidation.data.title,
        type: 'FILE',
        visibility: metadataValidation.data.visibility,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        fileUrl: uploadResult.url,
        s3Key: s3Key,
        authorId: userId,
        teamId: visibility === 'TEAM' ? teamId : null,
      },
      include: {
        author: {
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
        action: 'FILE_UPLOADED',
        entityType: 'DOCUMENT',
        entityId: document.id,
        userId: userId,
        teamId: teamId,
        metadata: {
          documentTitle: document.title,
          fileName: file.name,
          fileSize: file.size,
        },
      },
    });

    return NextResponse.json(
      { success: true, document },
      { status: 201 }
    );
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
