'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import { getEditorExtensions } from '@/components/editor/editor-extensions';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { EditorBubbleMenu } from '@/components/editor/editor-bubble-menu';
import { TemplatePicker } from '@/components/editor/templates/template-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Save,
  Cloud,
  CloudOff,
  Loader2,
  MoreHorizontal,
  Trash2,
  Share2,
  Eye,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Document } from '@/types/dashboard';

const AUTOSAVE_DELAY = 30000; // 30 seconds

/**
 * Full-Screen Document Editor Page
 * Provides a distraction-free editing experience with autosave
 */
export default function DocumentEditPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<ReturnType<typeof useEditor> | null>(null);
  const contentLoadedRef = useRef(false); // Track if initial content is loaded (ref to avoid re-render)

  const extensions = getEditorExtensions({
    placeholder: 'Start writing your document...',
    enableTables: true,
    enableImages: true,
  });

  const editor = useEditor({
    extensions,
    content: '',
    editable: true,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-lg dark:prose-invert max-w-none focus:outline-none',
          'prose-headings:font-semibold prose-headings:tracking-tight',
          'prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl',
          'prose-p:leading-relaxed prose-p:my-4',
          'prose-ul:my-4 prose-ol:my-4',
          'prose-li:my-2',
          'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic',
          'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
          'prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg',
          'prose-a:text-primary prose-a:underline',
          '[&_table]:w-full [&_table]:border-collapse',
          '[&_th]:border [&_th]:border-border [&_th]:px-4 [&_th]:py-2 [&_th]:bg-muted [&_th]:text-left [&_th]:font-medium',
          '[&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-2',
          'min-h-[500px] px-4 py-6'
        ),
      },
    },
    onUpdate: () => {
      // Only track changes after initial content is loaded to prevent
      // accidental autosave of empty content during initialization
      if (contentLoadedRef.current) {
        setHasUnsavedChanges(true);
        scheduleAutosave();
      }
    },
  });

  // Store editor ref for autosave
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Fetch document on load
  const fetchDocument = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/documents/${documentId}`);
      const data = await response.json();

      if (data.success) {
        setDocument(data.document);
        setTitle(data.document.title);

        // Set editor content
        if (editor) {
          const content =
            data.document.contentFormat === 'TIPTAP_JSON' && data.document.contentJson
              ? data.document.contentJson
              : data.document.content || '';
          editor.commands.setContent(content);
          // Mark content as loaded AFTER setting it, to prevent autosave race condition
          // Use setTimeout to ensure the onUpdate from setContent doesn't trigger autosave
          setTimeout(() => {
            contentLoadedRef.current = true;
          }, 100);
        }
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
  }, [documentId, router, editor]);

  useEffect(() => {
    if (editor) {
      fetchDocument();
    }
  }, [fetchDocument, editor]);

  // Schedule autosave
  const scheduleAutosave = useCallback(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    autosaveTimerRef.current = setTimeout(() => {
      saveDocument(true);
    }, AUTOSAVE_DELAY);
  }, []);

  // Save document
  const saveDocument = useCallback(
    async (isAutosave = false) => {
      if (!editorRef.current || saving) return;

      setSaving(true);
      try {
        const contentJson = editorRef.current.getJSON();
        const contentHtml = editorRef.current.getHTML();

        const response = await fetch(`/api/documents/${documentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim() || 'Untitled',
            content: contentHtml,
            contentJson,
            contentFormat: 'TIPTAP_JSON',
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Save failed');
        }

        setLastSaved(new Date());
        setHasUnsavedChanges(false);

        if (!isAutosave) {
          toast.success('Document saved');
        }
      } catch (error) {
        console.error('Save error:', error);
        toast.error('Failed to save document');
      } finally {
        setSaving(false);
      }
    },
    [documentId, title, saving]
  );

  // Handle template selection
  const handleTemplateSelect = (content: JSONContent) => {
    if (editor) {
      editor.commands.setContent(content);
      setHasUnsavedChanges(true);
    }
  };

  // Keyboard shortcut for save (Cmd/Ctrl + S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveDocument(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveDocument]);

  // Cleanup autosave timer
  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, []);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) return;

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
    }
  };

  if (loading || !editor) {
    return <EditorSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (hasUnsavedChanges) {
                  if (confirm('You have unsaved changes. Save before leaving?')) {
                    saveDocument(false).then(() =>
                      router.push(`/dashboard/documents/${documentId}`)
                    );
                    return;
                  }
                }
                router.push(`/dashboard/documents/${documentId}`);
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
                scheduleAutosave();
              }}
              placeholder="Untitled Document"
              className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 px-2 max-w-md"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Save status indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <CloudOff className="h-4 w-4" />
                  <span>Unsaved changes</span>
                </>
              ) : lastSaved ? (
                <>
                  <Cloud className="h-4 w-4 text-green-500" />
                  <span>Saved</span>
                </>
              ) : null}
            </div>

            <TemplatePicker onSelect={handleTemplateSelect} />

            <Button variant="outline" size="sm" onClick={() => saveDocument(false)}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/dashboard/documents/${documentId}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Document
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
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

        {/* Toolbar */}
        <EditorToolbar editor={editor} enableTables={true} enableImages={true} />
      </header>

      {/* Editor Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-8">
          {/* Bubble Menu */}
          <EditorBubbleMenu editor={editor} />

          {/* Editor */}
          <EditorContent editor={editor} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground max-w-4xl mx-auto">
          <div>
            {editor.storage.characterCount?.characters().toLocaleString()} characters
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              {document?.type.replace('_', ' ')}
            </Badge>
            {lastSaved && (
              <span>
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Editor Skeleton Loading State
 */
function EditorSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </header>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </main>
    </div>
  );
}
