'use client';

import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getEditorExtensions } from './editor-extensions';
import { EditorToolbar } from './editor-toolbar';

export interface RichTextEditorProps {
  initialContent?: string | JSONContent;
  onChange?: (content: JSONContent, html: string) => void;
  onSave?: (content: JSONContent) => Promise<void>;
  readOnly?: boolean;
  placeholder?: string;
  enableTables?: boolean;
  enableImages?: boolean;
  className?: string;
  minHeight?: string;
}

/**
 * Rich Text Editor Component
 * A full-featured WYSIWYG editor built on Tiptap
 */
export function RichTextEditor({
  initialContent,
  onChange,
  readOnly = false,
  placeholder = 'Start writing your document...',
  enableTables = true,
  enableImages = true,
  className,
  minHeight = '300px',
}: RichTextEditorProps) {
  const extensions = getEditorExtensions({
    placeholder,
    enableTables,
    enableImages,
  });

  const editor = useEditor({
    extensions,
    content: initialContent || '',
    editable: !readOnly,
    immediatelyRender: false, // Prevent SSR hydration mismatch
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none focus:outline-none',
          'prose-headings:font-semibold prose-headings:tracking-tight',
          'prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg',
          'prose-p:leading-relaxed prose-p:my-3',
          'prose-ul:my-3 prose-ol:my-3',
          'prose-li:my-1',
          'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic',
          'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
          'prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg',
          'prose-a:text-primary prose-a:underline',
          '[&_table]:w-full [&_table]:border-collapse',
          '[&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:bg-muted [&_th]:text-left [&_th]:font-medium',
          '[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2',
          'p-4'
        ),
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getJSON(), editor.getHTML());
      }
    },
  });

  // Update content when initialContent changes
  useEffect(() => {
    if (editor && initialContent) {
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = typeof initialContent === 'string'
        ? initialContent
        : JSON.stringify(initialContent);

      // Only update if content is actually different
      if (currentContent !== newContent) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [editor, initialContent]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  if (!editor) {
    return (
      <div
        className={cn(
          'border border-border rounded-lg bg-card animate-pulse',
          className
        )}
        style={{ minHeight }}
      />
    );
  }

  return (
    <div
      className={cn(
        'border border-border rounded-lg bg-card overflow-hidden',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        className
      )}
    >
      {!readOnly && (
        <EditorToolbar
          editor={editor}
          enableTables={enableTables}
          enableImages={enableImages}
        />
      )}
      <EditorContent editor={editor} />

      {/* Character count */}
      {!readOnly && (
        <div className="flex items-center justify-end px-3 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
          {editor.storage.characterCount?.characters().toLocaleString()} characters
        </div>
      )}
    </div>
  );
}

/**
 * Export editor utility functions
 */
export function parseEditorContent(content: string | JSONContent | null | undefined): JSONContent | string {
  if (!content) return '';
  if (typeof content === 'object') return content;

  // Try to parse as JSON
  try {
    return JSON.parse(content);
  } catch {
    // Return as plain text wrapped in a paragraph
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: content }],
        },
      ],
    };
  }
}

export function isRichContent(content: string | JSONContent | null | undefined): boolean {
  if (!content) return false;
  if (typeof content === 'object') return true;

  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}
