/**
 * Cache Revalidation Utilities - ISR cache management
 */

import { revalidateTag, revalidatePath } from 'next/cache'
import type { CMSProvider, WebhookPayload } from '../types/cms'
import { ISR_CONFIG } from '../config/cms-config'

/**
 * Revalidate content by tags
 */
export async function revalidateContentTags(tags: string[]): Promise<void> {
  tags.forEach(tag => {
    revalidateTag(tag)
  })
  
  console.log(`Revalidated cache tags: ${tags.join(', ')}`)
}

/**
 * Revalidate content by paths
 */
export async function revalidateContentPaths(paths: string[]): Promise<void> {
  paths.forEach(path => {
    revalidatePath(path)
  })
  
  console.log(`Revalidated paths: ${paths.join(', ')}`)
}

/**
 * Handle webhook-triggered revalidation
 */
export async function handleWebhookRevalidation(payload: WebhookPayload): Promise<void> {
  const { event, model, entry, provider } = payload
  
  console.log(`Processing webhook revalidation: ${provider} ${model} ${event}`, {
    entryId: entry.id,
    entrySlug: entry.slug
  })
  
  const tagsToRevalidate: string[] = []
  const pathsToRevalidate: string[] = []
  
  switch (model) {
    case 'page':
      tagsToRevalidate.push(
        ISR_CONFIG.cacheTags.pages,
        `page:${entry.id}`,
        `page:${entry.slug}`
      )
      pathsToRevalidate.push(`/${entry.slug}`)
      
      // If it's the homepage
      if (entry.slug === 'home' || entry.slug === 'index') {
        pathsToRevalidate.push('/')
      }
      break
      
    case 'blogPost':
      tagsToRevalidate.push(
        ISR_CONFIG.cacheTags.blogPosts,
        `blogPost:${entry.id}`,
        `blogPost:${entry.slug}`
      )
      pathsToRevalidate.push(`/blog/${entry.slug}`, '/blog')
      break
      
    case 'author':
      tagsToRevalidate.push(
        ISR_CONFIG.cacheTags.authors,
        ISR_CONFIG.cacheTags.blogPosts, // Authors affect blog posts
        `author:${entry.id}`,
        `author:${entry.slug}`
      )
      pathsToRevalidate.push('/blog') // Author changes affect blog listing
      break
      
    case 'category':
      tagsToRevalidate.push(
        ISR_CONFIG.cacheTags.categories,
        ISR_CONFIG.cacheTags.blogPosts, // Categories affect blog posts
        `category:${entry.id}`,
        `category:${entry.slug}`
      )
      pathsToRevalidate.push('/blog')
      break
      
    case 'tag':
      tagsToRevalidate.push(
        ISR_CONFIG.cacheTags.tags,
        ISR_CONFIG.cacheTags.blogPosts, // Tags affect blog posts
        `tag:${entry.id}`,
        `tag:${entry.slug}`
      )
      pathsToRevalidate.push('/blog')
      break
      
    case 'navigation':
      tagsToRevalidate.push(ISR_CONFIG.cacheTags.navigation)
      pathsToRevalidate.push('/') // Navigation affects all pages
      break
      
    case 'siteConfig':
      tagsToRevalidate.push(ISR_CONFIG.cacheTags.siteConfig)
      pathsToRevalidate.push('/') // Site config affects all pages
      break
      
    default:
      // Generic revalidation for unknown models
      tagsToRevalidate.push(model, `${model}:${entry.id}`)
  }
  
  // Handle different event types
  switch (event) {
    case 'deleted':
    case 'unpublished':
      // For deletions, we need broader revalidation
      if (model === 'blogPost') {
        tagsToRevalidate.push(ISR_CONFIG.cacheTags.blogPosts)
        pathsToRevalidate.push('/blog')
      } else if (model === 'page') {
        tagsToRevalidate.push(ISR_CONFIG.cacheTags.pages)
      }
      break
      
    case 'created':
    case 'updated':
    case 'published':
      // Standard revalidation handled above
      break
  }
  
  // Execute revalidation
  if (tagsToRevalidate.length > 0) {
    await revalidateContentTags(tagsToRevalidate)
  }
  
  if (pathsToRevalidate.length > 0) {
    await revalidateContentPaths(pathsToRevalidate)
  }
}

/**
 * Manual revalidation for admin/development use
 */
export async function manualRevalidation(options: {
  tags?: string[]
  paths?: string[]
  all?: boolean
}): Promise<{ success: boolean; message: string }> {
  try {
    if (options.all) {
      // Revalidate all common tags
      const allTags = Object.values(ISR_CONFIG.cacheTags)
      await revalidateContentTags(allTags)
      
      // Revalidate common paths
      await revalidateContentPaths(['/', '/blog'])
      
      return {
        success: true,
        message: 'Full cache revalidation completed'
      }
    }
    
    if (options.tags && options.tags.length > 0) {
      await revalidateContentTags(options.tags)
    }
    
    if (options.paths && options.paths.length > 0) {
      await revalidateContentPaths(options.paths)
    }
    
    return {
      success: true,
      message: 'Selective revalidation completed'
    }
  } catch (error) {
    console.error('Manual revalidation failed:', error)
    return {
      success: false,
      message: `Revalidation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Scheduled revalidation for content that changes frequently
 */
export async function scheduledRevalidation(): Promise<void> {
  // This could be called by a cron job or scheduled function
  const tagsToRevalidate = [
    ISR_CONFIG.cacheTags.blogPosts, // Blog content might change frequently
    ISR_CONFIG.cacheTags.pages,     // Pages might be updated
  ]
  
  await revalidateContentTags(tagsToRevalidate)
  
  console.log('Scheduled revalidation completed')
}

/**
 * Get cache status for debugging
 */
export function getCacheStatus() {
  return {
    config: ISR_CONFIG,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    revalidationEnabled: ISR_CONFIG.webhook.enabled,
  }
}