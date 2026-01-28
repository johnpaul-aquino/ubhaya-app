'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import {
  Share2,
  Lock,
  Users,
  Globe,
  Copy,
  Check,
  Loader2,
  LinkIcon,
  Building2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import type { Document, DocumentVisibility } from '@/types/dashboard';

interface Team {
  id: string;
  name: string;
}

interface ShareDocumentDialogProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShareComplete?: (document: Document) => void;
}

/**
 * Share Document Dialog Component
 * Modal dialog for managing document visibility and sharing
 */
export function ShareDocumentDialog({
  document,
  open,
  onOpenChange,
  onShareComplete,
}: ShareDocumentDialogProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Form state
  const [visibility, setVisibility] = useState<DocumentVisibility>(document.visibility);
  const [teamId, setTeamId] = useState<string>(document.teamId || '');

  // Teams state
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Check if user has organization
  const hasOrganization = !!session?.user?.organizationId;

  // Reset form when document changes
  useEffect(() => {
    setVisibility(document.visibility);
    setTeamId(document.teamId || '');
  }, [document]);

  // Fetch teams when dialog opens and visibility is TEAM
  useEffect(() => {
    if (open && visibility === 'TEAM' && teams.length === 0) {
      fetchTeams();
    }
  }, [open, visibility, teams.length]);

  const fetchTeams = async () => {
    setLoadingTeams(true);
    try {
      const response = await fetch('/api/team');
      const data = await response.json();

      if (data.success && data.user?.team) {
        setTeams([{ id: data.user.team.id, name: data.user.team.name }]);
        if (!teamId) {
          setTeamId(data.user.team.id);
        }
      } else if (data.success && data.user?.teams) {
        setTeams(data.user.teams);
        if (!teamId && data.user.teams.length > 0) {
          setTeamId(data.user.teams[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleSubmit = async () => {
    if (visibility === 'TEAM' && !teamId) {
      toast.error('Please select a team');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visibility,
          teamId: visibility === 'TEAM' ? teamId : null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update sharing settings');
      }

      onShareComplete?.(data.document);

      toast.success('Sharing settings updated!', {
        description: getShareDescription(visibility),
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Share document error:', error);
      toast.error('Failed to update sharing settings', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/dashboard/documents/${document.id}`;

    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      toast.success('Link copied to clipboard');

      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy link');
    }
  };

  const getShareDescription = (vis: DocumentVisibility): string => {
    switch (vis) {
      case 'PRIVATE':
        return 'Only you can view this document';
      case 'TEAM':
        return 'Team members can now view this document';
      case 'ORGANIZATION':
        return 'All organization members can view this document';
      case 'SHARED':
        return 'Anyone with the link can view this document';
      default:
        return '';
    }
  };

  const hasChanges = visibility !== document.visibility ||
    (visibility === 'TEAM' && teamId !== document.teamId);

  const visibilityOptions = [
    {
      value: 'PRIVATE',
      label: 'Private',
      description: 'Only you can view this document',
      icon: Lock,
      badge: null,
      hidden: false,
    },
    {
      value: 'TEAM',
      label: 'Team',
      description: 'Share with your team members',
      icon: Users,
      badge: 'Collaborative',
      hidden: false,
    },
    {
      value: 'ORGANIZATION',
      label: 'Organization',
      description: 'Share with all organization members',
      icon: Building2,
      badge: 'Org-wide',
      hidden: !hasOrganization,
    },
    {
      value: 'SHARED',
      label: 'Public Link',
      description: 'Anyone with the link can view',
      icon: Globe,
      badge: 'Public',
      hidden: false,
    },
  ].filter(option => !option.hidden);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Document
          </DialogTitle>
          <DialogDescription>
            Manage who can access &quot;{document.title}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Current Access Display */}
          <div className="rounded-lg border p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current Access</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getShareDescription(document.visibility)}
                </p>
              </div>
              <Badge variant="outline" className="gap-1.5">
                {document.visibility === 'PRIVATE' && <Lock className="h-3 w-3" />}
                {document.visibility === 'TEAM' && <Users className="h-3 w-3" />}
                {document.visibility === 'ORGANIZATION' && <Building2 className="h-3 w-3" />}
                {document.visibility === 'SHARED' && <Globe className="h-3 w-3" />}
                {document.visibility}
              </Badge>
            </div>
          </div>

          {/* Visibility Radio */}
          <div className="grid gap-3">
            <Label>Change Access</Label>
            <RadioGroup
              value={visibility}
              onValueChange={(value) => {
                setVisibility(value as DocumentVisibility);
                if (value === 'TEAM' && teams.length === 0) {
                  fetchTeams();
                }
              }}
              disabled={isSubmitting}
              className="grid gap-2"
            >
              {visibilityOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    visibility === option.value
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    if (!isSubmitting) {
                      setVisibility(option.value as DocumentVisibility);
                      if (option.value === 'TEAM' && teams.length === 0) {
                        fetchTeams();
                      }
                    }
                  }}
                >
                  <RadioGroupItem value={option.value} id={`share-${option.value}`} />
                  <div className="flex items-center gap-3 flex-1">
                    <option.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`share-${option.value}`}
                          className="font-medium cursor-pointer"
                        >
                          {option.label}
                        </Label>
                        {option.badge && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 h-4">
                            {option.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Team Select (conditional) */}
          {visibility === 'TEAM' && (
            <div className="grid gap-2">
              <Label htmlFor="share-team">
                Team <span className="text-destructive">*</span>
              </Label>
              {loadingTeams ? (
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Loading teams...
                  </span>
                </div>
              ) : teams.length === 0 ? (
                <div className="p-3 border rounded-md text-sm text-muted-foreground">
                  You are not a member of any team. Create or join a team first.
                </div>
              ) : (
                <Select
                  value={teamId}
                  onValueChange={setTeamId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="share-team">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Copy Link Section */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Document Link</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                    {`${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/documents/${document.id}`}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleCopyLink}
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !hasChanges ||
              isSubmitting ||
              (visibility === 'TEAM' && (!teamId || teams.length === 0))
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
