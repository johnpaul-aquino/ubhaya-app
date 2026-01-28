'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, MapPin, Users, FileText, Users2, Calculator, Building2, Shield } from 'lucide-react';

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: MapPin,
    label: 'Facilities',
    href: '/dashboard/facilities',
  },
  {
    icon: Users,
    label: 'Contacts',
    href: '/dashboard/contacts',
  },
  {
    icon: FileText,
    label: 'Documents',
    href: '/dashboard/documents',
  },
  {
    icon: Users2,
    label: 'Team',
    href: '/dashboard/team',
  },
  {
    icon: Building2,
    label: 'Organization',
    href: '/dashboard/organization',
  },
  {
    icon: Calculator,
    label: 'Shipment Calc',
    href: '/dashboard/shipment-calculator',
  },
];

interface SidebarProps {
  isMobileOpen?: boolean;
}

/**
 * Dashboard Sidebar Component
 * Navigation menu for dashboard pages
 */
export function Sidebar({ isMobileOpen = false }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <aside
      id="dashboard-sidebar"
      className={cn(
        'fixed md:relative inset-y-0 left-0 z-40 flex flex-col w-64 border-r border-border bg-card transform transition-transform duration-200 ease-in-out',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm no-underline',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Admin Section - Only visible to admins */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <div className="border-t border-border" />
            </div>
            <Link
              href="/dashboard/admin"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm no-underline',
                pathname.startsWith('/dashboard/admin')
                  ? 'bg-red-600 text-white'
                  : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
              )}
            >
              <Shield className="h-5 w-5 flex-shrink-0" />
              <span>Admin Panel</span>
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
