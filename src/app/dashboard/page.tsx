'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BlurFade } from '@/components/ui/blur-fade';
import {
  MapPin,
  Users,
  FileText,
  Users2,
  Plus,
  ArrowRight,
  Building2,
  StickyNote,
  FolderOpen,
} from 'lucide-react';

interface DashboardStats {
  facilities: number;
  contacts: number;
  documents: number;
  teamMembers: number;
}

/**
 * Dashboard Home Page
 * Overview of all features with real-time stats
 */
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch stats from all APIs in parallel
        const [facilitiesRes, contactsRes, documentsRes, teamRes] = await Promise.all([
          fetch('/api/facilities?pageSize=1').catch(() => null),
          fetch('/api/contacts?pageSize=1').catch(() => null),
          fetch('/api/documents?pageSize=1').catch(() => null),
          fetch('/api/team/members?pageSize=1').catch(() => null),
        ]);

        const [facilitiesData, contactsData, documentsData, teamData] = await Promise.all([
          facilitiesRes?.json().catch(() => ({})),
          contactsRes?.json().catch(() => ({})),
          documentsRes?.json().catch(() => ({})),
          teamRes?.json().catch(() => ({})),
        ]);

        setStats({
          facilities: facilitiesData?.pagination?.total || 0,
          contacts: contactsData?.pagination?.total || 0,
          documents: documentsData?.pagination?.total || 0,
          teamMembers: teamData?.pagination?.total || teamData?.members?.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats({ facilities: 0, contacts: 0, documents: 0, teamMembers: 0 });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const featureCards = [
    {
      title: 'Facilities',
      description: 'Manage warehouses, ports, and logistics centers',
      icon: MapPin,
      href: '/dashboard/facilities',
      stat: stats?.facilities,
      statLabel: 'facilities',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      action: 'View Facilities',
    },
    {
      title: 'Contacts',
      description: 'Manage your business contacts and relationships',
      icon: Users,
      href: '/dashboard/contacts',
      stat: stats?.contacts,
      statLabel: 'contacts',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      action: 'View Contacts',
    },
    {
      title: 'Documents',
      description: 'Store notes, files, and important documents',
      icon: FileText,
      href: '/dashboard/documents',
      stat: stats?.documents,
      statLabel: 'documents',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      action: 'View Documents',
    },
    {
      title: 'Team',
      description: 'Manage team members and collaboration',
      icon: Users2,
      href: '/dashboard/team',
      stat: stats?.teamMembers,
      statLabel: 'members',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      action: 'View Team',
    },
  ];

  const quickActions = [
    {
      label: 'New Contact',
      icon: Users,
      href: '/dashboard/contacts',
      description: 'Add a new business contact',
    },
    {
      label: 'New Document',
      icon: StickyNote,
      href: '/dashboard/documents/new',
      description: 'Create a new note or document',
    },
    {
      label: 'Browse Facilities',
      icon: Building2,
      href: '/dashboard/facilities',
      description: 'Search the facility database',
    },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <BlurFade delay={0.1} inView>
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's an overview of your workspace.
          </p>
        </div>
      </BlurFade>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
        {featureCards.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <BlurFade key={feature.title} delay={0.2 + index * 0.1} inView>
              <Link href={feature.href} className="no-underline">
                <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full group">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2.5 rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-5 w-5 ${feature.color}`} />
                      </div>
                      {loading ? (
                        <Skeleton className="h-9 w-14" />
                      ) : (
                        <span className="text-3xl font-bold tabular-nums">{feature.stat?.toLocaleString()}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-base mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </BlurFade>
          );
        })}
      </div>

      {/* Quick Actions */}
      <BlurFade delay={0.6} inView>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks to get started quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.href} className="no-underline">
                    <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Getting Started */}
      <BlurFade delay={0.7} inView>
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Explore Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse facilities, manage contacts, and organize your documents
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard/facilities" className="no-underline">
                  <Button variant="outline" size="sm">
                    Facilities
                  </Button>
                </Link>
                <Link href="/dashboard/documents/new" className="no-underline">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Note
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>
    </DashboardLayout>
  );
}
