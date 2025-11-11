import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DashboardPageSkeleton } from '@/components/dashboard/skeletons';

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <DashboardPageSkeleton />
    </DashboardLayout>
  );
}