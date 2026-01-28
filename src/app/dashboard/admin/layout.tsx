/**
 * Admin Dashboard Layout
 * Wraps all admin pages with admin-specific layout
 */

import { AdminLayout } from '@/components/admin';

export const metadata = {
  title: 'Admin | Dashboard',
  description: 'System administration and management',
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
