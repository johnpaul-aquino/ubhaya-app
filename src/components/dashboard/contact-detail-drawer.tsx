'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Contact, ContactNote } from '@/types/dashboard';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  Globe,
  MapPin,
  MessageCircle,
  Share2,
  Trash2,
  Edit,
  Pin,
  PinOff,
  Plus,
  Users,
  StickyNote,
  Building,
} from 'lucide-react';

interface ContactDetailDrawerProps {
  contact: Contact | null;
  open: boolean;
  onClose: () => void;
  onUpdate?: (contact: Contact) => void;
  onDelete?: (contactId: string) => void;
}

/**
 * Contact Detail Drawer Component
 * Slide-out panel showing full contact details with notes
 */
export function ContactDetailDrawer({
  contact,
  open,
  onClose,
  onUpdate,
  onDelete,
}: ContactDetailDrawerProps) {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<ContactNote[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [isSharingTeam, setIsSharingTeam] = useState(false);
  const [isSharingOrg, setIsSharingOrg] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if user has team and organization
  const hasTeam = !!session?.user?.teamId;
  const hasOrganization = !!session?.user?.organizationId;

  // Fetch notes when drawer opens
  const fetchNotes = async (contactId: string) => {
    setLoadingNotes(true);
    try {
      const response = await fetch(`/api/contacts/${contactId}/notes`);
      const data = await response.json();
      if (data.success) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoadingNotes(false);
    }
  };

  // Handle drawer open/close
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && contact) {
      fetchNotes(contact.id);
    } else {
      setNotes([]);
      setNewNote('');
    }
    if (!isOpen) onClose();
  };

  // Add a new note
  const handleAddNote = async () => {
    if (!contact || !newNote.trim()) return;

    setAddingNote(true);
    try {
      const response = await fetch(`/api/contacts/${contact.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote.trim() }),
      });

      const data = await response.json();
      if (data.success) {
        setNotes(prev => [data.note, ...prev]);
        setNewNote('');
        toast.success('Note added');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  // Toggle note pin status
  const handleTogglePin = async (noteId: string, isPinned: boolean) => {
    if (!contact) return;

    try {
      const response = await fetch(`/api/contacts/${contact.id}/notes/${noteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !isPinned }),
      });

      const data = await response.json();
      if (data.success) {
        setNotes(prev =>
          prev
            .map(n => (n.id === noteId ? { ...n, isPinned: !isPinned } : n))
            .sort((a, b) => {
              if (a.isPinned && !b.isPinned) return -1;
              if (!a.isPinned && b.isPinned) return 1;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
        );
        toast.success(isPinned ? 'Note unpinned' : 'Note pinned');
      }
    } catch {
      toast.error('Failed to update note');
    }
  };

  // Delete a note
  const handleDeleteNote = async (noteId: string) => {
    if (!contact) return;

    try {
      const response = await fetch(`/api/contacts/${contact.id}/notes/${noteId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setNotes(prev => prev.filter(n => n.id !== noteId));
        toast.success('Note deleted');
      }
    } catch {
      toast.error('Failed to delete note');
    }
  };

  // Share contact with team
  const handleShareWithTeam = async () => {
    if (!contact) return;

    setIsSharingTeam(true);
    try {
      const response = await fetch(`/api/contacts/${contact.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareType: 'TEAM' }),
      });

      const data = await response.json();
      if (data.success) {
        onUpdate?.(data.contact);
        toast.success('Contact shared with team');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to share contact');
    } finally {
      setIsSharingTeam(false);
    }
  };

  // Share contact with organization
  const handleShareWithOrg = async () => {
    if (!contact) return;

    setIsSharingOrg(true);
    try {
      const response = await fetch(`/api/contacts/${contact.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareType: 'ORGANIZATION' }),
      });

      const data = await response.json();
      if (data.success) {
        onUpdate?.(data.contact);
        toast.success('Contact shared with organization');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to share contact');
    } finally {
      setIsSharingOrg(false);
    }
  };

  // Unshare contact (make private)
  const handleUnshare = async () => {
    if (!contact) return;

    setIsSharingTeam(true);
    try {
      const response = await fetch(`/api/contacts/${contact.id}/share`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        onUpdate?.(data.contact);
        toast.success('Contact is now private');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to unshare contact');
    } finally {
      setIsSharingTeam(false);
    }
  };

  // Delete contact
  const handleDelete = async () => {
    if (!contact) return;

    if (!confirm('Are you sure you want to delete this contact?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/contacts/${contact.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        onDelete?.(contact.id);
        onClose();
        toast.success('Contact deleted');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to delete contact');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!contact) return null;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold flex-shrink-0"
              style={{ backgroundColor: contact.avatarBg || '#6B46C1' }}
            >
              {contact.avatar || contact.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg leading-tight">
                {contact.name}
              </SheetTitle>
              <SheetDescription className="mt-1 flex items-center gap-2 flex-wrap">
                {contact.position && (
                  <span>{contact.position}</span>
                )}
                {contact.isTeamContact && (
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    Team
                  </Badge>
                )}
                {contact.isOrgContact && (
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    <Building className="h-3 w-3 mr-1" />
                    Organization
                  </Badge>
                )}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Contact Information */}
          {contact.company && (
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{contact.company}</span>
            </div>
          )}

          {contact.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                {contact.email}
              </a>
            </div>
          )}

          {contact.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${contact.phone}`} className="hover:underline">
                {contact.phone}
              </a>
            </div>
          )}

          {contact.whatsappNumber && (
            <div className="flex items-center gap-3 text-sm">
              <MessageCircle className="h-4 w-4 text-green-500" />
              <a
                href={`https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                {contact.whatsappNumber}
              </a>
            </div>
          )}

          {contact.website && (
            <div className="flex items-center gap-3 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {contact.website}
              </a>
            </div>
          )}

          {contact.address && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{contact.address}</span>
            </div>
          )}

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {contact.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Notes Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <StickyNote className="h-4 w-4" />
                Notes
              </div>
            </div>

            {/* Add Note */}
            <div className="space-y-2 mb-4">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={2}
                disabled={addingNote}
              />
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!newNote.trim() || addingNote}
                className="w-full"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                {addingNote ? 'Adding...' : 'Add Note'}
              </Button>
            </div>

            {/* Notes List */}
            {loadingNotes ? (
              <div className="space-y-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            ) : notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notes yet. Add one above!
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-lg border ${
                      note.isPinned ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900' : 'bg-muted/50'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>
                        {note.author
                          ? `${note.author.firstName} ${note.author.lastName}`
                          : 'You'}{' '}
                        • {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleTogglePin(note.id, note.isPinned)}
                        >
                          {note.isPinned ? (
                            <PinOff className="h-3 w-3" />
                          ) : (
                            <Pin className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {/* Share options - only show if contact is not already shared */}
            {!contact.isTeamContact && !contact.isOrgContact && (
              <>
                {hasTeam && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleShareWithTeam}
                    disabled={isSharingTeam || isSharingOrg}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {isSharingTeam ? 'Sharing...' : 'Share with Team'}
                  </Button>
                )}
                {hasOrganization && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleShareWithOrg}
                    disabled={isSharingTeam || isSharingOrg}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    {isSharingOrg ? 'Sharing...' : 'Share with Organization'}
                  </Button>
                )}
              </>
            )}

            {/* Unshare option - show if contact is shared */}
            {(contact.isTeamContact || contact.isOrgContact) && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleUnshare}
                disabled={isSharingTeam}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {isSharingTeam ? 'Unsharing...' : 'Make Private'}
              </Button>
            )}

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete Contact'}
            </Button>
          </div>

          {/* Metadata */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Created: {new Date(contact.createdAt).toLocaleDateString()}</div>
            <div>Updated: {new Date(contact.updatedAt).toLocaleDateString()}</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
