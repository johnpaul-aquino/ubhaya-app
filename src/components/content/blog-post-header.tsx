/**
 * Blog Post Header - Header section for individual blog posts
 */

import Image from 'next/image'
import Link from 'next/link'
import type { MediaAsset, Category, Tag } from '@/lib/types/cms'
import { cn } from '@/lib/utils'

interface BlogPostHeaderProps {
  title: string
  excerpt?: string
  featuredImage?: MediaAsset
  category: Category
  tags: Tag[]
  className?: string
}

export function BlogPostHeader({
  title,
  excerpt,
  featuredImage,
  category,
  tags,
  className,
}: BlogPostHeaderProps) {
  return (
    <header className={cn('mb-8', className)}>
      {/* Category */}
      <div className="mb-4">
        <Link
          href={`/blog?category=${category.slug}`}
          className="inline-block rounded-full px-3 py-1 text-sm font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: category.color ? `${category.color}20` : 'hsl(var(--muted))',
            color: category.color || 'hsl(var(--muted-foreground))',
          }}
        >
          {category.name}
        </Link>
      </div>

      {/* Title */}
      <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        {title}
      </h1>

      {/* Excerpt */}
      {excerpt && (
        <p className="mb-6 text-xl leading-relaxed text-muted-foreground">
          {excerpt}
        </p>
      )}

      {/* Featured Image */}
      {featuredImage && (
        <div className="mb-6 overflow-hidden rounded-lg">
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || title}
            width={featuredImage.width || 1200}
            height={featuredImage.height || 600}
            className="w-full object-cover"
            priority
          />
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog?tag=${tag.slug}`}
              className="rounded-md bg-muted px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted/80"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}