'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { Search, UserPlus } from 'lucide-react';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  color?: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  className?: string;
}

const defaultActions: QuickAction[] = [
  {
    icon: <Search className="h-5 w-5" />,
    label: 'Search Facilities',
    href: '/dashboard/facilities',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: <UserPlus className="h-5 w-5" />,
    label: 'Add Contact',
    href: '/dashboard/contacts',
    color: 'from-green-500 to-green-600',
  },
];

/**
 * Quick Actions Component
 * Grid of action buttons for common dashboard tasks
 */
export function QuickActions({
  actions = defaultActions,
  className,
}: QuickActionsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-primary">⚡</span> Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const content = (
              <ShimmerButton
                className="w-full h-full"
                background={`linear-gradient(135deg, ${action.color || 'from-primary to-primary/80'})`}
                onClick={action.onClick}
              >
                <div className="flex flex-col items-center gap-2 p-3">
                  <div className="text-white">{action.icon}</div>
                  <span className="text-xs font-medium text-center text-white">
                    {action.label}
                  </span>
                </div>
              </ShimmerButton>
            );

            if (action.href) {
              return (
                <Link key={index} href={action.href}>
                  {content}
                </Link>
              );
            }

            return <div key={index}>{content}</div>;
          })}
        </div>
      </CardContent>
    </Card>
  );
}
