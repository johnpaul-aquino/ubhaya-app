/**
 * CMS Configuration - Environment-based configuration for headless CMS
 */

import type { CMSConfig, CMSProvider } from '../types/cms'

/**
 * Get CMS configuration from environment variables
 */
export function getCMSConfigFromEnv(): CMSConfig {
  const provider = process.env.CMS_PROVIDER as CMSProvider
  
  if (!provider) {
    throw new Error('CMS_PROVIDER environment variable is required')
  }
  
  const baseConfig: CMSConfig = {
    provider,
    previewMode: process.env.NODE_ENV === 'development' || process.env.PREVIEW_MODE === 'true',
  }
  
  switch (provider) {
    case 'sanity':
      return {
        ...baseConfig,
        projectId: getRequiredEnvVar('SANITY_PROJECT_ID'),
        dataset: process.env.SANITY_DATASET || 'production',
        token: process.env.SANITY_API_TOKEN,
        apiVersion: process.env.SANITY_API_VERSION || '2023-12-01',
        useCdn: process.env.NODE_ENV === 'production',
      }
    
    case 'contentful':
      return {
        ...baseConfig,
        spaceId: getRequiredEnvVar('CONTENTFUL_SPACE_ID'),
        environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
        accessToken: getRequiredEnvVar('CONTENTFUL_ACCESS_TOKEN'),
        previewAccessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
        host: baseConfig.previewMode ? 'preview.contentful.com' : 'cdn.contentful.com',
      }
    
    case 'strapi':
      return {
        ...baseConfig,
        apiUrl: getRequiredEnvVar('STRAPI_API_URL'),
        apiKey: process.env.STRAPI_API_KEY,
      }
    
    default:
      throw new Error(`Unsupported CMS provider: ${provider}`)
  }
}

/**
 * Get required environment variable or throw error
 */
function getRequiredEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`)
  }
  return value
}

/**
 * ISR Configuration - Revalidation settings
 */
export const ISR_CONFIG = {
  // Default revalidation time in seconds
  defaultRevalidate: 300, // 5 minutes
  
  // Page-specific revalidation times
  pageRevalidation: {
    homepage: 300,      // 5 minutes
    blogListing: 300,   // 5 minutes  
    blogPost: 600,      // 10 minutes
    staticPage: 3600,   // 1 hour
  },
  
  // Cache tag patterns for selective revalidation
  cacheTags: {
    pages: 'pages',
    blogPosts: 'blog',
    authors: 'authors',
    categories: 'categories',
    tags: 'tags',
    navigation: 'navigation',
    siteConfig: 'siteConfig',
  },
  
  // Webhook revalidation settings
  webhook: {
    secret: process.env.WEBHOOK_SECRET,
    enabled: process.env.WEBHOOK_REVALIDATION === 'true',
  },
}

/**
 * Cache configuration for different content types
 */
export const CACHE_CONFIG = {
  // Browser cache headers
  browserCache: {
    static: 'public, max-age=31536000, immutable', // 1 year for static assets
    dynamic: 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600', // 5min cache, 1hr stale
  },
  
  // API cache settings
  apiCache: {
    defaultTTL: 300, // 5 minutes
    longTTL: 3600,   // 1 hour
    shortTTL: 60,    // 1 minute
  },
}

/**
 * Preview mode configuration
 */
export const PREVIEW_CONFIG = {
  enabled: process.env.PREVIEW_MODE === 'true',
  secret: process.env.PREVIEW_SECRET || 'default-preview-secret',
  exitPath: '/api/preview/exit',
  cookieName: '__next_preview_data',
}