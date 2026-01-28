'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { JSONContent } from '@tiptap/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { StickyNote, Lock, Users, Globe, Loader2 } from 'lucide-react';
import { RichTextEditor } from '@/components/editor';
import type { Document, DocumentType, DocumentVisibility } from '@/types/dashboard';

interface Team {
  id: string;
  name: string;
}

interface CreateNoteDialogProps {
  onNoteCreated?: (document: Document) => void;
  trigger?: React.ReactNode;
}

/**
 * Create Note Dialog Component
 * Modal dialog for creating text-based notes
 */
export function CreateNoteDialog({
  onNoteCreated,
  trigger,
}: CreateNoteDialogProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [contentJson, setContentJson] = useState<JSONContent | null>(null);
  const [contentHtml, setContentHtml] = useState('');
  const [type, setType] = useState<DocumentType>('NOTE');
  const [visibility, setVisibility] = useState<DocumentVisibility>('PRIVATE');
  const [teamId, setTeamId] = useState<string>('');

  // Teams state
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Fetch user's teams when dialog opens and visibility is TEAM
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
        // Single team from current API
        setTeams([{ id: data.user.team.id, name: data.user.team.name }]);
        setTeamId(data.user.team.id);
      } else if (data.success && data.user?.teams) {
        // Multiple teams support
        setTeams(data.user.teams);
        if (data.user.teams.length > 0) {
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
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (visibility === 'TEAM' && !teamId) {
      toast.error('Please select a team');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: contentHtml || null, // Store HTML as fallback
          contentJson: contentJson || null, // Store Tiptap JSON
          contentFormat: contentJson ? 'TIPTAP_JSON' : 'PLAIN',
          type,
          visibility,
          teamId: visibility === 'TEAM' ? teamId : null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create note');
      }

      onNoteCreated?.(data.document);

      toast.success('Note created successfully!', {
        description: `"${title}" has been added to your documents.`,
      });

      // Reset form
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error('Create note error:', error);
      toast.error('Failed to create note', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContentJson(null);
    setContentHtml('');
    setType('NOTE');
    setVisibility('PRIVATE');
    setTeamId('');
  };

  const handleEditorChange = useCallback((json: JSONContent, html: string) => {
    setContentJson(json);
    setContentHtml(html);
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    setOpen(newOpen);
  };

  const visibilityOptions = [
    {
      value: 'PRIVATE',
      label: 'Private',
      description: 'Only you can view this note',
      icon: Lock,
    },
    {
      value: 'TEAM',
      label: 'Team',
      description: 'Share with your team members',
      icon: Users,
    },
    {
      value: 'SHARED',
      label: 'Shared',
      description: 'Anyone with the link can view',
      icon: Globe,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <StickyNote className="h-4 w-4" />
            Create Note
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-primary" />
            Create Note
          </DialogTitle>
          <DialogDescription>
            Create a new note or meeting note to document your thoughts
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title Field */}
          <div className="grid gap-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              maxLength={200}
            />
          </div>

          {/* Rich Text Editor */}
          <div className="grid gap-2">
            <Label>Content</Label>
            <RichTextEditor
              onChange={handleEditorChange}
              placeholder="Write your note content..."
              readOnly={isSubmitting}
              enableTables={true}
              enableImages={false}
              minHeight="200px"
            />
          </div>

          {/* Type Select */}
          <div className="grid gap-2">
            <Label htmlFor="type">Note Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as DocumentType)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select note type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOTE">
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    <span>Note</span>
                  </div>
                </SelectItem>
                <SelectItem value="MEETING_NOTE">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Meeting Note</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visibility Radio */}
          <div className="grid gap-3">
            <Label>Visibility</Label>
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
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex items-center gap-3 flex-1">
                    <option.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label
                        htmlFor={option.value}
                        className="font-medium cursor-pointer"
                      >
                        {option.label}
                      </Label>
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
              <Label htmlFor="team">
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
                  <SelectTrigger id="team">
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
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !title.trim() ||
              isSubmitting ||
              (visibility === 'TEAM' && (!teamId || teams.length === 0))
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Note'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
