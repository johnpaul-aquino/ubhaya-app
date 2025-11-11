'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Skeleton loader for StatCard component
 */
export function StatCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-[120px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton loader for table rows
 */
export function TableRowSkeleton() {
  return (
    <tr className="border-b">
      <td className="p-4">
        <Skeleton className="h-4 w-[100px]" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-[150px]" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-[120px]" />
      </td>
      <td className="p-4">
        <Skeleton className="h-6 w-[80px] rounded-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-[100px]" />
      </td>
    </tr>
  );
}

/**
 * Skeleton loader for ContactCard component
 */
export function ContactCardSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
          <Skeleton className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[180px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[100px]" />
          <Skeleton className="h-9 w-[80px]" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton loader for activity feed items
 */
export function ActivityItemSkeleton() {
  return (
    <div className="flex items-start gap-3 py-3">
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-3 w-[80px]" />
      </div>
    </div>
  );
}

/**
 * Skeleton loader for the entire dashboard page
 */
export function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Title Skeleton */}
      <div>
        <Skeleton className="h-8 w-[200px] mb-2" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}