/**
 * Next.js Middleware
 * Handles authentication and route protection with role-based access control
 */

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { UserRole } from '@prisma/client';

// Define protected routes (require authentication)
const protectedRoutes = ['/dashboard'];

// Define auth routes (redirect to dashboard if already logged in)
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

// Define admin-only routes
const adminRoutes = ['/dashboard/admin'];

// Define team leader routes (team leader or admin can access)
// Note: /dashboard/team is accessible to all authenticated users
// Team management features within the page handle role-based permissions
const teamLeaderRoutes: string[] = [];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session
  const session = await auth();

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Check if route requires admin access
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Check if route requires team leader access
  const isTeamLeaderRoute = teamLeaderRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth route with active session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Role-based access control
  if (session?.user) {
    const userRole = session.user.role as UserRole;

    // Check admin-only routes
    if (isAdminRoute && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
    }

    // Check team leader routes (TEAM_LEADER or ADMIN)
    if (isTeamLeaderRoute && !['TEAM_LEADER', 'ADMIN'].includes(userRole)) {
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
