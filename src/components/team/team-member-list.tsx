/**
 * Team Member List Component
 * Displays list of team members with actions
 */

'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreVertical, Shield, Eye, Users, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  teamRole?: string;
  avatar?: string | null;
  createdAt: Date | string;
  lastLoginAt?: Date | string | null;
  joinedAt?: Date | string;
}

interface TeamMemberListProps {
  members: TeamMember[];
  currentUserId: string;
  teamOwnerId: string;
  canManage: boolean;
  onMemberRemoved?: () => void;
}

export function TeamMemberList({
  members,
  currentUserId,
  teamOwnerId,
  canManage,
  onMemberRemoved,
}: TeamMemberListProps) {
  const router = useRouter();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Colors for both UserRole and TeamRole
  const roleColors: Record<string, string> = {
    // UserRole
    ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    TEAM_LEADER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    MEMBER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    VIEWER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    // TeamRole
    OWNER: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    LEADER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };

  const roleIcons: Record<string, React.ReactNode> = {
    // UserRole
    ADMIN: <Crown className="h-3 w-3" />,
    TEAM_LEADER: <Shield className="h-3 w-3" />,
    MEMBER: <Users className="h-3 w-3" />,
    VIEWER: <Eye className="h-3 w-3" />,
    // TeamRole
    OWNER: <Crown className="h-3 w-3" />,
    LEADER: <Shield className="h-3 w-3" />,
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/team/member/${selectedMember.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.error || 'Failed to remove member');
        return;
      }

      toast.success('Member removed successfully');
      setShowRemoveDialog(false);
      setSelectedMember(null);
      onMemberRemoved?.();
      router.refresh();
    } catch (error) {
      console.error('Remove member error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/team/member/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.error || 'Failed to update role');
        return;
      }

      toast.success('Member role updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Update role error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {members.map((member) => {
          const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
          const isCurrentUser = member.id === currentUserId;
          const isOwner = member.id === teamOwnerId;
          const canManageMember = canManage && !isCurrentUser && !isOwner;
          // Use teamRole if available, otherwise fall back to role
          const displayRole = member.teamRole || member.role;

          return (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      {member.firstName} {member.lastName}
                      {isCurrentUser && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          (You)
                        </span>
                      )}
                      {isOwner && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          (Owner)
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge className={`${roleColors[displayRole] || roleColors.MEMBER} flex items-center gap-1`}>
                      {roleIcons[displayRole] || roleIcons.MEMBER}
                      {displayRole.replace('_', ' ')}
                    </Badge>
                    {member.lastLoginAt && (
                      <span className="text-xs text-muted-foreground">
                        Active{' '}
                        {formatDistanceToNow(new Date(member.lastLoginAt), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {canManageMember && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isLoading}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Manage Member</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleUpdateRole(member.id, 'TEAM_LEADER')}
                      disabled={member.role === 'TEAM_LEADER'}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Promote to Team Leader
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleUpdateRole(member.id, 'MEMBER')}
                      disabled={member.role === 'MEMBER'}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Set as Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleUpdateRole(member.id, 'VIEWER')}
                      disabled={member.role === 'VIEWER'}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Set as Viewer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedMember(member);
                        setShowRemoveDialog(true);
                      }}
                      className="text-red-600 dark:text-red-400"
                    >
                      Remove from Team
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}
      </div>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <strong>
                {selectedMember?.firstName} {selectedMember?.lastName}
              </strong>{' '}
              from the team? They will lose access to all shared resources.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Removing...' : 'Remove Member'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
