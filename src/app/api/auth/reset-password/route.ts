/**
 * Password Reset API Routes
 * POST /api/auth/reset-password (request reset)
 * PUT /api/auth/reset-password (confirm reset with token)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  createPasswordResetToken,
  verifyPasswordResetToken,
  hashPassword,
  markTokenAsUsed,
} from '@/lib/auth-utils';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/lib/validations/auth';
import { sendPasswordResetEmail } from '@/lib/email';

/**
 * Request Password Reset
 * POST /api/auth/reset-password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success (don't reveal if email exists)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If this email exists, a reset link has been sent',
      });
    }

    // Create reset token
    const token = await createPasswordResetToken(user.id);

    // Send email with reset link
    await sendPasswordResetEmail(user.email, user.firstName, token);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Password reset token for ${email}: ${token}`);
      console.log(
        `Reset link: ${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
      );
    }

    return NextResponse.json({
      success: true,
      message: 'If this email exists, a reset link has been sent',
      // Include token in development for testing
      ...(process.env.NODE_ENV === 'development' && { token }),
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing your request',
      },
      { status: 500 }
    );
  }
}

/**
 * Confirm Password Reset
 * PUT /api/auth/reset-password
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = resetPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { token, password } = validationResult.data;

    // Verify token
    let resetRecord;
    try {
      resetRecord = await verifyPasswordResetToken(token);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error ? error.message : 'Invalid or expired token',
        },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user password
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash },
    });

    // Mark token as used
    await markTokenAsUsed(token);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Password reset confirm error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while resetting your password',
      },
      { status: 500 }
    );
  }
}
