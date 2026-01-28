'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DocumentCard } from '@/components/dashboard/document-card';
import { UploadDocumentDialog } from '@/components/dashboard/upload-document-dialog';
import { ShareDocumentDialog } from '@/components/dashboard/share-document-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlurFade } from '@/components/ui/blur-fade';
import {
  Search,
  Upload,
  FileText,
  File,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  FolderOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Document, DocumentsResponse, DocumentType, DocumentVisibility } from '@/types/dashboard';

/**
 * Documents Page
 * Manage documents, notes, and file uploads with S3 integration
 */
export default function DocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>(
    (searchParams.get('type') as DocumentType) || 'all'
  );
  const [visibilityFilter, setVisibilityFilter] = useState<DocumentVisibility | 'all'>(
    (searchParams.get('visibility') as DocumentVisibility) || 'all'
  );
  const [page, setPage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  );

  // Share dialog state
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [documentToShare, setDocumentToShare] = useState<Document | null>(null);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (visibilityFilter !== 'all') params.set('visibility', visibilityFilter);
      params.set('page', page.toString());
      params.set('pageSize', '20');

      const response = await fetch(`/api/documents?${params.toString()}`);
      const data: DocumentsResponse = await response.json();

      if (data.success) {
        setDocuments(data.documents);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to load documents');
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, typeFilter, visibilityFilter, page]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (typeFilter !== 'all') params.set('type', typeFilter);
    if (visibilityFilter !== 'all') params.set('visibility', visibilityFilter);
    if (page > 1) params.set('page', page.toString());

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : '/dashboard/documents';
    router.replace(newUrl, { scroll: false });
  }, [debouncedSearch, typeFilter, visibilityFilter, page, router]);

  // Handle new document uploaded
  const handleUploadComplete = (newDocument: Document) => {
    setDocuments(prev => [newDocument, ...prev]);
    setPagination(prev => ({ ...prev, total: prev.total + 1 }));
  };

  // Handle document delete
  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== documentId));
    setPagination(prev => ({ ...prev, total: prev.total - 1 }));
  };

  // Handle document share
  const handleShareDocument = (document: Document) => {
    setDocumentToShare(document);
    setShareDialogOpen(true);
  };

  // Handle share complete - update document in list
  const handleShareComplete = (updatedDocument: Document) => {
    setDocuments(prev =>
      prev.map(d => d.id === updatedDocument.id ? updatedDocument : d)
    );
  };

  // Calculate stats
  const stats = [
    {
      label: 'Total Documents',
      value: pagination.total,
      icon: FolderOpen,
      color: 'text-blue-500',
    },
    {
      label: 'Files',
      value: documents.filter(d => d.type === 'FILE').length,
      icon: File,
      color: 'text-green-500',
    },
    {
      label: 'Notes',
      value: documents.filter(d => d.type === 'NOTE' || d.type === 'MEETING_NOTE').length,
      icon: StickyNote,
      color: 'text-yellow-500',
    },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Document Library</h1>
        </div>
        <p className="text-muted-foreground">
          Store and manage your documents, notes, and files
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <BlurFade key={stat.label} delay={0.1}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-primary/10`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>

      {/* Upload Section */}
      <Card className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 border-0">
        <CardContent className="py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-white">Upload Documents</h2>
            <p className="mb-4 text-white/90">
              Securely store your files with S3 cloud storage
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <UploadDocumentDialog
                onUploadComplete={handleUploadComplete}
                trigger={
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 font-medium">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                }
              />
              <Link href="/dashboard/documents/new">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Note
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents by title or content..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Type Filter */}
            <Tabs
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v as DocumentType | 'all');
                setPage(1);
              }}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="FILE">Files</TabsTrigger>
                <TabsTrigger value="NOTE">Notes</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Refresh */}
            <Button
              variant="outline"
              size="icon"
              onClick={fetchDocuments}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-muted-foreground">
            {loading ? (
              'Loading...'
            ) : (
              <>
                Showing {documents.length} of {pagination.total} documents
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Documents</CardTitle>
          <UploadDocumentDialog
            onUploadComplete={handleUploadComplete}
            trigger={
              <Button size="sm" variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            }
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                {search
                  ? 'Try adjusting your search terms'
                  : 'Get started by uploading your first document'}
              </p>
              {!search && (
                <UploadDocumentDialog
                  onUploadComplete={handleUploadComplete}
                  trigger={
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  }
                />
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((document, index) => (
                <BlurFade key={document.id} delay={0.05 * index}>
                  <DocumentCard
                    document={document}
                    onDelete={handleDeleteDocument}
                    onShare={handleShareDocument}
                  />
                </BlurFade>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Share Document Dialog */}
      {documentToShare && (
        <ShareDocumentDialog
          document={documentToShare}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          onShareComplete={handleShareComplete}
        />
      )}
    </DashboardLayout>
  );
}
