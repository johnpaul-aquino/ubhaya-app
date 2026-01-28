'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { MessageCircle, RefreshCw, ChevronDown } from 'lucide-react';
import { CommentInput } from './comment-input';
import { CommentThread } from './comment-thread';

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

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface CommentSectionProps {
  documentId: string;
}

/**
 * Comment Section Component
 * Full comments section with list and input
 */
export function CommentSection({ documentId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch comments
  const fetchComments = useCallback(async (page = 1, append = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '10',
      });

      const response = await fetch(`/api/documents/${documentId}/comments?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        if (append) {
          setComments((prev) => [...prev, ...data.comments]);
        } else {
          setComments(data.comments);
        }
        setPagination(data.pagination);
      } else {
        toast.error('Failed to load comments');
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [documentId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentCreated = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
    setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
  };

  const handleCommentUpdated = (updatedComment: Comment) => {
    setComments((prev) =>
      prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
    );
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchComments(pagination.page + 1, true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">
            Comments {pagination.total > 0 && `(${pagination.total})`}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchComments(1)}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* New Comment Input */}
      <CommentInput
        documentId={documentId}
        onCommentCreated={handleCommentCreated}
        placeholder="Add a comment..."
      />

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>No comments yet</p>
          <p className="text-sm">Be the first to comment on this document</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              documentId={documentId}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
            />
          ))}

          {/* Load More */}
          {pagination.page < pagination.totalPages && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Load More Comments
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Comment Skeleton
 */
function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
