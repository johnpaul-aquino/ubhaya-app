'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ShareDocumentDialog } from '@/components/dashboard/share-document-dialog';
import { CommentSection } from '@/components/dashboard/comment-section';
import { EditorContentView, PlainTextView } from '@/components/editor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import {
  ArrowLeft,
  FileText,
  StickyNote,
  File,
  Download,
  Share2,
  Edit,
  Trash2,
  Lock,
  Users,
  Globe,
  Calendar,
  User,
  Link as LinkIcon,
  Building2,
  Contact,
  MoreHorizontal,
} from 'lucide-react';
import type { Document } from '@/types/dashboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TYPE_ICONS: Record<string, React.ElementType> = {
  NOTE: StickyNote,
  FILE: File,
  MEETING_NOTE: StickyNote,
  TEMPLATE: FileText,
};

const VISIBILITY_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  PRIVATE: { icon: Lock, label: 'Private', color: 'bg-gray-100 text-gray-700' },
  TEAM: { icon: Users, label: 'Team', color: 'bg-blue-100 text-blue-700' },
  ORGANIZATION: { icon: Building2, label: 'Organization', color: 'bg-purple-100 text-purple-700' },
  SHARED: { icon: Globe, label: 'Shared', color: 'bg-green-100 text-green-700' },
};

interface DocumentLink {
  id: string;
  linkType: string;
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  facility?: {
    id: string;
    name: string;
    type: string;
  };
}

interface ExtendedDocument extends Document {
  links?: DocumentLink[];
  team?: {
    id: string;
    name: string;
  };
}

/**
 * Document Detail Page
 * Full view of a document with metadata, content, and comments
 */
export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const [document, setDocument] = useState<ExtendedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDocument = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/documents/${documentId}`);
      const data = await response.json();

      if (data.success) {
        setDocument(data.document);
      } else {
        toast.error(data.error || 'Document not found');
        router.push('/dashboard/documents');
      }
    } catch (error) {
      console.error('Failed to fetch document:', error);
      toast.error('Failed to load document');
      router.push('/dashboard/documents');
    } finally {
      setLoading(false);
    }
  }, [documentId, router]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  const handleDownload = async () => {
    if (!document || document.type !== 'FILE') return;

    try {
      const response = await fetch(`/api/documents/${documentId}/download`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Download failed');
      }

      window.open(data.downloadUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Delete failed');
      }

      toast.success('Document deleted');
      router.push('/dashboard/documents');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShareComplete = (updatedDocument: Document) => {
    setDocument((prev) => (prev ? { ...prev, ...updatedDocument } : null));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DocumentDetailSkeleton />
      </DashboardLayout>
    );
  }

  if (!document) {
    return null;
  }

  const Icon = TYPE_ICONS[document.type] || File;
  const visibilityConfig = VISIBILITY_CONFIG[document.visibility];
  const VisibilityIcon = visibilityConfig.icon;
  const isFile = document.type === 'FILE';
  const authorInitials = document.author
    ? `${document.author.firstName[0]}${document.author.lastName[0]}`.toUpperCase()
    : 'U';

  return (
    <DashboardLayout>
      {/* Back Navigation */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => router.push('/dashboard/documents')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Documents
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{document.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={visibilityConfig.color}>
                        <VisibilityIcon className="h-3 w-3 mr-1" />
                        {visibilityConfig.label}
                      </Badge>
                      <Badge variant="outline">
                        {document.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!isFile && (
                    <Button
                      size="sm"
                      onClick={() => router.push(`/dashboard/documents/${documentId}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  {isFile && (
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/documents/${documentId}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            {/* Content Preview */}
            {!isFile && (document.contentJson || document.content) && (
              <CardContent>
                <Separator className="mb-4" />
                {document.contentFormat === 'TIPTAP_JSON' && document.contentJson ? (
                  <EditorContentView content={document.contentJson} />
                ) : document.content ? (
                  <PlainTextView text={document.content} />
                ) : null}
              </CardContent>
            )}

            {isFile && (
              <CardContent>
                <Separator className="mb-4" />
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <File className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{document.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {document.fileSize
                        ? `${(document.fileSize / 1024 / 1024).toFixed(2)} MB`
                        : 'Unknown size'}
                    </p>
                  </div>
                  <Button className="ml-auto" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Discussion</CardTitle>
              <CardDescription>
                Comments and collaboration on this document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommentSection documentId={documentId} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {document.author?.firstName} {document.author?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">Author</p>
                </div>
              </div>

              <Separator />

              {/* Dates */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p>{format(new Date(document.createdAt), 'PPP')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Updated</p>
                    <p>{formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}</p>
                  </div>
                </div>
              </div>

              {/* Team */}
              {document.team && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Team</p>
                      <p>{document.team.name}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Linked Entities */}
          {document.links && document.links.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Linked To
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {document.links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    {link.linkType === 'CONTACT' && link.contact && (
                      <>
                        <Contact className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {link.contact.firstName} {link.contact.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {link.contact.email}
                          </p>
                        </div>
                      </>
                    )}
                    {link.linkType === 'FACILITY' && link.facility && (
                      <>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{link.facility.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {link.facility.type}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDocumentDialog
        document={document}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onShareComplete={handleShareComplete}
      />
    </DashboardLayout>
  );
}

/**
 * Document Detail Skeleton
 */
function DocumentDetailSkeleton() {
  return (
    <>
      <Skeleton className="h-9 w-40 mb-4" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Skeleton className="h-14 w-14 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-px w-full mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-16" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
