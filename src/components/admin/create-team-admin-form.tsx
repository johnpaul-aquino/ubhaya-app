/**
 * Create Team Admin Form Component
 * Form to create team with owner and organization selection (admin only)
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { adminCreateTeamSchema, type AdminCreateTeamInput } from '@/lib/validations/admin';
import { toast } from 'sonner';
import { Loader2, Plus, Search } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface CreateTeamAdminFormProps {
  onSuccess?: () => void;
}

export function CreateTeamAdminForm({ onSuccess }: CreateTeamAdminFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AdminCreateTeamInput>({
    resolver: zodResolver(adminCreateTeamSchema),
    defaultValues: {
      name: '',
      description: '',
      ownerId: '',
      organizationId: '',
      maxMembers: 10,
    },
  });

  const selectedOwnerId = watch('ownerId');
  const selectedOrgId = watch('organizationId');

  // Fetch users for owner selection
  const fetchUsers = async (search?: string) => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '50');
      params.set('isActive', 'true');
      if (search) params.set('search', search);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch organizations
  const fetchOrganizations = async () => {
    setLoadingOrgs(true);
    try {
      const response = await fetch('/api/admin/organizations?limit=100&isActive=true');
      const data = await response.json();

      if (data.success) {
        setOrganizations(data.organizations);
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoadingOrgs(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchOrganizations();
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userSearch) {
        fetchUsers(userSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearch]);

  const onSubmit = async (data: AdminCreateTeamInput) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          organizationId: data.organizationId || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Team created successfully!');
        reset();
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(result.error || 'Failed to create team');
      }
    } catch (error) {
      console.error('Failed to create team:', error);
      toast.error('Failed to create team');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOwner = users.find((u) => u.id === selectedOwnerId);
  const selectedOrg = organizations.find((o) => o.id === selectedOrgId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a new team and assign an owner
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              placeholder="Enter team name"
              {...register('name')}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the team"
              rows={2}
              {...register('description')}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Owner</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-9 mb-2"
                disabled={isSubmitting}
              />
            </div>
            <Select
              value={selectedOwnerId}
              onValueChange={(value) => setValue('ownerId', value)}
              disabled={isSubmitting || loadingUsers}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingUsers ? 'Loading users...' : 'Select owner'}>
                  {selectedOwner && `${selectedOwner.firstName} ${selectedOwner.lastName}`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div>
                      <span className="font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        ({user.email})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ownerId && (
              <p className="text-sm text-destructive">{errors.ownerId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Organization (Optional)</Label>
            <Select
              value={selectedOrgId || '__none__'}
              onValueChange={(value) => setValue('organizationId', value === '__none__' ? undefined : value)}
              disabled={isSubmitting || loadingOrgs}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingOrgs ? 'Loading...' : 'Select organization'}>
                  {selectedOrg ? selectedOrg.name : 'No organization'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No organization</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxMembers">Max Members</Label>
            <Input
              id="maxMembers"
              type="number"
              min={1}
              max={100}
              {...register('maxMembers', { valueAsNumber: true })}
              disabled={isSubmitting}
            />
            {errors.maxMembers && (
              <p className="text-sm text-destructive">{errors.maxMembers.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Team'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
