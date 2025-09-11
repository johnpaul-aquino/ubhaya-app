/**
 * Strapi CMS Client Implementation
 */

import { BaseCMSClient } from '../base-client'
import type {
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
  CMSProvider,
} from '../../types/cms'

export class StrapiClient extends BaseCMSClient {
  public readonly provider: CMSProvider = 'strapi'
  private apiUrl: string
  private apiKey?: string
  
  constructor(config: any) {
    super(config)
    this.apiUrl = config.apiUrl
    this.apiKey = config.apiKey
  }
  
  private async fetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.apiUrl}/api${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    })
    
    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }
  
  async getPage(slug: string): Promise<Page | null> {
    try {
      const response = await this.fetch(`/pages?filters[slug][$eq]=${slug}&populate=*`)
      const item = response.data?.[0]
      
      if (!item) return null
      
      return this.transformStrapiPage(item)
    } catch (error) {
      throw this.handleError(error, 'getPage')
    }
  }
  
  async getPages(query?: ContentQuery): Promise<ContentCollection<Page>> {
    try {
      const { limit, offset } = this.transformContentQuery(query)
      const response = await this.fetch(`/pages?pagination[page]=${Math.floor(offset / limit) + 1}&pagination[pageSize]=${limit}&populate=*`)
      
      const items = response.data?.map(this.transformStrapiPage.bind(this)) || []
      const total = response.meta?.pagination?.total || 0
      
      return {
        items,
        total,
        meta: this.createPaginationMeta(total, Math.floor(offset / limit) + 1, limit),
      }
    } catch (error) {
      throw this.handleError(error, 'getPages')
    }
  }
  
  async getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
      const response = await this.fetch(`/blog-posts?filters[slug][$eq]=${slug}&populate=*`)
      const item = response.data?.[0]
      
      if (!item) return null
      
      return this.transformStrapiBlogPost(item)
    } catch (error) {
      throw this.handleError(error, 'getBlogPost')
    }
  }
  
  async getBlogPosts(query?: ContentQuery): Promise<ContentCollection<BlogPost>> {
    try {
      const { limit, offset, filters } = this.transformContentQuery(query)
      let endpoint = `/blog-posts?pagination[page]=${Math.floor(offset / limit) + 1}&pagination[pageSize]=${limit}&populate=*`
      
      if (filters?.category) {
        endpoint += `&filters[category][slug][$eq]=${filters.category}`
      }
      
      const response = await this.fetch(endpoint)
      
      const items = response.data?.map(this.transformStrapiBlogPost.bind(this)) || []
      const total = response.meta?.pagination?.total || 0
      
      return {
        items,
        total,
        meta: this.createPaginationMeta(total, Math.floor(offset / limit) + 1, limit),
      }
    } catch (error) {
      throw this.handleError(error, 'getBlogPosts')
    }
  }
  
  async getAuthor(slug: string): Promise<Author | null> {
    return null
  }
  
  async getAuthors(query?: ContentQuery): Promise<ContentCollection<Author>> {
    return { items: [], total: 0, meta: this.createPaginationMeta(0, 1, 10) }
  }
  
  async getCategory(slug: string): Promise<Category | null> {
    return null
  }
  
  async getCategories(query?: ContentQuery): Promise<ContentCollection<Category>> {
    return { items: [], total: 0, meta: this.createPaginationMeta(0, 1, 10) }
  }
  
  async getTags(query?: ContentQuery): Promise<ContentCollection<Tag>> {
    return { items: [], total: 0, meta: this.createPaginationMeta(0, 1, 10) }
  }
  
  async getNavigation(identifier: string): Promise<Navigation | null> {
    return null
  }
  
  async getSiteConfig(): Promise<SiteConfig | null> {
    return null
  }
  
  async search(query: string, type?: string): Promise<ContentCollection<BaseContentItem>> {
    return { items: [], total: 0, meta: this.createPaginationMeta(0, 1, 10) }
  }
  
  // Transformation methods
  private transformStrapiPage(item: any): Page {
    const attributes = item.attributes
    
    return {
      id: item.id.toString(),
      slug: attributes.slug || '',
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
      publishedAt: attributes.publishedAt,
      status: attributes.publishedAt ? 'published' : 'draft',
      title: attributes.title || '',
      content: this.transformRichText(attributes.content),
      excerpt: attributes.excerpt,
      featuredImage: this.transformMediaAsset(attributes.featuredImage?.data),
      seo: this.transformSEOMetadata(attributes.seo),
      template: attributes.template,
    }
  }
  
  private transformStrapiBlogPost(item: any): BlogPost {
    const attributes = item.attributes
    
    return {
      id: item.id.toString(),
      slug: attributes.slug || '',
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
      publishedAt: attributes.publishedAt,
      status: attributes.publishedAt ? 'published' : 'draft',
      title: attributes.title || '',
      content: this.transformRichText(attributes.content) || { raw: null },
      excerpt: attributes.excerpt || '',
      featuredImage: this.transformMediaAsset(attributes.featuredImage?.data),
      author: this.transformStrapiAuthor(attributes.author?.data),
      category: this.transformStrapiCategory(attributes.category?.data),
      tags: (attributes.tags?.data || []).map(this.transformStrapiTag.bind(this)),
      readingTime: attributes.readingTime,
      seo: this.transformSEOMetadata(attributes.seo),
    }
  }
  
  private transformStrapiAuthor(item: any): Author {
    if (!item) {
      return {
        id: '',
        slug: '',
        createdAt: '',
        updatedAt: '',
        status: 'published',
        name: 'Unknown Author',
      }
    }
    
    const attributes = item.attributes
    
    return {
      id: item.id.toString(),
      slug: attributes.slug || '',
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
      status: 'published',
      name: attributes.name || '',
      bio: this.transformRichText(attributes.bio),
      avatar: this.transformMediaAsset(attributes.avatar?.data),
      email: attributes.email,
      website: attributes.website,
      socialLinks: attributes.socialLinks || [],
    }
  }
  
  private transformStrapiCategory(item: any): Category {
    if (!item) {
      return {
        id: '',
        slug: '',
        createdAt: '',
        updatedAt: '',
        status: 'published',
        name: 'Uncategorized',
      }
    }
    
    const attributes = item.attributes
    
    return {
      id: item.id.toString(),
      slug: attributes.slug || '',
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
      status: 'published',
      name: attributes.name || '',
      description: attributes.description,
      color: attributes.color,
    }
  }
  
  private transformStrapiTag(item: any): Tag {
    const attributes = item.attributes
    
    return {
      id: item.id.toString(),
      slug: attributes.slug || '',
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
      status: 'published',
      name: attributes.name || '',
      description: attributes.description,
    }
  }
}