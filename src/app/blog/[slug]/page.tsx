/**
 * Blog Post Page - Dynamic blog post with comprehensive SEO
 * Implements advanced structured data, social sharing, and related posts
 */

import type { Metadata } from 'next/metadata'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getAllBlogPosts, getSiteConfiguration } from '@/lib/cms'
import { ContentRenderer } from '@/components/content/content-renderer'
import { BlogPostHeader } from '@/components/content/blog-post-header'
import { BlogPostMeta } from '@/components/content/blog-post-meta'
import { RelatedPosts } from '@/components/content/related-posts'
import { ShareButtons } from '@/components/content/share-buttons'
import { ArticleSchema } from '@/components/seo/article-schema'
import { BreadcrumbsSchema } from '@/components/seo/breadcrumbs-schema'
import { generateMetadata as generateSEOMetadata } from '@/components/seo/seo-head'

// Enable ISR - revalidate every 5 minutes
export const revalidate = 300

interface BlogPostPageProps {
  params: { slug: string }
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  try {
    const result = await getAllBlogPosts({ limit: 100 }) // Get first 100 posts
    return result.items.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Enhanced metadata generation with comprehensive SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const [post, siteConfig] = await Promise.all([
      getBlogPostBySlug(params.slug),
      getSiteConfiguration(),
    ])
    
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.',
        robots: { index: false, follow: false },
      }
    }

    // Generate comprehensive SEO metadata
    const metadata = generateSEOMetadata({
      seo: post.seo,
      siteConfig,
      url: `/blog/${post.slug}`,
      type: 'article',
      article: {
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        author: post.author.name,
        section: post.category.name,
        tags: post.tags.map(tag => tag.name),
      },
      additionalMeta: {
        'article:author': post.author.name,
        'article:section': post.category.name,
        'article:published_time': post.publishedAt || post.createdAt,
        'article:modified_time': post.updatedAt,
        ...(post.readingTime && { 'twitter:label1': 'Reading time', 'twitter:data1': `${post.readingTime} min` }),
        'twitter:label2': 'Category',
        'twitter:data2': post.category.name,
      },
    })

    return metadata
  } catch (error) {
    console.error('Error generating blog post metadata:', error)
    return {
      title: 'Blog Post',
      description: 'A blog post from our website.',
      robots: { index: false, follow: false },
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const [post, siteConfig] = await Promise.all([
      getBlogPostBySlug(params.slug),
      getSiteConfiguration(),
    ])
    
    if (!post) {
      notFound()
    }

    // Generate breadcrumbs
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: post.category.name, url: `/blog/category/${post.category.slug}` },
      { name: post.title, url: `/blog/${post.slug}` },
    ]

    return (
      <>
        {/* Structured Data */}
        <ArticleSchema 
          article={post} 
          siteConfig={siteConfig}
          url={`/blog/${post.slug}`}
        />
        <BreadcrumbsSchema items={breadcrumbs} />
        
        <article className="container py-12 md:py-24">
          <div className="mx-auto max-w-4xl">
            {/* Post Header */}
            <BlogPostHeader
              title={post.title}
              excerpt={post.excerpt}
              featuredImage={post.featuredImage}
              category={post.category}
              tags={post.tags}
            />

            {/* Post Meta */}
            <BlogPostMeta
              author={post.author}
              publishedAt={post.publishedAt!}
              readingTime={post.readingTime}
            />

            {/* Share Buttons */}
            <div className="mb-8 flex justify-center">
              <ShareButtons
                url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`}
                title={post.title}
                description={post.excerpt}
              />
            </div>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ContentRenderer content={post.content} />
            </div>

            {/* Author Bio */}
            <div className="mt-12 rounded-lg border border-border bg-muted/50 p-6">
              <div className="flex items-start space-x-4">
                {post.author.avatar && (
                  <img
                    src={post.author.avatar.url}
                    alt={post.author.avatar.alt || post.author.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold">{post.author.name}</h3>
                  {post.author.bio && (
                    <div className="prose prose-sm text-muted-foreground dark:prose-invert">
                      <ContentRenderer content={post.author.bio} />
                    </div>
                  )}
                  {post.author.socialLinks && post.author.socialLinks.length > 0 && (
                    <div className="mt-3 flex space-x-2">
                      {post.author.socialLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <div className="mt-16">
                <RelatedPosts posts={post.relatedPosts} />
              </div>
            )}
          </div>
        </article>
      </>
    )
  } catch (error) {
    console.error('Error rendering blog post:', error)
    notFound()
  }
}