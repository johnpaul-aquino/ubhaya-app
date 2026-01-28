/**
 * Avatar API Routes
 * Handle avatar upload and deletion
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  uploadToS3,
  deleteFromS3,
  generateS3Key,
} from '@/lib/s3';
import {
  MAX_AVATAR_SIZE,
  ALLOWED_AVATAR_TYPES,
  type AllowedAvatarType,
} from '@/lib/validations/avatar';

/**
 * POST /api/user/avatar
 * Upload a new avatar
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

    const formData = await request.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_AVATAR_TYPES.includes(file.type as AllowedAvatarType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Must be JPEG, PNG, or WebP.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_AVATAR_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size must be less than ${MAX_AVATAR_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Get the current user to check if they have an existing avatar
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { avatar: true },
    });

    // Delete old avatar from S3 if it exists
    if (currentUser?.avatar) {
      // Extract the key from the URL
      const urlParts = currentUser.avatar.split('/');
      const oldKey = urlParts.slice(3).join('/'); // Get everything after bucket URL
      if (oldKey.startsWith('avatars/')) {
        await deleteFromS3(oldKey);
      }
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate S3 key for avatar
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const key = `avatars/${session.user.id}/${Date.now()}.${fileExtension}`;

    // Upload to S3
    const uploadResult = await uploadToS3(buffer, key, file.type);

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error },
        { status: 500 }
      );
    }

    // Update user avatar in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: uploadResult.url },
    });

    return NextResponse.json({
      success: true,
      avatarUrl: uploadResult.url,
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/avatar
 * Remove the current avatar
 */
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current user avatar
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { avatar: true },
    });

    if (!user?.avatar) {
      return NextResponse.json(
        { success: false, error: 'No avatar to remove' },
        { status: 400 }
      );
    }

    // Extract the key from the URL and delete from S3
    const urlParts = user.avatar.split('/');
    const key = urlParts.slice(3).join('/'); // Get everything after bucket URL
    if (key.startsWith('avatars/')) {
      const deleteResult = await deleteFromS3(key);
      if (!deleteResult.success) {
        console.error('Failed to delete avatar from S3:', deleteResult.error);
        // Continue anyway to update the database
      }
    }

    // Update user to remove avatar
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Avatar delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove avatar' },
      { status: 500 }
    );
  }
}
