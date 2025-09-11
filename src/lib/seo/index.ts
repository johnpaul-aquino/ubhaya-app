/**
 * SEO Library Index - Export all SEO utilities and components
 */

// Utils
export * from './utils'

// Hook for SEO data generation
export { useSEO } from './hooks'

// SEO constants
export const SEO_CONFIG = {
  defaultTitle: 'Next.js Headless Website',
  defaultDescription: 'A modern headless website built with Next.js, TypeScript, and TailwindCSS',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@yourhandle',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  
  // Social media image dimensions
  ogImageDimensions: {
    width: 1200,
    height: 630,
  },
  twitterImageDimensions: {
    width: 1200,
    height: 600,
  },
  
  // Critical performance assets
  criticalAssets: [
    '/css/critical.css',
  ],
  
  // DNS prefetch domains
  prefetchDomains: [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
  ],
} as const