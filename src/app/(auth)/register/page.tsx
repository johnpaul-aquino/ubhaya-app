/**
 * Registration Page
 * /register
 */

import { RegisterForm } from '@/components/auth/register-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Ubhaya Supply Chain',
  description: 'Create a new account to get started',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
