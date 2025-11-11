/**
 * Authentication Utility Functions
 * Password hashing, token generation, and validation
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from './prisma';

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 * @param password - Plain text password
 * @param hash - Hashed password to compare against
 * @returns True if password matches
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a secure password reset token
 * @param userId - User ID to create token for
 * @returns Plain token (to send in email)
 */
export async function createPasswordResetToken(
  userId: string
): Promise<string> {
  // Generate secure random token
  const token = crypto.randomBytes(32).toString('hex');

  // Hash token for storage
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Delete any existing unused tokens for this user
  await prisma.passwordReset.deleteMany({
    where: {
      userId,
      used: false,
    },
  });

  // Store in database
  await prisma.passwordReset.create({
    data: {
      userId,
      token: hashedToken,
      expires: new Date(Date.now() + 3600000), // 1 hour
    },
  });

  return token; // Return unhashed token for email
}

/**
 * Verify and retrieve password reset token
 * @param token - Plain token from email
 * @returns Password reset record with user
 */
export async function verifyPasswordResetToken(token: string) {
  // Hash provided token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find in database
  const resetRecord = await prisma.passwordReset.findUnique({
    where: { token: hashedToken },
    include: { user: true },
  });

  // Validate
  if (!resetRecord || resetRecord.used) {
    throw new Error('Invalid or expired token');
  }

  if (resetRecord.expires < new Date()) {
    throw new Error('Token expired');
  }

  return resetRecord;
}

/**
 * Mark a password reset token as used
 * @param token - Hashed token
 */
export async function markTokenAsUsed(token: string): Promise<void> {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  await prisma.passwordReset.update({
    where: { token: hashedToken },
    data: { used: true },
  });
}

/**
 * Check if a user exists by email
 * @param email - User email
 * @returns True if user exists
 */
export async function userExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return !!user;
}
