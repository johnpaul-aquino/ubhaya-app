/**
 * Organization Management Page
 */

'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { OrgPageContent } from '@/components/organization';

export default function OrganizationPage() {
  return (
    <DashboardLayout>
      <OrgPageContent />
    </DashboardLayout>
  );
}
