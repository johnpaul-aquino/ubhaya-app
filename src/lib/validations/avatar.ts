/**
 * Avatar Validation Schema
 * Validates avatar upload parameters
 */

import { z } from 'zod';

// Maximum file size: 2MB
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

// Allowed MIME types for avatars
export const ALLOWED_AVATAR_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type AllowedAvatarType = (typeof ALLOWED_AVATAR_TYPES)[number];

/**
 * Validate avatar file on the client
 */
export function validateAvatarFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file size
  if (file.size > MAX_AVATAR_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${MAX_AVATAR_SIZE / 1024 / 1024}MB`,
    };
  }

  // Check file type
  if (!ALLOWED_AVATAR_TYPES.includes(file.type as AllowedAvatarType)) {
    return {
      valid: false,
      error: 'File must be a JPEG, PNG, or WebP image',
    };
  }

  return { valid: true };
}

/**
 * Avatar upload response schema
 */
export const avatarUploadResponseSchema = z.object({
  success: z.boolean(),
  avatarUrl: z.string().optional(),
  error: z.string().optional(),
});

export type AvatarUploadResponse = z.infer<typeof avatarUploadResponseSchema>;
