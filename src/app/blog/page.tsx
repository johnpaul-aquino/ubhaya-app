/**
 * Blog Listing Page - Dynamic blog listing with ISR support
 * Implements pagination, filtering, and search functionality
 */

import type { Metadata } from 'next/metadata'
import { Suspense } from 'react'
import { getAllBlogPosts, getSiteConfiguration } from '@/lib/cms'
import { BlogPostCard } from '@/components/content/blog-post-card'
import { BlogFilters } from '@/components/content/blog-filters'
import { Pagination } from '@/components/ui/pagination'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Enable ISR - revalidate every 5 minutes
export const revalidate = 300

interface BlogPageProps {
  searchParams: {
    page?: string
    category?: string
    author?: string
    tag?: string
    search?: string
  }
}

// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteConfig = await getSiteConfiguration()
    
    return {
      title: 'Blog',
      description: 'Latest articles, insights, and updates from our team.',
      openGraph: {
        title: `Blog | ${siteConfig?.siteName || 'Next.js Headless'}`,
        description: 'Latest articles, insights, and updates from our team.',
        url: '/blog',
        type: 'website',
      },
      alternates: {
        canonical: '/blog',
      },
    }
  } catch (error) {
    console.error('Error generating blog metadata:', error)
    return {
      title: 'Blog',
      description: 'Latest articles, insights, and updates from our team.',
    }
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1', 10)
  const limit = 12
  const offset = (page - 1) * limit

  try {
    // Build query parameters
    const query = {
      limit,
      offset,
      orderBy: 'publishedAt',
      orderDirection: 'desc' as const,
      filters: {
        ...(searchParams.category && { category: searchParams.category }),
        ...(searchParams.author && { author: searchParams.author }),
        ...(searchParams.tag && { tag: searchParams.tag }),
      },
      ...(searchParams.search && { search: searchParams.search }),
    }

    // Fetch blog posts
    const result = await getAllBlogPosts(query)
    const { items: posts, meta } = result

    return (
      <div className="container py-12 md:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Latest articles, insights, and updates from our team.
            </p>
          </div>

          {/* Filters */}
          <Suspense fallback={<div className="mb-8 h-16 animate-pulse rounded-lg bg-muted" />}>
            <BlogFilters
              currentCategory={searchParams.category}
              currentAuthor={searchParams.author}
              currentTag={searchParams.tag}
              currentSearch={searchParams.search}
            />
          </Suspense>

          {/* Results summary */}
          {(searchParams.search || searchParams.category || searchParams.author || searchParams.tag) && (
            <div className="mb-8 rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                {meta.total === 0 ? 'No posts found' : `Found ${meta.total} post${meta.total === 1 ? '' : 's'}`}
                {searchParams.search && (
                  <span> for &quot;{searchParams.search}&quot;</span>
                )}
                {searchParams.category && (
                  <span> in category &quot;{searchParams.category}&quot;</span>
                )}
                {searchParams.author && (
                  <span> by &quot;{searchParams.author}&quot;</span>
                )}
                {searchParams.tag && (
                  <span> tagged with &quot;{searchParams.tag}&quot;</span>
                )}
              </p>
            </div>
          )}

          {/* Blog posts grid */}
          {posts.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">No posts found</h3>
              <p className="text-muted-foreground">
                {searchParams.search || searchParams.category || searchParams.author || searchParams.tag
                  ? 'Try adjusting your filters to find more posts.'
                  : 'Check back later for new content.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                hasNext={meta.hasNext}
                hasPrev={meta.hasPrev}
                basePath="/blog"
                searchParams={searchParams}
              />
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error rendering blog page:', error)
    
    return (
      <div className="container py-12 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Blog</h1>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
            <p className="text-destructive">
              Unable to load blog posts. Please try again later.
            </p>
          </div>
        </div>
      </div>
    )
  }
}