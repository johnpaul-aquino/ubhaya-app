/**
 * Article Schema Component - Structured data for blog posts and articles
 */

import { JsonLd } from './json-ld'
import { type BlogPost, type SiteConfig } from '@/lib/types/cms'

interface ArticleSchemaProps {
  article: BlogPost
  siteConfig?: SiteConfig | null
  url?: string
}

export function ArticleSchema({ article, siteConfig, url }: ArticleSchemaProps) {
  const baseUrl = siteConfig?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const articleUrl = url ? `${baseUrl}${url}` : `${baseUrl}/blog/${article.slug}`
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': articleUrl,
    headline: article.title,
    description: article.excerpt,
    articleBody: article.content.plainText || article.content.html,
    url: articleUrl,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    ...(article.featuredImage && {
      image: {
        '@type': 'ImageObject',
        url: article.featuredImage.url.startsWith('http') ? article.featuredImage.url : `${baseUrl}${article.featuredImage.url}`,
        width: article.featuredImage.width,
        height: article.featuredImage.height,
        alt: article.featuredImage.alt,
      },
    }),
    author: {
      '@type': 'Person',
      name: article.author.name,
      ...(article.author.bio && { description: article.author.bio.plainText }),
      ...(article.author.avatar && {
        image: {
          '@type': 'ImageObject',
          url: article.author.avatar.url.startsWith('http') ? article.author.avatar.url : `${baseUrl}${article.author.avatar.url}`,
          alt: article.author.avatar.alt || article.author.name,
        },
      }),
      ...(article.author.website && { url: article.author.website }),
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig?.siteName || 'Website',
      ...(siteConfig?.logo && {
        logo: {
          '@type': 'ImageObject',
          url: siteConfig.logo.url.startsWith('http') ? siteConfig.logo.url : `${baseUrl}${siteConfig.logo.url}`,
          width: siteConfig.logo.width || 600,
          height: siteConfig.logo.height || 60,
        },
      }),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    ...(article.category && {
      articleSection: article.category.name,
    }),
    ...(article.tags && article.tags.length > 0 && {
      keywords: article.tags.map(tag => tag.name),
    }),
    ...(article.readingTime && {
      timeRequired: `PT${article.readingTime}M`,
    }),
    inLanguage: 'en-US',
  }

  return <JsonLd data={schema} />
}