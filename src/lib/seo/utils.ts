/**
 * SEO Utilities - Helper functions for SEO optimization
 */

import { type SEOMetadata, type BlogPost, type Page, type SiteConfig } from '@/lib/types/cms'

/**
 * SEO Constants
 */
export const SEO_CONSTANTS = {
  TITLE_MAX_LENGTH: 60,
  TITLE_MIN_LENGTH: 30,
  DESCRIPTION_MAX_LENGTH: 160,
  DESCRIPTION_MIN_LENGTH: 120,
  EXCERPT_MAX_LENGTH: 300,
  KEYWORDS_MAX_COUNT: 10,
  WORDS_PER_MINUTE: 200,
} as const

/**
 * Text processing utilities
 */
export const textUtils = {
  /**
   * Strips HTML tags from text
   */
  stripHtml: (html: string): string => {
    return html.replace(/<[^>]*>/g, '').trim()
  },

  /**
   * Truncates text to specified length with ellipsis
   */
  truncate: (text: string, maxLength: number, suffix: string = '...'): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - suffix.length).trim() + suffix
  },

  /**
   * Capitalizes first letter of each word
   */
  titleCase: (text: string): string => {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  },

  /**
   * Converts text to sentence case
   */
  sentenceCase: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  },

  /**
   * Counts words in text
   */
  wordCount: (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  },

  /**
   * Extracts excerpt from content
   */
  extractExcerpt: (content: string, maxLength: number = SEO_CONSTANTS.EXCERPT_MAX_LENGTH): string => {
    const cleanText = textUtils.stripHtml(content)
    return textUtils.truncate(cleanText, maxLength)
  },
}

/**
 * Keyword analysis utilities
 */
export const keywordUtils = {
  /**
   * Calculates keyword density
   */
  calculateDensity: (content: string, keyword: string): number => {
    const cleanContent = textUtils.stripHtml(content.toLowerCase())
    const words = cleanContent.split(/\s+/)
    const keywordWords = keyword.toLowerCase().split(/\s+/)
    
    let matches = 0
    for (let i = 0; i <= words.length - keywordWords.length; i++) {
      const phrase = words.slice(i, i + keywordWords.length).join(' ')
      if (phrase === keyword.toLowerCase()) {
        matches++
      }
    }
    
    return words.length > 0 ? (matches / words.length) * 100 : 0
  },

  /**
   * Extracts keywords from text using simple frequency analysis
   */
  extractKeywords: (content: string, maxKeywords: number = SEO_CONSTANTS.KEYWORDS_MAX_COUNT): string[] => {
    const cleanText = textUtils.stripHtml(content.toLowerCase())
    const words = cleanText
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !commonStopWords.includes(word))

    const frequency: Record<string, number> = {}
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1
    })

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word)
  },

  /**
   * Validates keyword optimization
   */
  validateKeywordOptimization: (content: string, keyword: string): {
    isOptimized: boolean
    density: number
    recommendations: string[]
  } => {
    const density = keywordUtils.calculateDensity(content, keyword)
    const recommendations: string[] = []
    
    if (density === 0) {
      recommendations.push('Keyword not found in content')
    } else if (density < 0.5) {
      recommendations.push('Consider increasing keyword usage (current density is low)')
    } else if (density > 3) {
      recommendations.push('Reduce keyword usage to avoid over-optimization')
    }
    
    const isOptimized = density >= 0.5 && density <= 3
    
    return {
      isOptimized,
      density: Math.round(density * 100) / 100,
      recommendations,
    }
  },
}

/**
 * Common English stop words
 */
const commonStopWords = [
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
  'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
]

/**
 * URL utilities
 */
export const urlUtils = {
  /**
   * Generates SEO-friendly slug
   */
  generateSlug: (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  /**
   * Validates slug format
   */
  validateSlug: (slug: string): { isValid: boolean; message?: string } => {
    if (slug.length === 0) return { isValid: false, message: 'Slug is required' }
    if (slug.length > 100) return { isValid: false, message: 'Slug should be under 100 characters' }
    if (!/^[a-z0-9-]+$/.test(slug)) return { isValid: false, message: 'Slug should only contain lowercase letters, numbers, and hyphens' }
    if (slug.startsWith('-') || slug.endsWith('-')) return { isValid: false, message: 'Slug should not start or end with hyphens' }
    if (slug.includes('--')) return { isValid: false, message: 'Slug should not contain consecutive hyphens' }
    return { isValid: true }
  },

  /**
   * Builds canonical URL
   */
  buildCanonicalUrl: (baseUrl: string, path: string): string => {
    const cleanBase = baseUrl.replace(/\/$/, '')
    const cleanPath = path.replace(/^\//, '')
    return `${cleanBase}/${cleanPath}`
  },
}

/**
 * Reading time calculation
 */
export const readingTimeUtils = {
  /**
   * Calculates reading time in minutes
   */
  calculate: (content: string, wordsPerMinute: number = SEO_CONSTANTS.WORDS_PER_MINUTE): number => {
    const wordCount = textUtils.wordCount(textUtils.stripHtml(content))
    return Math.ceil(wordCount / wordsPerMinute)
  },

  /**
   * Formats reading time as human-readable string
   */
  format: (minutes: number): string => {
    if (minutes < 1) return 'Less than 1 minute'
    if (minutes === 1) return '1 minute'
    return `${minutes} minutes`
  },
}

/**
 * SEO validation utilities
 */
export const seoValidation = {
  /**
   * Validates complete SEO metadata
   */
  validateSEO: (seo: SEOMetadata, content?: string): {
    isValid: boolean
    errors: string[]
    warnings: string[]
    score: number
  } => {
    const errors: string[] = []
    const warnings: string[] = []
    let score = 100

    // Title validation
    if (!seo.title) {
      errors.push('Title is required')
      score -= 20
    } else {
      if (seo.title.length < SEO_CONSTANTS.TITLE_MIN_LENGTH) {
        warnings.push(`Title is too short (${seo.title.length}/${SEO_CONSTANTS.TITLE_MIN_LENGTH} minimum)`)
        score -= 10
      }
      if (seo.title.length > SEO_CONSTANTS.TITLE_MAX_LENGTH) {
        warnings.push(`Title is too long (${seo.title.length}/${SEO_CONSTANTS.TITLE_MAX_LENGTH} maximum)`)
        score -= 10
      }
    }

    // Description validation
    if (!seo.description) {
      errors.push('Description is required')
      score -= 20
    } else {
      if (seo.description.length < SEO_CONSTANTS.DESCRIPTION_MIN_LENGTH) {
        warnings.push(`Description is too short (${seo.description.length}/${SEO_CONSTANTS.DESCRIPTION_MIN_LENGTH} minimum)`)
        score -= 10
      }
      if (seo.description.length > SEO_CONSTANTS.DESCRIPTION_MAX_LENGTH) {
        warnings.push(`Description is too long (${seo.description.length}/${SEO_CONSTANTS.DESCRIPTION_MAX_LENGTH} maximum)`)
        score -= 10
      }
    }

    // Open Graph validation
    if (!seo.ogTitle && !seo.title) {
      warnings.push('Open Graph title is missing')
      score -= 5
    }
    if (!seo.ogDescription && !seo.description) {
      warnings.push('Open Graph description is missing')
      score -= 5
    }
    if (!seo.ogImage) {
      warnings.push('Open Graph image is missing')
      score -= 10
    }

    // Content validation
    if (content) {
      const wordCount = textUtils.wordCount(textUtils.stripHtml(content))
      if (wordCount < 300) {
        warnings.push(`Content is too short (${wordCount} words, 300+ recommended)`)
        score -= 15
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: Math.max(0, score),
    }
  },
}

/**
 * SEO data generators
 */
export const seoGenerators = {
  /**
   * Generates SEO metadata for blog post
   */
  generateBlogPostSEO: (post: BlogPost, siteConfig?: SiteConfig): SEOMetadata => {
    const baseTitle = post.title
    const siteTitle = siteConfig?.siteName
    const title = siteTitle ? `${baseTitle} | ${siteTitle}` : baseTitle

    return {
      title: textUtils.truncate(title, SEO_CONSTANTS.TITLE_MAX_LENGTH),
      description: textUtils.truncate(post.excerpt, SEO_CONSTANTS.DESCRIPTION_MAX_LENGTH),
      keywords: post.tags?.map(tag => tag.name) || [],
      ogTitle: textUtils.truncate(baseTitle, SEO_CONSTANTS.TITLE_MAX_LENGTH),
      ogDescription: textUtils.truncate(post.excerpt, SEO_CONSTANTS.DESCRIPTION_MAX_LENGTH),
      ogImage: post.featuredImage,
      twitterCard: 'summary_large_image',
      twitterImage: post.featuredImage,
      canonicalUrl: `/blog/${post.slug}`,
      noindex: post.status !== 'published',
      nofollow: post.status !== 'published',
    }
  },

  /**
   * Generates SEO metadata for page
   */
  generatePageSEO: (page: Page, siteConfig?: SiteConfig): SEOMetadata => {
    const baseTitle = page.title
    const siteTitle = siteConfig?.siteName
    const title = page.slug === 'home' || page.slug === 'index' 
      ? (siteTitle || baseTitle)
      : (siteTitle ? `${baseTitle} | ${siteTitle}` : baseTitle)

    const description = page.excerpt || 
      (page.content?.plainText ? textUtils.extractExcerpt(page.content.plainText) : '')

    return {
      title: textUtils.truncate(title, SEO_CONSTANTS.TITLE_MAX_LENGTH),
      description: textUtils.truncate(description, SEO_CONSTANTS.DESCRIPTION_MAX_LENGTH),
      keywords: page.content?.plainText ? keywordUtils.extractKeywords(page.content.plainText) : [],
      ogTitle: textUtils.truncate(baseTitle, SEO_CONSTANTS.TITLE_MAX_LENGTH),
      ogDescription: textUtils.truncate(description, SEO_CONSTANTS.DESCRIPTION_MAX_LENGTH),
      ogImage: page.featuredImage,
      twitterCard: 'summary_large_image',
      twitterImage: page.featuredImage,
      canonicalUrl: page.slug === 'home' || page.slug === 'index' ? '/' : `/${page.slug}`,
      noindex: page.status !== 'published',
      nofollow: page.status !== 'published',
    }
  },
}

/**
 * Performance optimization utilities
 */
export const performanceUtils = {
  /**
   * Generates preload hints for critical resources
   */
  generatePreloadHints: (assets: string[]): Array<{ href: string; as: string; crossOrigin?: string }> => {
    return assets.map(asset => {
      const extension = asset.split('.').pop()?.toLowerCase()
      
      switch (extension) {
        case 'css':
          return { href: asset, as: 'style' }
        case 'js':
        case 'mjs':
          return { href: asset, as: 'script' }
        case 'woff':
        case 'woff2':
          return { href: asset, as: 'font', crossOrigin: 'anonymous' }
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'webp':
        case 'avif':
          return { href: asset, as: 'image' }
        default:
          return { href: asset, as: 'fetch', crossOrigin: 'anonymous' }
      }
    })
  },

  /**
   * Generates DNS prefetch hints
   */
  generateDNSPrefetchHints: (domains: string[]): string[] => {
    return domains.filter(domain => {
      try {
        const url = new URL(domain.startsWith('http') ? domain : `https://${domain}`)
        return url.hostname !== 'localhost'
      } catch {
        return false
      }
    }).map(domain => {
      const url = new URL(domain.startsWith('http') ? domain : `https://${domain}`)
      return url.origin
    })
  },
}