'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Users,
  UsersRound,
  FileText,
  Contact,
  Calendar,
  Edit,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { AdminSidebar } from '@/components/admin';

interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar: string | null;
  maxTeams: number;
  maxMembers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
  members: Array<{
    id: string;
    orgRole: string;
    joinedAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar: string | null;
      role: string;
    };
  }>;
  teams: Array<{
    id: string;
    name: string;
    slug: string;
    _count: { members: number };
  }>;
  _count: {
    members: number;
    teams: number;
    contacts: number;
    documents: number;
  };
}

export default function OrganizationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch(`/api/admin/organizations/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setOrganization(data.organization);
        } else {
          toast.error('Organization not found');
          router.push('/dashboard/admin/organizations');
        }
      } catch {
        toast.error('Failed to load organization');
        router.push('/dashboard/admin/organizations');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrganization();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </main>
      </div>
    );
  }

  if (!organization) {
    return null;
  }

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName[0]}${lastName[0]}`.toUpperCase();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/admin/organizations">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={organization.avatar || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {organization.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    {organization.name}
                    <Badge variant={organization.isActive ? 'default' : 'secondary'}>
                      {organization.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </h1>
                  <p className="text-muted-foreground">{organization.slug}</p>
                </div>
              </div>
            </div>
            <Link href={`/dashboard/admin/organizations/${organization.id}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{organization._count.members}</p>
                    <p className="text-xs text-muted-foreground">
                      / {organization.maxMembers} Members
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <UsersRound className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{organization._count.teams}</p>
                    <p className="text-xs text-muted-foreground">
                      / {organization.maxTeams} Teams
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{organization._count.documents}</p>
                    <p className="text-xs text-muted-foreground">Documents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Contact className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{organization._count.contacts}</p>
                    <p className="text-xs text-muted-foreground">Contacts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Organization Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {organization.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-sm">{organization.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Owner</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={organization.owner.avatar || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(organization.owner.firstName, organization.owner.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {organization.owner.firstName} {organization.owner.lastName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created {new Date(organization.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>

            {/* Teams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersRound className="h-5 w-5" />
                  Teams ({organization.teams.length})
                </CardTitle>
                <CardDescription>Teams in this organization</CardDescription>
              </CardHeader>
              <CardContent>
                {organization.teams.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No teams yet</p>
                ) : (
                  <div className="space-y-2">
                    {organization.teams.map((team) => (
                      <div
                        key={team.id}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                      >
                        <div>
                          <p className="font-medium text-sm">{team.name}</p>
                          <p className="text-xs text-muted-foreground">{team.slug}</p>
                        </div>
                        <Badge variant="outline">{team._count.members} members</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Members ({organization.members.length})
              </CardTitle>
              <CardDescription>All members of this organization</CardDescription>
            </CardHeader>
            <CardContent>
              {organization.members.length === 0 ? (
                <p className="text-sm text-muted-foreground">No members yet</p>
              ) : (
                <div className="space-y-2">
                  {organization.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.user.avatar || undefined} />
                          <AvatarFallback>
                            {getInitials(member.user.firstName, member.user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {member.user.firstName} {member.user.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{member.orgRole}</Badge>
                        <Badge variant="secondary">{member.user.role}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
