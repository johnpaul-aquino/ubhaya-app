'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import { getEditorExtensions } from '@/components/editor/editor-extensions';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { EditorBubbleMenu } from '@/components/editor/editor-bubble-menu';
import { TemplatePicker } from '@/components/editor/templates/template-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Save,
  Loader2,
  MoreHorizontal,
  Lock,
  Users,
  Globe,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

type DocumentVisibility = 'PRIVATE' | 'TEAM' | 'SHARED';
type DocumentType = 'NOTE' | 'MEETING_NOTE';

const VISIBILITY_OPTIONS: { value: DocumentVisibility; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'PRIVATE', label: 'Private', icon: Lock, description: 'Only you can view' },
  { value: 'TEAM', label: 'Team', icon: Users, description: 'Share with team' },
  { value: 'SHARED', label: 'Shared', icon: Globe, description: 'Anyone with link' },
];

/**
 * Full-Screen New Document Page
 * Create a new note with full editor capabilities
 */
export default function NewDocumentPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState<DocumentVisibility>('PRIVATE');
  const [documentType, setDocumentType] = useState<DocumentType>('NOTE');
  const [saving, setSaving] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const editorRef = useRef<ReturnType<typeof useEditor> | null>(null);

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
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setHasContent(text.trim().length > 0);
    },
  });

  // Store editor ref
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Handle template selection
  const handleTemplateSelect = (content: JSONContent) => {
    if (editor) {
      editor.commands.setContent(content);
      setHasContent(true);
    }
  };

  // Create document
  const createDocument = useCallback(async () => {
    if (!editorRef.current) return;
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      const contentJson = editorRef.current.getJSON();
      const contentHtml = editorRef.current.getHTML();

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: contentHtml,
          contentJson,
          contentFormat: 'TIPTAP_JSON',
          type: documentType,
          visibility,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create document');
      }

      toast.success('Document created successfully!');
      // Navigate to the edit page of the new document
      router.push(`/dashboard/documents/${data.document.id}/edit`);
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Failed to create document');
    } finally {
      setSaving(false);
    }
  }, [title, documentType, visibility, router]);

  // Keyboard shortcut for save (Cmd/Ctrl + S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        createDocument();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createDocument]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasContent || title.trim()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasContent, title]);

  const currentVisibility = VISIBILITY_OPTIONS.find(v => v.value === visibility)!;
  const VisibilityIcon = currentVisibility.icon;

  if (!editor) {
    return null;
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
                if (hasContent || title.trim()) {
                  if (!confirm('You have unsaved changes. Discard and leave?')) {
                    return;
                  }
                }
                router.push('/dashboard/documents');
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Document"
              className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 px-2 max-w-md"
              autoFocus
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Visibility selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <VisibilityIcon className="h-4 w-4" />
                  {currentVisibility.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Visibility</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {VISIBILITY_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setVisibility(option.value)}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <TemplatePicker onSelect={handleTemplateSelect} />

            <Button
              onClick={createDocument}
              disabled={saving || !title.trim()}
              className="gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'Creating...' : 'Create'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Document Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDocumentType('NOTE')}
                  className={documentType === 'NOTE' ? 'bg-accent' : ''}
                >
                  Note
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDocumentType('MEETING_NOTE')}
                  className={documentType === 'MEETING_NOTE' ? 'bg-accent' : ''}
                >
                  Meeting Note
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
              {documentType.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs gap-1">
              <VisibilityIcon className="h-3 w-3" />
              {currentVisibility.label}
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}
