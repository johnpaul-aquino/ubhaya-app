/**
 * Team Management Page
 * /dashboard/team
 */

'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { TeamPageContent } from '@/components/team/team-page-content';

export default function TeamPage() {
  return (
    <DashboardLayout>
      <TeamPageContent />
    </DashboardLayout>
  );
}
