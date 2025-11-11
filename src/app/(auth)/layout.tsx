/**
 * Authentication Layout
 * Centered layout for login, register, and password reset pages
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Ubhaya Supply Chain',
  description: 'Sign in or create an account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-md px-4 py-8">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ubhaya
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Supply Chain Management Platform
          </p>
        </div>

        {/* Auth content */}
        {children}
      </div>
    </div>
  );
}
