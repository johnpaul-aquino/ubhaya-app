/**
 * Content Renderer - Renders rich text content from CMS
 */

import type { RichTextContent } from '@/lib/types/cms'
import { cn } from '@/lib/utils'

interface ContentRendererProps {
  content: RichTextContent
  className?: string
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  // If we have HTML content, render it
  if (content.html) {
    return (
      <div
        className={cn('prose max-w-none dark:prose-invert', className)}
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    )
  }

  // If we have markdown, convert to HTML (you'd use a markdown parser here)
  if (content.markdown) {
    // For now, just render as text - in a real app, use remark/rehype
    return (
      <div className={cn('prose max-w-none dark:prose-invert', className)}>
        <pre className="whitespace-pre-wrap">{content.markdown}</pre>
      </div>
    )
  }

  // Fallback to plain text
  if (content.plainText) {
    return (
      <div className={cn('prose max-w-none dark:prose-invert', className)}>
        <p className="whitespace-pre-wrap">{content.plainText}</p>
      </div>
    )
  }

  // Handle raw content based on CMS type
  if (content.raw) {
    // This is where you'd handle different CMS raw formats
    // For now, just render as JSON for debugging
    return (
      <div className={cn('prose max-w-none dark:prose-invert', className)}>
        <pre className="text-sm">
          {JSON.stringify(content.raw, null, 2)}
        </pre>
      </div>
    )
  }

  return null
}