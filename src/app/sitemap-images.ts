/**
 * Image Sitemap Generation - SEO sitemap for images
 * Helps search engines discover and index images
 */

import type { MetadataRoute } from 'next'
import { getAllBlogPosts, getAllPages, getSiteConfiguration } from '@/lib/cms'

export default async function sitemapImages(): Promise<MetadataRoute.Sitemap> {
  try {
    const siteConfig = await getSiteConfiguration()
    const baseUrl = siteConfig?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    const images: MetadataRoute.Sitemap = []
    
    // Add site logo and branding images
    if (siteConfig?.logo) {
      images.push({
        url: siteConfig.logo.url.startsWith('http') 
          ? siteConfig.logo.url 
          : `${baseUrl}${siteConfig.logo.url}`,
        lastModified: new Date(),
        priority: 1,
        changeFrequency: 'yearly',
      })
    }

    // Add featured images from blog posts
    try {
      const postsResult = await getAllBlogPosts({ 
        limit: 1000,
        filters: { status: 'published' }
      })
      
      postsResult.items.forEach((post) => {
        if (post.featuredImage) {
          const imageUrl = post.featuredImage.url.startsWith('http')
            ? post.featuredImage.url
            : `${baseUrl}${post.featuredImage.url}`
            
          images.push({
            url: imageUrl,
            lastModified: new Date(post.updatedAt),
            priority: 0.8,
            changeFrequency: 'monthly',
          })
        }
        
        // Add author avatars
        if (post.author.avatar) {
          const avatarUrl = post.author.avatar.url.startsWith('http')
            ? post.author.avatar.url
            : `${baseUrl}${post.author.avatar.url}`
            
          images.push({
            url: avatarUrl,
            lastModified: new Date(post.author.updatedAt),
            priority: 0.5,
            changeFrequency: 'yearly',
          })
        }
      })
    } catch (error) {
      console.error('Error fetching blog posts for image sitemap:', error)
    }
    
    // Add featured images from pages
    try {
      const pagesResult = await getAllPages({ 
        limit: 1000,
        filters: { status: 'published' }
      })
      
      pagesResult.items.forEach((page) => {
        if (page.featuredImage) {
          const imageUrl = page.featuredImage.url.startsWith('http')
            ? page.featuredImage.url
            : `${baseUrl}${page.featuredImage.url}`
            
          images.push({
            url: imageUrl,
            lastModified: new Date(page.updatedAt),
            priority: 0.7,
            changeFrequency: 'monthly',
          })
        }
      })
    } catch (error) {
      console.error('Error fetching pages for image sitemap:', error)
    }
    
    // Remove duplicates and sort by priority
    const uniqueImages = images.filter((image, index, self) => 
      index === self.findIndex((i) => i.url === image.url)
    )
    
    uniqueImages.sort((a, b) => (b.priority || 0) - (a.priority || 0))
    
    return uniqueImages
  } catch (error) {
    console.error('Error generating image sitemap:', error)
    return []
  }
}