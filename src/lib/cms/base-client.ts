/**
 * Base CMS Client - Abstract class with common functionality
 */

import type {
  CMSClient,
  CMSProvider,
  Page,
  BlogPost,
  Author,
  Category,
  Tag,
  Navigation,
  SiteConfig,
  ContentQuery,
  ContentCollection,
  BaseContentItem,
  WebhookPayload,
  CacheConfig,
} from '../types/cms'

export abstract class BaseCMSClient implements CMSClient {
  public abstract readonly provider: CMSProvider
  protected config: Record<string, any>
  private cache: Map<string, { data: any; expires: number; tags: string[] }> = new Map()
  
  constructor(config: Record<string, any>) {
    this.config = config
  }
  
  // Abstract methods that must be implemented by providers
  abstract getPage(slug: string): Promise<Page | null>
  abstract getPages(query?: ContentQuery): Promise<ContentCollection<Page>>
  abstract getBlogPost(slug: string): Promise<BlogPost | null>
  abstract getBlogPosts(query?: ContentQuery): Promise<ContentCollection<BlogPost>>
  abstract getAuthor(slug: string): Promise<Author | null>
  abstract getAuthors(query?: ContentQuery): Promise<ContentCollection<Author>>
  abstract getCategory(slug: string): Promise<Category | null>
  abstract getCategories(query?: ContentQuery): Promise<ContentCollection<Category>>
  abstract getTags(query?: ContentQuery): Promise<ContentCollection<Tag>>
  abstract getNavigation(identifier: string): Promise<Navigation | null>
  abstract getSiteConfig(): Promise<SiteConfig | null>
  abstract search(query: string, type?: string): Promise<ContentCollection<BaseContentItem>>
  
  /**
   * Cache management
   */
  protected getCacheKey(method: string, params: any = {}): string {
    const paramString = JSON.stringify(params)
    return `${this.provider}:${method}:${Buffer.from(paramString).toString('base64')}`
  }
  
  protected async getFromCache<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() > cached.expires) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }
  
  protected setCache(key: string, data: any, config: CacheConfig): void {
    const expires = Date.now() + (config.ttl * 1000)
    this.cache.set(key, {
      data,
      expires,
      tags: config.tags,
    })
  }
  
  protected invalidateCacheByTags(tags: string[]): void {
    for (const [key, cached] of this.cache.entries()) {
      if (cached.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key)
      }
    }
  }
  
  public async revalidateCache(tags?: string[]): Promise<void> {
    if (tags) {
      this.invalidateCacheByTags(tags)
    } else {
      this.cache.clear()
    }
  }
  
  /**
   * Webhook handling - can be overridden by providers
   */
  public async handleWebhook(payload: WebhookPayload): Promise<void> {
    const tags = [payload.model, `${payload.model}:${payload.entry.id}`]
    
    switch (payload.event) {
      case 'created':
      case 'updated':
      case 'published':
        // Invalidate list caches for the model
        this.invalidateCacheByTags([payload.model])
        break
      case 'deleted':
      case 'unpublished':
        // Invalidate all caches for the specific item and lists
        this.invalidateCacheByTags(tags)
        break
    }
  }
  
  /**
   * Utility methods for data transformation
   */
  protected transformContentQuery(query: ContentQuery = {}): any {
    // Default implementation - override in providers as needed
    return {
      limit: query.limit || 10,
      offset: query.offset || 0,
      orderBy: query.orderBy || 'createdAt',
      orderDirection: query.orderDirection || 'desc',
      filters: query.filters || {},
      include: query.include || [],
      search: query.search,
    }
  }
  
  protected createPaginationMeta(
    total: number,
    page: number,
    limit: number
  ): import('../types/cms').PaginationMeta {
    const totalPages = Math.ceil(total / limit)
    
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  }
  
  /**
   * Error handling
   */
  protected handleError(error: any, operation: string): Error {
    console.error(`CMS Error [${this.provider}] - ${operation}:`, error)
    
    if (error.response?.status === 404) {
      return new Error(`Content not found`)
    }
    
    if (error.response?.status === 401) {
      return new Error(`Authentication failed`)
    }
    
    if (error.response?.status === 403) {
      return new Error(`Access forbidden`)
    }
    
    if (error.response?.status >= 500) {
      return new Error(`CMS server error`)
    }
    
    return new Error(`CMS operation failed: ${operation}`)
  }
  
  /**
   * Common field transformations
   */
  protected transformMediaAsset(asset: any): import('../types/cms').MediaAsset | undefined {
    if (!asset) return undefined
    
    // This is a generic implementation - override in providers
    return {
      id: asset.id || asset._id || asset.sys?.id,
      url: asset.url || asset.fields?.file?.url,
      alt: asset.alt || asset.fields?.title,
      title: asset.title || asset.fields?.title,
      description: asset.description || asset.fields?.description,
      width: asset.width || asset.fields?.file?.details?.image?.width,
      height: asset.height || asset.fields?.file?.details?.image?.height,
      size: asset.size || asset.fields?.file?.details?.size,
      mimeType: asset.mimeType || asset.fields?.file?.contentType,
      filename: asset.filename || asset.fields?.file?.fileName,
    }
  }
  
  protected transformRichText(content: any): import('../types/cms').RichTextContent | undefined {
    if (!content) return undefined
    
    // This is a generic implementation - override in providers
    return {
      raw: content,
      html: content.html || content,
      plainText: content.text || (typeof content === 'string' ? content : ''),
      markdown: content.markdown,
    }
  }
  
  protected transformSEOMetadata(seo: any): import('../types/cms').SEOMetadata {
    return {
      title: seo?.title || '',
      description: seo?.description || '',
      keywords: seo?.keywords || [],
      ogImage: this.transformMediaAsset(seo?.ogImage),
      ogTitle: seo?.ogTitle,
      ogDescription: seo?.ogDescription,
      twitterCard: seo?.twitterCard || 'summary',
      twitterImage: this.transformMediaAsset(seo?.twitterImage),
      canonicalUrl: seo?.canonicalUrl,
      noindex: seo?.noindex || false,
      nofollow: seo?.nofollow || false,
    }
  }
}