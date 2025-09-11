/**
 * Blog Post Meta - Author and date information for blog posts
 */

import Image from 'next/image'
import Link from 'next/link'
import type { Author } from '@/lib/types/cms'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface BlogPostMetaProps {
  author: Author
  publishedAt: string
  readingTime?: number
  className?: string
}

export function BlogPostMeta({
  author,
  publishedAt,
  readingTime,
  className,
}: BlogPostMetaProps) {
  return (
    <div className={cn('mb-8 flex items-center justify-between border-b border-border pb-6', className)}>
      <div className="flex items-center space-x-4">
        {/* Author Avatar */}
        {author.avatar && (
          <Link href={`/blog?author=${author.slug}`}>
            <Image
              src={author.avatar.url}
              alt={author.avatar.alt || author.name}
              width={48}
              height={48}
              className="rounded-full object-cover transition-opacity hover:opacity-80"
            />
          </Link>
        )}
        
        <div>
          {/* Author Name */}
          <Link
            href={`/blog?author=${author.slug}`}
            className="font-medium transition-colors hover:text-primary"
          >
            {author.name}
          </Link>
          
          {/* Date and Reading Time */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <time dateTime={publishedAt}>
              {formatDate(publishedAt)}
            </time>
            {readingTime && (
              <>
                <span>•</span>
                <span>{readingTime} min read</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}