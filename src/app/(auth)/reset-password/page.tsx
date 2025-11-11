/**
 * Reset Password Page
 * /reset-password?token=xxx
 */

import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - Ubhaya Supply Chain',
  description: 'Set a new password for your account',
};

interface ResetPasswordPageProps {
  searchParams: {
    token?: string;
  };
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token = searchParams.token;

  if (!token) {
    redirect('/forgot-password');
  }

  return <ResetPasswordForm token={token} />;
}
