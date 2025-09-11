/**
 * Blog Post Card - Displays blog post preview in listing
 */

import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/lib/types/cms'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface BlogPostCardProps {
  post: BlogPost
  className?: string
}

export function BlogPostCard({ post, className }: BlogPostCardProps) {
  return (
    <article className={cn('group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md', className)}>
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        <div className="p-6">
          {/* Category */}
          <div className="mb-2 flex items-center space-x-2">
            <span 
              className="inline-block rounded-full px-2 py-1 text-xs font-medium"
              style={{
                backgroundColor: post.category.color ? `${post.category.color}20` : 'hsl(var(--muted))',
                color: post.category.color || 'hsl(var(--muted-foreground))',
              }}
            >
              {post.category.name}
            </span>
            
            {post.readingTime && (
              <span className="text-xs text-muted-foreground">
                {post.readingTime} min read
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-xl font-semibold group-hover:text-primary">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="mb-4 line-clamp-3 text-muted-foreground">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                >
                  #{tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Author and Date */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar.url}
                  alt={post.author.avatar.alt || post.author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span>{post.author.name}</span>
            </div>
            
            <time 
              dateTime={post.publishedAt || post.createdAt}
              title={formatDate(post.publishedAt || post.createdAt)}
            >
              {formatRelativeTime(post.publishedAt || post.createdAt)}
            </time>
          </div>
        </div>
      </Link>
    </article>
  )
}