import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Ubhaya',
  description: 'Supply chain management dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
