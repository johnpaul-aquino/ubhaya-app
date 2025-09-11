/**
 * SEO Hooks - React hooks for SEO functionality
 */

import { useMemo } from 'react'
import { type SEOMetadata, type BlogPost, type Page, type SiteConfig } from '@/lib/types/cms'
import { seoGenerators, seoValidation, readingTimeUtils } from './utils'

/**
 * Hook for generating and validating SEO metadata
 */
export function useSEO(
  content: BlogPost | Page,
  siteConfig?: SiteConfig,
  options?: {
    validateSEO?: boolean
    calculateReadingTime?: boolean
  }
) {
  return useMemo(() => {
    const { validateSEO: shouldValidate = true, calculateReadingTime = true } = options || {}
    
    // Generate SEO metadata
    const seoData = 'excerpt' in content && 'author' in content
      ? seoGenerators.generateBlogPostSEO(content as BlogPost, siteConfig)
      : seoGenerators.generatePageSEO(content as Page, siteConfig)
    
    // Merge with existing SEO data, prioritizing manual overrides
    const finalSEO: SEOMetadata = {
      ...seoData,
      ...content.seo, // User-defined SEO takes precedence
    }
    
    // Validate SEO if requested
    const validation = shouldValidate 
      ? seoValidation.validateSEO(finalSEO, content.content?.plainText)
      : null
    
    // Calculate reading time for blog posts
    const readingTime = calculateReadingTime && 'content' in content && content.content?.plainText
      ? readingTimeUtils.calculate(content.content.plainText)
      : null
    
    return {
      seo: finalSEO,
      validation,
      readingTime,
      readingTimeFormatted: readingTime ? readingTimeUtils.format(readingTime) : null,
    }
  }, [content, siteConfig, options])
}

/**
 * Hook for SEO performance optimizations
 */
export function useSEOPerformance(
  criticalAssets: string[] = [],
  prefetchDomains: string[] = []
) {
  return useMemo(() => {
    const preloadHints = criticalAssets.map(asset => {
      const extension = asset.split('.').pop()?.toLowerCase()
      
      switch (extension) {
        case 'css':
          return { rel: 'preload', href: asset, as: 'style' }
        case 'js':
        case 'mjs':
          return { rel: 'preload', href: asset, as: 'script' }
        case 'woff':
        case 'woff2':
          return { rel: 'preload', href: asset, as: 'font', crossOrigin: 'anonymous' }
        default:
          return { rel: 'preload', href: asset, as: 'fetch', crossOrigin: 'anonymous' }
      }
    })
    
    const dnsPrefetchHints = prefetchDomains
      .filter(domain => {
        try {
          const url = new URL(domain.startsWith('http') ? domain : `https://${domain}`)
          return url.hostname !== 'localhost'
        } catch {
          return false
        }
      })
      .map(domain => ({
        rel: 'dns-prefetch',
        href: domain.startsWith('http') ? new URL(domain).origin : `https://${domain}`,
      }))
    
    return {
      preloadHints,
      dnsPrefetchHints,
    }
  }, [criticalAssets, prefetchDomains])
}