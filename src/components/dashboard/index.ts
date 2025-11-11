/**
 * Dashboard Components Barrel Export
 * Central export point for all dashboard components
 */

export { DashboardLayout } from './dashboard-layout';
export { Navbar } from './navbar';
export { Sidebar } from './sidebar';
export { StatCard } from './stat-card';
export { ActivityFeed } from './activity-feed';
export { ContactCard } from './contact-card';
export { QuickActions } from './quick-actions';
export { ShipmentsTable } from './shipments-table';

// Skeleton Loaders
export {
  StatCardSkeleton,
  TableRowSkeleton,
  ContactCardSkeleton,
  ActivityItemSkeleton,
  DashboardPageSkeleton
} from './skeletons';

// Types
export type { ActivityItem } from '@/types/dashboard';
