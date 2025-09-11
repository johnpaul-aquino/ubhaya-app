/**
 * Breadcrumbs Schema Component - Structured data for navigation
 */

import { JsonLd } from './json-ld'

export interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbsSchemaProps {
  items: BreadcrumbItem[]
  baseUrl?: string
}

export function BreadcrumbsSchema({ items, baseUrl }: BreadcrumbsSchemaProps) {
  const base = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${base}${item.url}`,
    })),
  }

  return <JsonLd data={breadcrumbSchema} />
}