/**
 * Enhanced Dynamic Sitemap Generation - SEO sitemap with advanced features
 */

import type { MetadataRoute } from 'next'
import { getAllPages, getAllBlogPosts, getAllCategories, getAllAuthors, getSiteConfiguration } from '@/lib/cms'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const siteConfig = await getSiteConfiguration()
    const baseUrl = siteConfig?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    const sitemap: MetadataRoute.Sitemap = []
    
    // Add homepage with highest priority
    sitemap.push({
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    })
    
    // Add main navigation pages
    const mainPages = [
      { path: '/blog', priority: 0.9, changeFreq: 'daily' as const },
      { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
      { path: '/contact', priority: 0.7, changeFreq: 'monthly' as const },
      { path: '/services', priority: 0.8, changeFreq: 'weekly' as const },
      { path: '/portfolio', priority: 0.8, changeFreq: 'weekly' as const },
    ]
    
    mainPages.forEach(page => {
      sitemap.push({
        url: `${baseUrl}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      })
    })
    
    // Add dynamic pages from CMS
    try {
      const pagesResult = await getAllPages({ 
        limit: 1000,
        filters: { status: 'published' }
      })
      
      pagesResult.items.forEach((page) => {
        // Skip homepage and system pages
        if (['home', 'index', '404', 'error'].includes(page.slug)) return
        
        // Calculate priority based on page depth and type
        const pathDepth = page.slug.split('/').length
        let priority = 0.7
        
        if (pathDepth === 1) priority = 0.8 // Top-level pages
        else if (pathDepth === 2) priority = 0.6 // Second-level pages
        else priority = 0.5 // Deeper pages
        
        // Higher priority for landing pages and key content
        if (page.template === 'landing' || page.customFields?.isImportant) {
          priority = Math.min(0.9, priority + 0.2)
        }
        
        sitemap.push({
          url: `${baseUrl}/${page.slug}`,
          lastModified: new Date(page.updatedAt),
          changeFrequency: getPageChangeFrequency(page.updatedAt),
          priority: Math.round(priority * 10) / 10,
        })
      })
    } catch (error) {
      console.error('Error fetching pages for sitemap:', error)
    }
    
    // Add blog posts with content-based prioritization
    try {
      const postsResult = await getAllBlogPosts({ 
        limit: 1000,
        filters: { status: 'published' },
        orderBy: 'updatedAt',
        orderDirection: 'desc'
      })
      
      postsResult.items.forEach((post, index) => {
        // Recent posts get higher priority
        let priority = 0.6
        if (index < 10) priority = 0.7 // Latest 10 posts
        if (index < 5) priority = 0.8  // Latest 5 posts
        
        // Featured or popular posts get higher priority
        if (post.customFields?.isFeatured || post.customFields?.isPopular) {
          priority = Math.min(0.9, priority + 0.1)
        }
        
        sitemap.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt),
          changeFrequency: getContentChangeFrequency(post.updatedAt),
          priority: Math.round(priority * 10) / 10,
        })
      })
    } catch (error) {
      console.error('Error fetching blog posts for sitemap:', error)
    }
    
    // Add category pages
    try {
      const categoriesResult = await getAllCategories({ limit: 100 })
      categoriesResult.items.forEach((category) => {
        sitemap.push({
          url: `${baseUrl}/blog/category/${category.slug}`,
          lastModified: new Date(category.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.5,
        })
      })
    } catch (error) {
      console.error('Error fetching categories for sitemap:', error)
    }
    
    // Add author pages
    try {
      const authorsResult = await getAllAuthors({ limit: 100 })
      authorsResult.items.forEach((author) => {
        sitemap.push({
          url: `${baseUrl}/blog/author/${author.slug}`,
          lastModified: new Date(author.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.4,
        })
      })
    } catch (error) {
      console.error('Error fetching authors for sitemap:', error)
    }
    
    // Add tag archive pages (if you have a tags listing)
    sitemap.push({
      url: `${baseUrl}/blog/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.4,
    })
    
    // Sort sitemap by priority (highest first) then by last modified
    sitemap.sort((a, b) => {
      if (b.priority !== a.priority) {
        return (b.priority || 0) - (a.priority || 0)
      }
      return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    })
    
    return sitemap
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return minimal sitemap on error
    return [
      {
        url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}

/**
 * Determines change frequency based on content age
 */
function getContentChangeFrequency(lastModified: string): 'daily' | 'weekly' | 'monthly' | 'yearly' {
  const now = new Date()
  const modified = new Date(lastModified)
  const daysDiff = Math.floor((now.getTime() - modified.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysDiff < 7) return 'daily'
  if (daysDiff < 30) return 'weekly'
  if (daysDiff < 365) return 'monthly'
  return 'yearly'
}

/**
 * Determines change frequency for pages based on age and type
 */
function getPageChangeFrequency(lastModified: string): 'daily' | 'weekly' | 'monthly' | 'yearly' {
  const now = new Date()
  const modified = new Date(lastModified)
  const daysDiff = Math.floor((now.getTime() - modified.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysDiff < 30) return 'weekly'
  if (daysDiff < 90) return 'monthly'
  return 'yearly'
}