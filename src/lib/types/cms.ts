/**
 * Core CMS Types - Provider agnostic content models
 */

// Base content item that all CMS entries extend
export interface BaseContentItem {
  id: string
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  status: 'draft' | 'published' | 'archived'
}

// SEO metadata for all content types
export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  ogImage?: MediaAsset
  ogTitle?: string
  ogDescription?: string
  twitterCard?: 'summary' | 'summary_large_image'
  twitterImage?: MediaAsset
  canonicalUrl?: string
  noindex?: boolean
  nofollow?: boolean
}

// Media assets (images, videos, documents)
export interface MediaAsset {
  id: string
  url: string
  alt?: string
  title?: string
  description?: string
  width?: number
  height?: number
  size?: number
  mimeType: string
  filename: string
}

// Rich text content structure
export interface RichTextContent {
  raw: any // Raw content from CMS (varies by provider)
  html?: string
  plainText?: string
  markdown?: string
}

// Page content model
export interface Page extends BaseContentItem {
  title: string
  content?: RichTextContent
  excerpt?: string
  featuredImage?: MediaAsset
  seo: SEOMetadata
  template?: string
  parentPage?: string
  childPages?: Page[]
  customFields?: Record<string, any>
}

// Blog post content model
export interface BlogPost extends BaseContentItem {
  title: string
  content: RichTextContent
  excerpt: string
  featuredImage?: MediaAsset
  author: Author
  category: Category
  tags: Tag[]
  readingTime?: number
  seo: SEOMetadata
  relatedPosts?: BlogPost[]
}

// Author model
export interface Author extends BaseContentItem {
  name: string
  bio?: RichTextContent
  avatar?: MediaAsset
  email?: string
  website?: string
  socialLinks?: SocialLink[]
  posts?: BlogPost[]
}

// Category model
export interface Category extends BaseContentItem {
  name: string
  description?: string
  color?: string
  featuredImage?: MediaAsset
  parentCategory?: Category
  childCategories?: Category[]
  posts?: BlogPost[]
}

// Tag model
export interface Tag extends BaseContentItem {
  name: string
  description?: string
  color?: string
  posts?: BlogPost[]
}

// Navigation model
export interface Navigation extends BaseContentItem {
  title: string
  items: NavigationItem[]
}

export interface NavigationItem {
  label: string
  url: string
  isExternal?: boolean
  children?: NavigationItem[]
  target?: '_blank' | '_self'
  icon?: string
}

// Social links
export interface SocialLink {
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'github' | 'custom'
  url: string
  username?: string
}

// Site configuration
export interface SiteConfig extends BaseContentItem {
  siteName: string
  siteDescription: string
  siteUrl: string
  logo?: MediaAsset
  favicon?: MediaAsset
  socialLinks?: SocialLink[]
  contactInfo?: ContactInfo
  seo: SEOMetadata
  analytics?: AnalyticsConfig
  themeConfig?: ThemeConfig
}

export interface ContactInfo {
  email?: string
  phone?: string
  address?: Address
}

export interface Address {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface AnalyticsConfig {
  googleAnalyticsId?: string
  googleTagManagerId?: string
  facebookPixelId?: string
  hotjarId?: string
  customScripts?: string[]
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  customCSS?: string
}

// CMS Provider specific types
export type CMSProvider = 'sanity' | 'contentful' | 'strapi' | 'ghost' | 'wordpress'

// Query parameters for content fetching
export interface ContentQuery {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
  filters?: Record<string, any>
  include?: string[]
  search?: string
}

// Pagination metadata
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// API Response wrapper
export interface CMSResponse<T> {
  data: T
  meta?: PaginationMeta
  errors?: CMSError[]
}

export interface CMSError {
  code: string
  message: string
  field?: string
}

// Content collection response
export interface ContentCollection<T extends BaseContentItem> {
  items: T[]
  total: number
  meta: PaginationMeta
}

// Webhook payload structure
export interface WebhookPayload {
  event: 'created' | 'updated' | 'deleted' | 'published' | 'unpublished'
  model: string
  entry: BaseContentItem
  provider: CMSProvider
  timestamp: string
}

// Cache configuration
export interface CacheConfig {
  ttl: number // Time to live in seconds
  tags: string[] // Cache tags for invalidation
  revalidateOnStale?: boolean
}

// Content preview configuration
export interface PreviewConfig {
  enabled: boolean
  secret?: string
  previewUrl?: string
}

// CMS Client interface that all providers must implement
export interface CMSClient {
  provider: CMSProvider
  
  // Content fetching methods
  getPage(slug: string): Promise<Page | null>
  getPages(query?: ContentQuery): Promise<ContentCollection<Page>>
  
  getBlogPost(slug: string): Promise<BlogPost | null>
  getBlogPosts(query?: ContentQuery): Promise<ContentCollection<BlogPost>>
  
  getAuthor(slug: string): Promise<Author | null>
  getAuthors(query?: ContentQuery): Promise<ContentCollection<Author>>
  
  getCategory(slug: string): Promise<Category | null>
  getCategories(query?: ContentQuery): Promise<ContentCollection<Category>>
  
  getTags(query?: ContentQuery): Promise<ContentCollection<Tag>>
  
  getNavigation(identifier: string): Promise<Navigation | null>
  
  getSiteConfig(): Promise<SiteConfig | null>
  
  // Search functionality
  search(query: string, type?: string): Promise<ContentCollection<BaseContentItem>>
  
  // Cache management
  revalidateCache(tags?: string[]): Promise<void>
  
  // Webhook handling
  handleWebhook(payload: WebhookPayload): Promise<void>
}