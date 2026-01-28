'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import {
  MoreHorizontal,
  Reply,
  Edit,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from 'lucide-react';
import { CommentInput } from './comment-input';

interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
}

interface Mention {
  id: string;
  mentionedUser: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: Author;
  documentId: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  mentions: Mention[];
  replies?: Comment[];
  _count?: {
    replies: number;
  };
}

interface CommentThreadProps {
  comment: Comment;
  documentId: string;
  depth?: number;
  onCommentUpdated?: (comment: Comment) => void;
  onCommentDeleted?: (commentId: string) => void;
}

/**
 * Comment Thread Component
 * Displays a comment with replies and actions
 */
export function CommentThread({
  comment,
  documentId,
  depth = 0,
  onCommentUpdated,
  onCommentDeleted,
}: CommentThreadProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = session?.user?.id === comment.authorId;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canEdit = isAuthor;
  const canDelete = isAuthor || isAdmin;
  const maxDepth = 2; // Limit nesting

  const initials = `${comment.author.firstName[0]}${comment.author.lastName[0]}`.toUpperCase();
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  // Render content with styled mentions
  const renderContent = (content: string) => {
    // Replace @[id](name) with styled mention
    const parts = content.split(/(@\[[^\]]+\]\([^)]+\))/g);

    return parts.map((part, index) => {
      const mentionMatch = part.match(/@\[([^\]]+)\]\(([^)]+)\)/);
      if (mentionMatch) {
        const [, userId, displayName] = mentionMatch;
        return (
          <span
            key={index}
            className="text-primary font-medium cursor-pointer hover:underline"
            onClick={() => {
              // Could navigate to user profile
              console.log('Clicked mention:', userId);
            }}
          >
            @{displayName}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update comment');
      }

      onCommentUpdated?.(data.comment);
      setIsEditing(false);
      toast.success('Comment updated');
    } catch (error) {
      console.error('Update comment error:', error);
      toast.error('Failed to update comment');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete comment');
      }

      onCommentDeleted?.(comment.id);
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Delete comment error:', error);
      toast.error('Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReplyCreated = (newReply: Comment) => {
    setReplies((prev) => [...prev, newReply]);
    setIsReplying(false);
  };

  const handleReplyDeleted = (replyId: string) => {
    setReplies((prev) => prev.filter((r) => r.id !== replyId));
  };

  const handleReplyUpdated = (updatedReply: Comment) => {
    setReplies((prev) =>
      prev.map((r) => (r.id === updatedReply.id ? updatedReply : r))
    );
  };

  const totalReplies = comment._count?.replies || replies.length;

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 pl-4 border-muted' : ''}`}>
      <div className="group">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {comment.author.firstName} {comment.author.lastName}
              </span>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
              {comment.createdAt !== comment.updatedAt && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>

            {/* Content */}
            {isEditing ? (
              <div className="mt-2 space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="resize-none"
                  disabled={isUpdating}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleEdit}
                    disabled={isUpdating || !editContent.trim()}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-sm whitespace-pre-wrap">
                {renderContent(comment.content)}
              </p>
            )}

            {/* Actions */}
            {!isEditing && (
              <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {depth < maxDepth && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setIsReplying(!isReplying)}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}

                {(canEdit || canDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {canEdit && (
                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <DropdownMenuItem
                          onClick={handleDelete}
                          className="text-destructive focus:text-destructive"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reply Input */}
        {isReplying && (
          <div className="mt-3 ml-11">
            <CommentInput
              documentId={documentId}
              parentId={comment.id}
              onCommentCreated={handleReplyCreated}
              onCancel={() => setIsReplying(false)}
              placeholder={`Reply to ${comment.author.firstName}...`}
              autoFocus
              compact
            />
          </div>
        )}

        {/* Replies */}
        {replies.length > 0 && (
          <div className="mt-3">
            {totalReplies > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs ml-11 mb-2"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Hide {totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show {totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}
                  </>
                )}
              </Button>
            )}

            {showReplies && (
              <div className="space-y-4">
                {replies.map((reply) => (
                  <CommentThread
                    key={reply.id}
                    comment={reply}
                    documentId={documentId}
                    depth={depth + 1}
                    onCommentUpdated={handleReplyUpdated}
                    onCommentDeleted={handleReplyDeleted}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
