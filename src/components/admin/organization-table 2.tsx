/**
 * Organization Table Component for Admin
 * Display and manage organizations in a table format
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Building2, Users, Layers, Eye, Edit, Power } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  maxTeams: number;
  maxMembers: number;
  createdAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: {
    members: number;
    teams: number;
    contacts: number;
    documents: number;
  };
}

interface OrganizationTableProps {
  organizations: Organization[];
  onOrganizationUpdated: () => void;
}

export function OrganizationTable({ organizations, onOrganizationUpdated }: OrganizationTableProps) {
  const [loadingOrgId, setLoadingOrgId] = useState<string | null>(null);

  const handleToggleActive = async (orgId: string, currentActive: boolean) => {
    setLoadingOrgId(orgId);
    try {
      const response = await fetch(`/api/admin/organizations/${orgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(`Organization ${currentActive ? 'deactivated' : 'activated'} successfully`);
        onOrganizationUpdated();
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    } finally {
      setLoadingOrgId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (organizations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No organizations found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Organization</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Teams</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((org) => {
          const isLoading = loadingOrgId === org.id;

          return (
            <TableRow key={org.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">{org.name}</div>
                    <p className="text-sm text-muted-foreground font-mono">{org.slug}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="text-sm font-medium">
                    {org.owner.firstName} {org.owner.lastName}
                  </div>
                  <p className="text-xs text-muted-foreground">{org.owner.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{org._count.members}</span>
                  <span className="text-muted-foreground">/ {org.maxMembers}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span>{org._count.teams}</span>
                  <span className="text-muted-foreground">/ {org.maxTeams}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={org.isActive
                    ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-500 text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20'
                  }
                >
                  {org.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(org.createdAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isLoading}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/admin/organizations/${org.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/admin/organizations/${org.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleToggleActive(org.id, org.isActive)}
                    >
                      <Power className="mr-2 h-4 w-4" />
                      {org.isActive ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
