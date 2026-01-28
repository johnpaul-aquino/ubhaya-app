/**
 * Team Page Content Component
 * Client-side team management content
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CreateTeamForm } from '@/components/team/create-team-form';
import { TeamMemberList } from '@/components/team/team-member-list';
import { InviteMemberForm } from '@/components/team/invite-member-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { isTeamLeader } from '@/lib/authorization';
import { Users, Settings, LogOut, RefreshCw, Shield, Crown } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  teamRole: string;
  avatar: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  joinedAt: string;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  maxMembers: number;
  myRole: string;
  members: TeamMember[];
}

interface UserWithTeam {
  id: string;
  team: Team | null;
  teams?: Team[];
}

export function TeamPageContent() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserWithTeam | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

  // Fetch user with team information
  const fetchUserTeam = async () => {
    try {
      const response = await fetch('/api/team');
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        toast.error('Failed to load team data');
      }
    } catch (error) {
      console.error('Failed to fetch team:', error);
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserTeam();
    }
  }, [status]);

  const handleLeaveTeam = async () => {
    if (!confirm('Are you sure you want to leave this team? You will lose access to all shared resources.')) {
      return;
    }

    setLeaving(true);
    try {
      const response = await fetch('/api/team/leave', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Successfully left the team');
        setUser(prev => prev ? { ...prev, team: null } : null);
      } else {
        toast.error(data.error || 'Failed to leave team');
      }
    } catch (error) {
      console.error('Failed to leave team:', error);
      toast.error('Failed to leave team');
    } finally {
      setLeaving(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }

    setLeaving(true);
    try {
      const response = await fetch('/api/team', {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Team deleted successfully');
        setUser(prev => prev ? { ...prev, team: null } : null);
      } else {
        toast.error(data.error || 'Failed to delete team');
      }
    } catch (error) {
      console.error('Failed to delete team:', error);
      toast.error('Failed to delete team');
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
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session?.user || !user) {
    return null;
  }

  const canManage = isTeamLeader(session.user.role);

  // If user doesn't have a team, show create team form
  if (!user.team) {
    return (
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create Your Team</h1>
          <p className="text-muted-foreground">
            Start collaborating by creating a team
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
            <CardDescription>
              Set up your team to start inviting members and sharing resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateTeamForm onSuccess={fetchUserTeam} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has a team, show team management page
  const isOwner = user.team.ownerId === session.user.id;
  const myTeamRole = user.team.myRole || 'MEMBER';

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{user.team.name}</h1>
          <p className="text-muted-foreground">
            {user.team.description || 'Manage your team and collaborate with members'}
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchUserTeam}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Team Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.team.members.length}</div>
              <p className="text-xs text-muted-foreground">
                of {user.team.maxMembers} maximum
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Slug</CardTitle>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-mono truncate">{user.team.slug}</div>
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
                      : myTeamRole === 'LEADER'
                        ? 'border-blue-500 text-blue-700 dark:text-blue-400'
                        : ''
                  }
                >
                  {myTeamRole.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isOwner ? 'Team Owner' : `Team ${myTeamRole.charAt(0) + myTeamRole.slice(1).toLowerCase()}`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Invite Members (Team Leaders Only) */}
        {canManage && (
          <Card>
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription>
                Add new members to your team to collaborate on resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InviteMemberForm onSuccess={fetchUserTeam} />
            </CardContent>
          </Card>
        )}

        {/* Team Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  {user.team.members.length} member{user.team.members.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TeamMemberList
              members={user.team.members}
              currentUserId={session.user.id}
              teamOwnerId={user.team.ownerId}
              canManage={canManage}
              onMemberRemoved={fetchUserTeam}
            />
          </CardContent>
        </Card>

        {/* Leave Team */}
        {!isOwner && (
          <Card>
            <CardHeader>
              <CardTitle>Leave Team</CardTitle>
              <CardDescription>
                Remove yourself from this team. You will lose access to all shared resources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                variant="destructive"
                className="gap-2"
                onClick={handleLeaveTeam}
                disabled={leaving}
              >
                <LogOut className="h-4 w-4" />
                {leaving ? 'Leaving...' : 'Leave Team'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Delete Team (Owner Only) */}
        {isOwner && user.team.members.length === 1 && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Delete this team permanently. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                variant="destructive"
                className="gap-2"
                onClick={handleDeleteTeam}
                disabled={leaving}
              >
                <LogOut className="h-4 w-4" />
                {leaving ? 'Deleting...' : 'Delete Team'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
