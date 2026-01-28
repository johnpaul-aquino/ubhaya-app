/**
 * Organization Member List Component
 */

'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Shield, Crown, UserMinus, ChevronDown } from 'lucide-react';
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

interface OrgMemberListProps {
  members: OrganizationMember[];
  currentUserId: string;
  organizationOwnerId: string;
  organizationId: string;
  canManage: boolean;
  onMemberRemoved?: () => void;
}

export function OrgMemberList({
  members,
  currentUserId,
  organizationOwnerId,
  organizationId,
  canManage,
  onMemberRemoved,
}: OrgMemberListProps) {
  const [loadingMemberId, setLoadingMemberId] = useState<string | null>(null);

  const handleRemoveMember = async (userId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the organization?`)) {
      return;
    }

    setLoadingMemberId(userId);
    try {
      const response = await fetch(
        `/api/organization/${organizationId}/members/${userId}`,
        { method: 'DELETE' }
      );
      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Member removed successfully');
        onMemberRemoved?.();
      } else {
        toast.error(data.error || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member');
    } finally {
      setLoadingMemberId(null);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: OrgRole) => {
    setLoadingMemberId(userId);
    try {
      const response = await fetch(
        `/api/organization/${organizationId}/members/${userId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        }
      );
      const data = await response.json();

      if (data.success) {
        toast.success('Member role updated successfully');
        onMemberRemoved?.(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to update role');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error('Failed to update role');
    } finally {
      setLoadingMemberId(null);
    }
  };

  const getRoleBadgeStyles = (role: OrgRole) => {
    switch (role) {
      case 'OWNER':
        return 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
      case 'ADMIN':
        return 'border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'MEMBER':
        return 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'GUEST':
        return 'border-gray-500 text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
      default:
        return '';
    }
  };

  const getRoleIcon = (role: OrgRole) => {
    if (role === 'OWNER') return <Crown className="h-3 w-3 mr-1" />;
    if (role === 'ADMIN') return <Shield className="h-3 w-3 mr-1" />;
    return null;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No members in this organization yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member) => {
        const isOwner = member.orgRole === 'OWNER';
        const isCurrentUser = member.userId === currentUserId;
        const canModify = canManage && !isOwner && !isCurrentUser;

        return (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.user.avatar || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(member.user.firstName, member.user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {member.user.firstName} {member.user.lastName}
                  </span>
                  {isCurrentUser && (
                    <Badge variant="secondary" className="text-xs">You</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{member.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getRoleBadgeStyles(member.orgRole)}>
                {getRoleIcon(member.orgRole)}
                {member.orgRole}
              </Badge>

              {canModify && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={loadingMemberId === member.userId}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleUpdateRole(member.userId, 'ADMIN')}
                      disabled={member.orgRole === 'ADMIN'}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleUpdateRole(member.userId, 'MEMBER')}
                      disabled={member.orgRole === 'MEMBER'}
                    >
                      Make Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleUpdateRole(member.userId, 'GUEST')}
                      disabled={member.orgRole === 'GUEST'}
                    >
                      Make Guest
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        handleRemoveMember(
                          member.userId,
                          `${member.user.firstName} ${member.user.lastName}`
                        )
                      }
                      className="text-destructive focus:text-destructive"
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
