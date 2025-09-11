/**
 * Enhanced Dynamic Robots.txt Generation - Advanced SEO robots configuration
 */

import type { MetadataRoute } from 'next'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const isProduction = process.env.NODE_ENV === 'production'
  const allowIndexing = process.env.ALLOW_INDEXING !== 'false'
  
  // Development/staging environment - block all crawlers
  if (!isProduction || !allowIndexing) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    }
  }

  // Production environment - allow crawling with restrictions
  return {
    rules: [
      // General crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // API routes
          '/api/',
          
          // Admin and authentication
          '/admin/',
          '/auth/',
          '/login/',
          '/register/',
          '/dashboard/',
          
          // System and build files
          '/_next/',
          '/_vercel/',
          
          // Private and draft content
          '/private/',
          '/draft/',
          '/preview/',
          '/temp/',
          
          // User-generated content that shouldn't be indexed
          '/user/',
          '/account/',
          '/settings/',
          
          // Search and filter pages (to avoid duplicate content)
          '/search?',
          '/blog?',
          '*?page=*',
          '*?sort=*',
          '*?filter=*',
          
          // File types that shouldn't be crawled
          '*.json$',
          '*.xml$',
          '*.txt$',
          '*.log$',
          
          // Development and testing
          '/test/',
          '/dev/',
          '/__test__/',
        ],
        crawlDelay: 1, // 1 second delay between requests
      },
      
      // Specific rules for Google
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/auth/',
          '/private/',
          '/draft/',
          '/preview/',
          '/_next/',
          '/search?',
          '*?page=*',
        ],
        crawlDelay: 0, // Google can crawl faster
      },
      
      // Rules for Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/draft/',
          '/preview/',
        ],
        crawlDelay: 2, // Bing gets slower crawl rate
      },
      
      // Social media crawlers (for link previews)
      {
        userAgent: ['facebookexternalhit', 'Twitterbot', 'LinkedInBot'],
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
        ],
      },
      
      // Block aggressive crawlers
      {
        userAgent: [
          'MJ12bot',
          'AhrefsBot',
          'SemrushBot',
          'MegaIndex.ru',
          'DotBot',
        ],
        disallow: '/',
      },
      
      // Block AI training crawlers (optional)
      {
        userAgent: [
          'CCBot',
          'ChatGPT-User',
          'GPTBot',
          'Google-Extended',
          'anthropic-ai',
        ],
        disallow: '/',
      },
    ],
    
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      // Add additional sitemaps if you have them
      // `${baseUrl}/sitemap-images.xml`,
      // `${baseUrl}/sitemap-news.xml`,
    ],
    
    host: baseUrl,
  }
}