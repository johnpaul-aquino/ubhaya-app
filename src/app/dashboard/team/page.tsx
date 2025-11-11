/**
 * Team Management Page
 * /dashboard/team
 */

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { CreateTeamForm } from '@/components/team/create-team-form';
import { TeamMemberList } from '@/components/team/team-member-list';
import { InviteMemberForm } from '@/components/team/invite-member-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isTeamLeader } from '@/lib/authorization';
import { Users, Settings, LogOut } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team Management - Ubhaya Supply Chain',
  description: 'Manage your team and collaborate with members',
};

export default async function TeamPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch user with team information
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      team: {
        include: {
          members: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              avatar: true,
              createdAt: true,
              lastLoginAt: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  const canManage = isTeamLeader(session.user.role);

  // If user doesn't have a team, show create team form
  if (!user.team) {
    return (
      <div className="container mx-auto max-w-3xl py-8">
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
            <CreateTeamForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has a team, show team management page
  const isOwner = user.team.ownerId === session.user.id;

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{user.team.name}</h1>
        <p className="text-muted-foreground">
          {user.team.description || 'Manage your team and collaborate with members'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Team Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.team.members.length}</div>
              <p className="text-xs text-muted-foreground">
                of {user.team.maxMembers} maximum
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Slug</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono">{user.team.slug}</div>
              <p className="text-xs text-muted-foreground">Unique identifier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant="outline">
                  {session.user.role.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {isOwner ? 'Team Owner' : 'Team Member'}
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
              <InviteMemberForm />
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
              <form action="/api/team/leave" method="POST">
                <Button
                  type="submit"
                  variant="destructive"
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Leave Team
                </Button>
              </form>
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
              <form action="/api/team/leave" method="POST">
                <Button
                  type="submit"
                  variant="destructive"
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Delete Team
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
