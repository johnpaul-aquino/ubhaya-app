/**
 * Invite Organization Member Component
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { inviteOrgMemberSchema, type InviteOrgMemberInput } from '@/lib/validations/organization';
import { toast } from 'sonner';
import { Loader2, UserPlus } from 'lucide-react';
import type { OrgRole } from '@/types/dashboard';

interface InviteOrgMemberProps {
  organizationId: string;
  onSuccess?: () => void;
}

export function InviteOrgMember({ organizationId, onSuccess }: InviteOrgMemberProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<OrgRole>('MEMBER');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<InviteOrgMemberInput>({
    resolver: zodResolver(inviteOrgMemberSchema),
    defaultValues: {
      email: '',
      role: 'MEMBER',
    },
  });

  const onSubmit = async (data: InviteOrgMemberInput) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/organization/${organizationId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || 'Member invited successfully!');
        reset();
        setSelectedRole('MEMBER');
        onSuccess?.();
      } else {
        toast.error(result.error || 'Failed to invite member');
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
      toast.error('Failed to invite member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as OrgRole);
    setValue('role', value as OrgRole);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 space-y-2">
        <Label htmlFor="email" className="sr-only">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter member's email address"
          {...register('email')}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="w-full sm:w-40 space-y-2">
        <Label htmlFor="role" className="sr-only">Role</Label>
        <Select
          value={selectedRole}
          onValueChange={handleRoleChange}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="GUEST">Guest</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" {...register('role')} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="gap-2">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Inviting...
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            Invite
          </>
        )}
      </Button>
    </form>
  );
}
