/**
 * Admin Team Table Component
 * Table for displaying and managing teams (admin only)
 */

'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Users2, Building2, MoreHorizontal, Trash2, Eye, Edit, FileText, Users } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Team {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  organizationId: string | null;
  maxMembers: number;
  isActive: boolean;
  createdAt: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  } | null;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  _count: {
    members: number;
    contacts: number;
    documents: number;
  };
}

interface TeamTableProps {
  teams: Team[];
  onTeamUpdated?: () => void;
}

export function TeamTable({ teams, onTeamUpdated }: TeamTableProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (teamId: string, isActive: boolean) => {
    setUpdating(teamId);
    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Team ${isActive ? 'activated' : 'deactivated'} successfully`);
        onTeamUpdated?.();
      } else {
        toast.error(data.error || 'Failed to update team status');
      }
    } catch (error) {
      console.error('Failed to update team status:', error);
      toast.error('Failed to update team status');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!confirm(`Are you sure you want to delete "${teamName}"? This action cannot be undone.`)) {
      return;
    }

    setUpdating(teamId);
    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Team deleted successfully');
        onTeamUpdated?.();
      } else {
        toast.error(data.error || 'Failed to delete team');
      }
    } catch (error) {
      console.error('Failed to delete team:', error);
      toast.error('Failed to delete team');
    } finally {
      setUpdating(null);
    }
  };

  if (teams.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No teams found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Team</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Resources</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team) => (
          <TableRow key={team.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-medium">{team.name}</div>
                  <p className="text-sm text-muted-foreground">{team.slug}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              {team.organization ? (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{team.organization.name}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">No organization</span>
              )}
            </TableCell>
            <TableCell>
              {team.owner ? (
                <div>
                  <div className="font-medium">
                    {team.owner.firstName} {team.owner.lastName}
                  </div>
                  <p className="text-sm text-muted-foreground">{team.owner.email}</p>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Unknown</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{team._count.members}</span>
                <span className="text-muted-foreground">/ {team.maxMembers}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1" title="Contacts">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{team._count.contacts}</span>
                </div>
                <div className="flex items-center gap-1" title="Documents">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{team._count.documents}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Switch
                checked={team.isActive}
                onCheckedChange={(checked) => handleStatusChange(team.id, checked)}
                disabled={updating === team.id}
              />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(team.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={updating === team.id}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/admin/teams/${team.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/admin/teams/${team.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDeleteTeam(team.id, team.name)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Team
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
