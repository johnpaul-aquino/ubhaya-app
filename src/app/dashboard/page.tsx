'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { SearchableShipmentsTable } from '@/components/dashboard/searchable-shipments-table';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ContactCard } from '@/components/dashboard/contact-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlurFade } from '@/components/ui/blur-fade';
import {
  mockStats,
  mockShipments,
  mockContacts,
  mockActivityItems,
  mockUpcomingArrivals,
  mockDocuments,
} from '@/lib/dashboard-data';
import { Package, Users, TrendingUp, Clock } from 'lucide-react';

/**
 * Dashboard Home Page
 * Main dashboard displaying KPIs, recent activities, and quick actions
 */
export default function DashboardPage() {
  // Add icons to stats for better visual hierarchy
  const statsWithIcons = mockStats.map((stat, index) => ({
    ...stat,
    icon: [
      <Package key="package" className="h-4 w-4" />,
      <Users key="users" className="h-4 w-4" />,
      <TrendingUp key="trending" className="h-4 w-4" />,
      <Clock key="clock" className="h-4 w-4" />
    ][index]
  }));

  return (
    <DashboardLayout>
      {/* Page Header */}
      <BlurFade delay={0.1} inView>
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your supply chain today.
          </p>
        </div>
      </BlurFade>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
        {statsWithIcons.map((stat, index) => (
          <BlurFade key={index} delay={0.2 + index * 0.1} inView>
            <StatCard
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              change={
                stat.change?.value > 0
                  ? {
                      value: stat.change.value,
                      direction:
                        stat.label === 'Pending Tasks' ? 'down' : 'up',
                      label: stat.change.label,
                    }
                  : undefined
              }
            />
          </BlurFade>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Searchable Urgent Shipments */}
          <BlurFade delay={0.6} inView>
            <SearchableShipmentsTable
              shipments={mockShipments}
            />
          </BlurFade>

          {/* Recent Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>👥 Recent Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockContacts.slice(0, 3).map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    showToggle
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Facility Search */}
          <Card>
            <CardHeader>
              <CardTitle>🔍 Quick Facility Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search facilities..."
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <select className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option>Location near me</option>
                    <option>Mumbai</option>
                    <option>Delhi</option>
                    <option>Bangalore</option>
                  </select>
                  <select className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option>All Countries</option>
                    <option>India</option>
                    <option>Philippines</option>
                    <option>Singapore</option>
                  </select>
                  <select className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option>All Categories</option>
                    <option>Warehouse</option>
                    <option>Manufacturing</option>
                    <option>Distribution</option>
                  </select>
                </div>
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Search Facilities
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Team Activity */}
          <Card>
            <CardHeader>
              <CardTitle>👨‍👩‍👧‍👦 Team Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed items={mockActivityItems} />
            </CardContent>
          </Card>

          {/* Upcoming Arrivals */}
          <Card>
            <CardHeader>
              <CardTitle>📅 Upcoming Arrivals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: 'Dec 2', count: 3 },
                  { date: 'Dec 3', count: 5 },
                ].map((group) => (
                  <div
                    key={group.date}
                    className="p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-sm">Today ({group.date})</strong>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        {group.count} shipments
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {mockUpcomingArrivals
                        .filter(
                          (arrival) =>
                            arrival.date === group.date ||
                            (group.date === 'Dec 3' && arrival.id > '3')
                        )
                        .slice(0, 3)
                        .map((arrival) => (
                          <div key={arrival.id}>
                            • {arrival.shipmentNumber} - {arrival.location}
                          </div>
                        ))}
                      {group.count > 3 && (
                        <div className="text-xs text-primary font-medium">
                          + {group.count - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <CardTitle>📄 Recent Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span>
                      {doc.type === 'pdf'
                        ? '📄'
                        : doc.type === 'note'
                          ? '📝'
                          : '📊'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {typeof doc.size === 'string' && doc.size}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {doc.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
