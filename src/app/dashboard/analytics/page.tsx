'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import {
  ShipmentTrendsChart,
  FacilityUtilizationChart,
  StatusDistributionChart,
  DailyActivityChart
} from '@/components/dashboard/dashboard-charts';
import { StatCard } from '@/components/dashboard/stat-card';
import { BlurFade } from '@/components/ui/blur-fade';
import { TrendingUp, Package, Users, Clock, Activity, Target, BarChart3, PieChart } from 'lucide-react';

/**
 * Analytics Dashboard Page
 * Data visualization and analytics for supply chain metrics
 */
export default function AnalyticsPage() {
  const analyticsStats = [
    {
      label: 'Total Shipments',
      value: 1284,
      icon: <Package className="h-4 w-4" />,
      change: { value: 12, direction: 'up' as const, label: 'vs last month' }
    },
    {
      label: 'On-Time Delivery',
      value: '94.5%',
      icon: <Target className="h-4 w-4" />,
      change: { value: 2.3, direction: 'up' as const, label: 'improvement' }
    },
    {
      label: 'Active Facilities',
      value: 42,
      icon: <Activity className="h-4 w-4" />,
      change: { value: 3, direction: 'up' as const, label: 'new this month' }
    },
    {
      label: 'Avg Processing',
      value: '2.4 days',
      icon: <Clock className="h-4 w-4" />,
      change: { value: 0.3, direction: 'down' as const, label: 'faster' }
    }
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <BlurFade delay={0.1} inView>
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track performance metrics and visualize your supply chain data
          </p>
        </div>
      </BlurFade>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
        {analyticsStats.map((stat, index) => (
          <BlurFade key={index} delay={0.2 + index * 0.1} inView>
            <StatCard
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              animated
              prefix={stat.label === 'Total Shipments' ? '' : ''}
              suffix={stat.label === 'On-Time Delivery' ? '' : ''}
            />
          </BlurFade>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:gap-8">
        {/* Trends Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BlurFade delay={0.6} inView>
            <ShipmentTrendsChart />
          </BlurFade>
          <BlurFade delay={0.7} inView>
            <FacilityUtilizationChart />
          </BlurFade>
        </div>

        {/* Distribution Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BlurFade delay={0.8} inView className="lg:col-span-1">
            <StatusDistributionChart />
          </BlurFade>
          <BlurFade delay={0.9} inView className="lg:col-span-2">
            <DailyActivityChart />
          </BlurFade>
        </div>
      </div>
    </DashboardLayout>
  );
}