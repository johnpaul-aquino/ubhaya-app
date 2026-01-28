/**
 * Admin Sidebar Component
 * Navigation for admin dashboard pages
 */

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  Layers,
  MapPin,
  Activity,
  ArrowLeft,
  Shield,
} from 'lucide-react';

const adminMenuItems = [
  {
    icon: LayoutDashboard,
    label: 'Overview',
    href: '/dashboard/admin',
  },
  {
    icon: Users,
    label: 'Users',
    href: '/dashboard/admin/users',
  },
  {
    icon: Building2,
    label: 'Organizations',
    href: '/dashboard/admin/organizations',
  },
  {
    icon: Layers,
    label: 'Teams',
    href: '/dashboard/admin/teams',
  },
  {
    icon: MapPin,
    label: 'Facilities',
    href: '/dashboard/admin/facilities',
  },
  {
    icon: Activity,
    label: 'Activity Log',
    href: '/dashboard/admin/activity',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex flex-col w-64 border-r border-border bg-card">
      {/* Admin Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">System Management</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/dashboard/admin'
            ? pathname === '/dashboard/admin'
            : pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm no-underline',
                isActive
                  ? 'bg-red-600 text-white'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
