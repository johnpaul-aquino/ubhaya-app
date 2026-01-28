/**
 * Admin Guard Utilities
 * Helper functions and middleware for admin route protection
 */

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Check if the current user is an admin
 * Use in API routes
 */
export async function isAdminUser() {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

/**
 * Get admin session or return unauthorized response
 * Use in API routes for quick validation
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      ),
      session: null,
    };
  }

  if (session.user.role !== 'ADMIN') {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      ),
      session: null,
    };
  }

  return {
    authorized: true,
    response: null,
    session,
  };
}

/**
 * Admin route handler wrapper
 * Wraps API route handlers with admin authentication
 */
export function withAdmin<T extends (...args: unknown[]) => Promise<NextResponse>>(
  handler: (session: NonNullable<Awaited<ReturnType<typeof auth>>>, ...args: Parameters<T>) => ReturnType<T>
) {
  return async (...args: Parameters<T>): ReturnType<T> => {
    const { authorized, response, session } = await requireAdmin();

    if (!authorized || !session) {
      return response as Awaited<ReturnType<T>>;
    }

    return handler(session, ...args);
  };
}
