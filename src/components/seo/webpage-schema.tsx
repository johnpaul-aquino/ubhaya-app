/**
 * WebPage Schema Component - Structured data for general pages
 */

import { JsonLd } from './json-ld'
import { type Page, type SiteConfig } from '@/lib/types/cms'

interface WebPageSchemaProps {
  page: Page
  siteConfig?: SiteConfig | null
  url?: string
  breadcrumbs?: Array<{ name: string; url: string }>
}

export function WebPageSchema({ page, siteConfig, url, breadcrumbs }: WebPageSchemaProps) {
  const baseUrl = siteConfig?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const pageUrl = url ? `${baseUrl}${url}` : `${baseUrl}/${page.slug}`
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': pageUrl,
    name: page.title,
    description: page.excerpt || page.seo.description,
    url: pageUrl,
    datePublished: page.publishedAt || page.createdAt,
    dateModified: page.updatedAt,
    inLanguage: 'en-US',
    ...(page.featuredImage && {
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: page.featuredImage.url.startsWith('http') ? page.featuredImage.url : `${baseUrl}${page.featuredImage.url}`,
        width: page.featuredImage.width,
        height: page.featuredImage.height,
        alt: page.featuredImage.alt,
      },
    }),
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig?.siteName || 'Website',
      url: baseUrl,
      publisher: {
        '@type': 'Organization',
        name: siteConfig?.siteName || 'Website',
        ...(siteConfig?.logo && {
          logo: {
            '@type': 'ImageObject',
            url: siteConfig.logo.url.startsWith('http') ? siteConfig.logo.url : `${baseUrl}${siteConfig.logo.url}`,
          },
        }),
      },
    },
    ...(breadcrumbs && breadcrumbs.length > 0 && {
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
        })),
      },
    }),
    ...(page.content?.plainText && {
      mainContentOfPage: {
        '@type': 'WebPageElement',
        text: page.content.plainText,
      },
    }),
  }

  return <JsonLd data={schema} />
}