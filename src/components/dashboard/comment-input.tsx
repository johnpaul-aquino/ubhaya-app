'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Send, Loader2, AtSign, X } from 'lucide-react';
import { MentionAutocomplete, type UserSuggestion } from './mention-autocomplete';

interface CommentInputProps {
  documentId: string;
  parentId?: string;
  onCommentCreated?: (comment: Comment) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  compact?: boolean;
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Comment Input Component
 * Input field for creating comments with @mention support
 */
export function CommentInput({
  documentId,
  parentId,
  onCommentCreated,
  onCancel,
  placeholder = 'Write a comment...',
  autoFocus = false,
  compact = false,
}: CommentInputProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Track cursor position for @ detection
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursor = e.target.selectionStart || 0;

    setContent(value);
    setCursorPosition(cursor);

    // Check for @ mention trigger
    const textBeforeCursor = value.slice(0, cursor);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentions(true);
    } else {
      setShowMentions(false);
      setMentionQuery('');
    }
  }, []);

  // Handle mention selection
  const handleMentionSelect = useCallback((user: UserSuggestion) => {
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);

    // Find where the @ starts
    const mentionStart = textBeforeCursor.lastIndexOf('@');
    const newTextBefore = textBeforeCursor.slice(0, mentionStart);

    // Insert mention format: @[userId](display name)
    const mentionText = `@[${user.id}](${user.firstName} ${user.lastName}) `;
    const newContent = newTextBefore + mentionText + textAfterCursor;

    setContent(newContent);
    setShowMentions(false);
    setMentionQuery('');

    // Focus back on textarea
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursor = newTextBefore.length + mentionText.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursor, newCursor);
      }
    }, 0);
  }, [content, cursorPosition]);

  // Close mentions on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showMentions) {
        setShowMentions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showMentions]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/documents/${documentId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          parentId: parentId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create comment');
      }

      onCommentCreated?.(data.comment);
      setContent('');

      if (!parentId) {
        toast.success('Comment added');
      }
    } catch (error) {
      console.error('Create comment error:', error);
      toast.error('Failed to add comment', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Get display text (convert @[id](name) to @name for display)
  const getDisplayContent = (text: string): string => {
    return text.replace(/@\[([^\]]+)\]\(([^)]+)\)/g, '@$2');
  };

  return (
    <div className={`relative ${compact ? '' : 'border rounded-lg p-3'}`}>
      <div className="flex gap-3">
        {!compact && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="text-xs">You</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 space-y-2">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder={placeholder}
              value={getDisplayContent(content)}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              autoFocus={autoFocus}
              disabled={isSubmitting}
              rows={compact ? 2 : 3}
              className="resize-none pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-2 p-1 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => {
                const textarea = textareaRef.current;
                if (textarea) {
                  const cursor = textarea.selectionStart || content.length;
                  const newContent = content.slice(0, cursor) + '@' + content.slice(cursor);
                  setContent(newContent);
                  setCursorPosition(cursor + 1);
                  setShowMentions(true);
                  setMentionQuery('');
                  textarea.focus();
                }
              }}
              title="Mention someone"
            >
              <AtSign className="h-4 w-4" />
            </button>

            {/* Mention Autocomplete */}
            {showMentions && (
              <MentionAutocomplete
                query={mentionQuery}
                onSelect={handleMentionSelect}
                onClose={() => setShowMentions(false)}
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {compact ? '' : 'Press ⌘+Enter to submit • Use @ to mention'}
            </p>
            <div className="flex gap-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
