'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, MapPin, Package, Users, Calculator, FileText, Users2, Settings, BarChart3 } from 'lucide-react';

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    href: '/dashboard/analytics',
  },
  {
    icon: MapPin,
    label: 'Facilities',
    href: '/dashboard/facilities',
  },
  {
    icon: Package,
    label: 'Shipments',
    href: '/dashboard/shipments',
  },
  {
    icon: Users,
    label: 'Contacts',
    href: '/dashboard/contacts',
  },
  {
    icon: Calculator,
    label: 'Shipping Calculator',
    href: '/dashboard/calculator',
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
    icon: Settings,
    label: 'Settings',
    href: '/dashboard/settings',
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
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm',
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
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p className="font-semibold mb-2">Quick Actions</p>
          <div className="space-y-1">
            <button className="w-full text-left px-2 py-1 rounded hover:bg-muted/50 text-xs">
              💬 Add WhatsApp
            </button>
            <button className="w-full text-left px-2 py-1 rounded hover:bg-muted/50 text-xs">
              ➕ New Contact
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
