'use client';

import { useRouter } from 'next/navigation';
import type { Document } from '@/types/dashboard';
import {
  FileText,
  File,
  Image as ImageIcon,
  FileSpreadsheet,
  Presentation,
  StickyNote,
  Download,
  Link,
  Users,
  Lock,
  Globe,
  Building2,
  MoreHorizontal,
  Trash2,
  Edit,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface DocumentCardProps {
  document: Document;
  onClick?: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (document: Document) => void;
  onShare?: (document: Document) => void;
}

const FILE_ICONS: Record<string, React.ElementType> = {
  'application/pdf': FileText,
  'application/msword': FileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
  'application/vnd.ms-excel': FileSpreadsheet,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileSpreadsheet,
  'application/vnd.ms-powerpoint': Presentation,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': Presentation,
  'image/jpeg': ImageIcon,
  'image/png': ImageIcon,
  'image/gif': ImageIcon,
  'image/webp': ImageIcon,
  'text/plain': FileText,
  'text/csv': FileSpreadsheet,
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  NOTE: StickyNote,
  FILE: File,
  MEETING_NOTE: StickyNote,
  TEMPLATE: FileText,
};

const VISIBILITY_ICONS: Record<string, React.ElementType> = {
  PRIVATE: Lock,
  TEAM: Users,
  ORGANIZATION: Building2,
  SHARED: Globe,
};

const VISIBILITY_LABELS: Record<string, string> = {
  PRIVATE: 'Private',
  TEAM: 'Team',
  ORGANIZATION: 'Organization',
  SHARED: 'Shared',
};

function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(mimeType: string | null | undefined): React.ElementType {
  if (!mimeType) return File;
  return FILE_ICONS[mimeType] || File;
}

/**
 * Document Card Component
 * Displays a document with actions and metadata
 */
export function DocumentCard({
  document,
  onClick,
  onDelete,
  onEdit,
  onShare,
}: DocumentCardProps) {
  const router = useRouter();
  const isFile = document.type === 'FILE';
  const Icon = isFile
    ? getFileIcon(document.mimeType)
    : TYPE_ICONS[document.type] || File;
  const VisibilityIcon = VISIBILITY_ICONS[document.visibility];

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isFile) return;

    try {
      const response = await fetch(`/api/documents/${document.id}/download`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Download failed');
      }

      // Open download URL in new tab
      window.open(data.downloadUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Delete failed');
      }

      toast.success('Document deleted');
      onDelete?.(document.id);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Delete failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const timeAgo = formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true });

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/dashboard/documents/${document.id}`);
    }
  };

  return (
    <div
      className="group flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
      onClick={handleClick}
    >
      {/* Icon */}
      <div className="p-2.5 rounded-lg bg-primary/10 flex-shrink-0">
        <Icon className="h-6 w-6 text-primary" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm truncate">{document.title}</h4>
          <Badge variant="outline" className="text-xs h-5 px-1.5 gap-1">
            <VisibilityIcon className="h-3 w-3" />
            {VISIBILITY_LABELS[document.visibility]}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          {isFile && document.fileName && (
            <span className="truncate max-w-[150px]">{document.fileName}</span>
          )}
          {isFile && document.fileSize && (
            <span>{formatFileSize(document.fileSize)}</span>
          )}
          {document.author && (
            <span>
              by {document.author.firstName} {document.author.lastName}
            </span>
          )}
          <span>{timeAgo}</span>
        </div>
        {/* Links count */}
        {document._count && document._count.links > 0 && (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Link className="h-3 w-3" />
            <span>{document._count.links} linked</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isFile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isFile && (
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(document); }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare?.(document); }}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              <Link className="h-4 w-4 mr-2" />
              Link to Contact
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
