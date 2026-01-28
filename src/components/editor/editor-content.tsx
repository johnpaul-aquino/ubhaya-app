'use client';

import { useEditor, EditorContent as TiptapEditorContent, type JSONContent } from '@tiptap/react';
import { cn } from '@/lib/utils';
import { getEditorExtensions } from './editor-extensions';

interface EditorContentViewProps {
  content: string | JSONContent | null | undefined;
  className?: string;
}

/**
 * Read-only Editor Content Viewer
 * Renders rich text content without editing capabilities
 */
export function EditorContentView({ content, className }: EditorContentViewProps) {
  const extensions = getEditorExtensions({
    placeholder: '',
    enableTables: true,
    enableImages: true,
  });

  const parsedContent = parseContent(content);

  const editor = useEditor({
    extensions,
    content: parsedContent,
    editable: false,
    immediatelyRender: false, // Prevent SSR hydration mismatch
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none',
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
          'focus:outline-none',
          className
        ),
      },
    },
  });

  if (!editor) {
    return (
      <div className={cn('animate-pulse bg-muted h-32 rounded', className)} />
    );
  }

  return <TiptapEditorContent editor={editor} />;
}

/**
 * Parse content into a format Tiptap can understand
 */
function parseContent(content: string | JSONContent | null | undefined): JSONContent | string {
  if (!content) return '';

  // Already a JSON object
  if (typeof content === 'object') {
    return content;
  }

  // Try to parse as JSON
  try {
    const parsed = JSON.parse(content);
    // Check if it looks like Tiptap JSON
    if (parsed.type === 'doc' && Array.isArray(parsed.content)) {
      return parsed;
    }
    // If it's valid JSON but not Tiptap format, wrap in paragraph
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: content }],
        },
      ],
    };
  } catch {
    // Plain text - wrap in paragraph
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

/**
 * Simple HTML content viewer for backward compatibility
 * Use this when you want to render HTML string content
 */
export function HtmlContentView({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn(
        'prose prose-sm dark:prose-invert max-w-none',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Plain text content viewer for backward compatibility
 */
export function PlainTextView({ text, className }: { text: string; className?: string }) {
  return (
    <pre className={cn('whitespace-pre-wrap font-sans text-sm', className)}>
      {text}
    </pre>
  );
}
