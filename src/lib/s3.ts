/**
 * AWS S3 Utility Functions
 * Handles file uploads, downloads, and presigned URLs for S3
 */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 Client Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

// Allowed file types and their MIME types
export const ALLOWED_FILE_TYPES = {
  // Documents
  'application/pdf': { ext: 'pdf', category: 'document' },
  'application/msword': { ext: 'doc', category: 'document' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: 'docx', category: 'document' },
  'application/vnd.ms-excel': { ext: 'xls', category: 'document' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { ext: 'xlsx', category: 'document' },
  'application/vnd.ms-powerpoint': { ext: 'ppt', category: 'document' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { ext: 'pptx', category: 'document' },
  'text/plain': { ext: 'txt', category: 'document' },
  'text/csv': { ext: 'csv', category: 'document' },

  // Images
  'image/jpeg': { ext: 'jpg', category: 'image' },
  'image/png': { ext: 'png', category: 'image' },
  'image/gif': { ext: 'gif', category: 'image' },
  'image/webp': { ext: 'webp', category: 'image' },
  'image/svg+xml': { ext: 'svg', category: 'image' },

  // Archives
  'application/zip': { ext: 'zip', category: 'archive' },
  'application/x-rar-compressed': { ext: 'rar', category: 'archive' },
} as const;

export type AllowedMimeType = keyof typeof ALLOWED_FILE_TYPES;
export type FileCategory = 'document' | 'image' | 'archive';

// Maximum file size (50MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Generate a unique S3 key for a file
 */
export function generateS3Key(
  userId: string,
  fileName: string,
  category: FileCategory = 'document'
): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${category}s/${userId}/${timestamp}-${randomStr}-${sanitizedName}`;
}

/**
 * Upload a file to S3
 */
export async function uploadToS3(
  file: Buffer,
  key: string,
  contentType: string,
  metadata?: Record<string, string>
): Promise<{ success: true; key: string; url: string } | { success: false; error: string }> {
  try {
    if (!BUCKET_NAME) {
      return { success: false, error: 'S3 bucket not configured' };
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      Metadata: metadata,
    });

    await s3Client.send(command);

    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { success: true, key, url };
  } catch (error) {
    console.error('S3 upload error:', error);
    return { success: false, error: 'Failed to upload file to S3' };
  }
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(
  key: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    if (!BUCKET_NAME) {
      return { success: false, error: 'S3 bucket not configured' };
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    return { success: true };
  } catch (error) {
    console.error('S3 delete error:', error);
    return { success: false, error: 'Failed to delete file from S3' };
  }
}

/**
 * Generate a presigned URL for downloading a file
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    if (!BUCKET_NAME) {
      return { success: false, error: 'S3 bucket not configured' };
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return { success: true, url };
  } catch (error) {
    console.error('S3 presigned URL error:', error);
    return { success: false, error: 'Failed to generate download URL' };
  }
}

/**
 * Generate a presigned URL for uploading a file (client-side upload)
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<{ success: true; url: string; key: string } | { success: false; error: string }> {
  try {
    if (!BUCKET_NAME) {
      return { success: false, error: 'S3 bucket not configured' };
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return { success: true, url, key };
  } catch (error) {
    console.error('S3 presigned upload URL error:', error);
    return { success: false, error: 'Failed to generate upload URL' };
  }
}

/**
 * Check if a file exists in S3
 */
export async function fileExistsInS3(
  key: string
): Promise<boolean> {
  try {
    if (!BUCKET_NAME) {
      return false;
    }

    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate file type and size
 */
export function validateFile(
  contentType: string,
  size: number
): { valid: true; category: FileCategory } | { valid: false; error: string } {
  // Check if file type is allowed
  if (!(contentType in ALLOWED_FILE_TYPES)) {
    return { valid: false, error: `File type ${contentType} is not allowed` };
  }

  // Check file size
  if (size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds maximum allowed (${MAX_FILE_SIZE / 1024 / 1024}MB)` };
  }

  const fileInfo = ALLOWED_FILE_TYPES[contentType as AllowedMimeType];
  return { valid: true, category: fileInfo.category };
}

/**
 * Get file extension from content type
 */
export function getExtensionFromContentType(contentType: string): string | null {
  const fileInfo = ALLOWED_FILE_TYPES[contentType as AllowedMimeType];
  return fileInfo?.ext || null;
}

/**
 * Get the public URL for a file
 */
export function getPublicUrl(key: string): string {
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
