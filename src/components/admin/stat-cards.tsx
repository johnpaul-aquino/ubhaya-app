/**
 * Admin Stat Cards Component
 * Display statistics cards for admin dashboard
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Building2, Layers, FileText, UserCheck, MapPin } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  totalTeams: number;
  totalDocuments: number;
  totalContacts: number;
  totalFacilities: number;
}

interface StatCardsProps {
  stats: AdminStats | null;
  loading?: boolean;
}

export function StatCards({ stats, loading }: StatCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      subtitle: `${stats.activeUsers} active`,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Organizations',
      value: stats.totalOrganizations,
      subtitle: 'Active organizations',
      icon: Building2,
      color: 'purple',
    },
    {
      title: 'Teams',
      value: stats.totalTeams,
      subtitle: 'Across all organizations',
      icon: Layers,
      color: 'green',
    },
    {
      title: 'Documents',
      value: stats.totalDocuments,
      subtitle: 'Total documents',
      icon: FileText,
      color: 'amber',
    },
    {
      title: 'Contacts',
      value: stats.totalContacts,
      subtitle: 'Business contacts',
      icon: UserCheck,
      color: 'pink',
    },
    {
      title: 'Facilities',
      value: stats.totalFacilities,
      subtitle: 'In database',
      icon: MapPin,
      color: 'cyan',
    },
  ];

  const colorClasses: Record<string, { border: string; bg: string; icon: string }> = {
    blue: {
      border: 'border-l-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
      border: 'border-l-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      icon: 'text-purple-600 dark:text-purple-400',
    },
    green: {
      border: 'border-l-green-500',
      bg: 'bg-green-100 dark:bg-green-900/30',
      icon: 'text-green-600 dark:text-green-400',
    },
    amber: {
      border: 'border-l-amber-500',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      icon: 'text-amber-600 dark:text-amber-400',
    },
    pink: {
      border: 'border-l-pink-500',
      bg: 'bg-pink-100 dark:bg-pink-900/30',
      icon: 'text-pink-600 dark:text-pink-400',
    },
    cyan: {
      border: 'border-l-cyan-500',
      bg: 'bg-cyan-100 dark:bg-cyan-900/30',
      icon: 'text-cyan-600 dark:text-cyan-400',
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statItems.map((item) => {
        const Icon = item.icon;
        const colors = colorClasses[item.color];

        return (
          <Card key={item.title} className={`border-l-4 ${colors.border}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <Icon className={`h-4 w-4 ${colors.icon}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
