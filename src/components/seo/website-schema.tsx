/**
 * Website Schema Component - Organization and website structured data
 */

import { JsonLd } from './json-ld'
import { type SiteConfig } from '@/lib/types/cms'

interface WebsiteSchemaProps {
  siteConfig: SiteConfig
}

export function WebsiteSchema({ siteConfig }: WebsiteSchemaProps) {
  const baseUrl = siteConfig.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.siteName,
    description: siteConfig.siteDescription,
    url: baseUrl,
    ...(siteConfig.logo && {
      logo: {
        '@type': 'ImageObject',
        url: siteConfig.logo.url.startsWith('http') ? siteConfig.logo.url : `${baseUrl}${siteConfig.logo.url}`,
        width: siteConfig.logo.width,
        height: siteConfig.logo.height,
      },
    }),
    ...(siteConfig.socialLinks && siteConfig.socialLinks.length > 0 && {
      sameAs: siteConfig.socialLinks.map(link => link.url),
    }),
    ...(siteConfig.contactInfo && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...(siteConfig.contactInfo.email && { email: siteConfig.contactInfo.email }),
        ...(siteConfig.contactInfo.phone && { telephone: siteConfig.contactInfo.phone }),
        contactType: 'customer service',
      },
    }),
    ...(siteConfig.contactInfo?.address && {
      address: {
        '@type': 'PostalAddress',
        ...(siteConfig.contactInfo.address.street && { streetAddress: siteConfig.contactInfo.address.street }),
        ...(siteConfig.contactInfo.address.city && { addressLocality: siteConfig.contactInfo.address.city }),
        ...(siteConfig.contactInfo.address.state && { addressRegion: siteConfig.contactInfo.address.state }),
        ...(siteConfig.contactInfo.address.postalCode && { postalCode: siteConfig.contactInfo.address.postalCode }),
        ...(siteConfig.contactInfo.address.country && { addressCountry: siteConfig.contactInfo.address.country }),
      },
    }),
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.siteName,
    description: siteConfig.siteDescription,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.siteName,
      ...(siteConfig.logo && {
        logo: {
          '@type': 'ImageObject',
          url: siteConfig.logo.url.startsWith('http') ? siteConfig.logo.url : `${baseUrl}${siteConfig.logo.url}`,
        },
      }),
    },
  }

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
    </>
  )
}