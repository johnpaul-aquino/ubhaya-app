/**
 * Login Page
 * /login
 */

import { LoginForm } from '@/components/auth/login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Ubhaya Supply Chain',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return <LoginForm />;
}
