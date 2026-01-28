/**
 * Organization Page Content Component
 * Client-side organization management content
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CreateOrgForm } from '@/components/organization/create-org-form';
import { OrgMemberList } from '@/components/organization/org-member-list';
import { InviteOrgMember } from '@/components/organization/invite-org-member';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { canManageOrg, isOrgOwner } from '@/lib/authorization';
import { Building2, Users, Layers, RefreshCw, Crown, Shield, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import type { OrgRole } from '@/types/dashboard';

interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  orgRole: OrgRole;
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
    role: string;
  };
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  maxTeams: number;
  maxMembers: number;
  myRole: OrgRole;
  members: OrganizationMember[];
  teams: { id: string; name: string; slug: string; _count: { members: number } }[];
  _count: { members: number; teams: number; contacts: number; documents: number };
}

export function OrgPageContent() {
  const { data: session, status } = useSession();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

  // Fetch user's organizations
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/organization');
      const data = await response.json();

      if (data.success) {
        setOrganizations(data.organizations);
        // If we have organizations and none selected, select the first one
        if (data.organizations.length > 0 && !selectedOrg) {
          // Fetch full details of the first organization
          const detailResponse = await fetch(`/api/organization/${data.organizations[0].id}`);
          const detailData = await detailResponse.json();
          if (detailData.success) {
            setSelectedOrg(detailData.organization);
          }
        } else if (selectedOrg) {
          // Refresh selected org details
          const detailResponse = await fetch(`/api/organization/${selectedOrg.id}`);
          const detailData = await detailResponse.json();
          if (detailData.success) {
            setSelectedOrg(detailData.organization);
          }
        }
      } else {
        toast.error('Failed to load organizations');
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      toast.error('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrganizations();
    }
  }, [status]);

  const handleLeaveOrg = async () => {
    if (!selectedOrg) return;

    if (!confirm('Are you sure you want to leave this organization? You will lose access to all shared resources.')) {
      return;
    }

    setLeaving(true);
    try {
      const response = await fetch(`/api/organization/${selectedOrg.id}/members/${session?.user?.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Successfully left the organization');
        setSelectedOrg(null);
        fetchOrganizations();
      } else {
        toast.error(data.error || 'Failed to leave organization');
      }
    } catch (error) {
      console.error('Failed to leave organization:', error);
      toast.error('Failed to leave organization');
    } finally {
      setLeaving(false);
    }
  };

  // Loading state
  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const myOrgRole = selectedOrg?.myRole || null;
  const canManage = canManageOrg(myOrgRole);
  const isOwner = isOrgOwner(myOrgRole);

  // If user doesn't have an organization, show create form
  if (organizations.length === 0) {
    return (
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create Your Organization</h1>
          <p className="text-muted-foreground">
            Start by creating an organization to manage teams and members
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
            <CardDescription>
              Set up your organization to start creating teams and inviting members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateOrgForm onSuccess={fetchOrganizations} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has organization(s), show management page
  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{selectedOrg?.name || 'Organization'}</h1>
          <p className="text-muted-foreground">
            {selectedOrg?.description || 'Manage your organization, teams, and members'}
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchOrganizations}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Organization Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Members</CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedOrg?._count?.members || 0}</div>
              <p className="text-xs text-muted-foreground">
                of {selectedOrg?.maxMembers || 50} maximum
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teams</CardTitle>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedOrg?._count?.teams || 0}</div>
              <p className="text-xs text-muted-foreground">
                of {selectedOrg?.maxTeams || 5} maximum
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Org Slug</CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-mono truncate">{selectedOrg?.slug}</div>
              <p className="text-xs text-muted-foreground">Unique identifier</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Role</CardTitle>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                {isOwner ? (
                  <Crown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    isOwner
                      ? 'border-amber-500 text-amber-700 dark:text-amber-400'
                      : myOrgRole === 'ADMIN'
                        ? 'border-blue-500 text-blue-700 dark:text-blue-400'
                        : ''
                  }
                >
                  {myOrgRole}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isOwner ? 'Organization Owner' : `Organization ${myOrgRole?.toLowerCase()}`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Invite Members (Admin/Owner Only) */}
        {canManage && selectedOrg && (
          <Card>
            <CardHeader>
              <CardTitle>Invite Member</CardTitle>
              <CardDescription>
                Add new members to your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InviteOrgMember organizationId={selectedOrg.id} onSuccess={fetchOrganizations} />
            </CardContent>
          </Card>
        )}

        {/* Organization Members */}
        {selectedOrg && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Organization Members</CardTitle>
                  <CardDescription>
                    {selectedOrg._count?.members || 0} member{(selectedOrg._count?.members || 0) !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <OrgMemberList
                members={selectedOrg.members || []}
                currentUserId={session.user.id}
                organizationOwnerId={selectedOrg.ownerId}
                organizationId={selectedOrg.id}
                canManage={canManage}
                onMemberRemoved={fetchOrganizations}
              />
            </CardContent>
          </Card>
        )}

        {/* Leave Organization (non-owners) */}
        {!isOwner && selectedOrg && (
          <Card>
            <CardHeader>
              <CardTitle>Leave Organization</CardTitle>
              <CardDescription>
                Remove yourself from this organization. You will lose access to all shared resources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                variant="destructive"
                className="gap-2"
                onClick={handleLeaveOrg}
                disabled={leaving}
              >
                <LogOut className="h-4 w-4" />
                {leaving ? 'Leaving...' : 'Leave Organization'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
