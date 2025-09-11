/**
 * CMS Factory - Creates CMS client instances based on configuration
 */

import type { CMSClient, CMSProvider } from '../types/cms'

// Import CMS client implementations
import { SanityClient } from './providers/sanity'
import { ContentfulClient } from './providers/contentful'
import { StrapiClient } from './providers/strapi'

export interface CMSConfig {
  provider: CMSProvider
  apiUrl?: string
  apiKey?: string
  projectId?: string
  dataset?: string
  token?: string
  spaceId?: string
  environment?: string
  previewMode?: boolean
  [key: string]: any
}

/**
 * Factory class for creating CMS client instances
 */
export class CMSFactory {
  private static instance: CMSFactory
  private clients: Map<CMSProvider, CMSClient> = new Map()
  
  private constructor() {}
  
  public static getInstance(): CMSFactory {
    if (!CMSFactory.instance) {
      CMSFactory.instance = new CMSFactory()
    }
    return CMSFactory.instance
  }
  
  /**
   * Create a CMS client instance
   */
  public createClient(config: CMSConfig): CMSClient {
    // Return cached client if exists
    if (this.clients.has(config.provider)) {
      return this.clients.get(config.provider)!
    }
    
    let client: CMSClient
    
    switch (config.provider) {
      case 'sanity':
        client = new SanityClient(config)
        break
      case 'contentful':
        client = new ContentfulClient(config)
        break
      case 'strapi':
        client = new StrapiClient(config)
        break
      default:
        throw new Error(`Unsupported CMS provider: ${config.provider}`)
    }
    
    // Cache the client
    this.clients.set(config.provider, client)
    
    return client
  }
  
  /**
   * Get existing client or create new one
   */
  public getClient(provider: CMSProvider): CMSClient | null {
    return this.clients.get(provider) || null
  }
  
  /**
   * Clear all cached clients
   */
  public clearClients(): void {
    this.clients.clear()
  }
}

/**
 * Global CMS client instance
 */
let globalCMSClient: CMSClient | null = null

/**
 * Initialize CMS client with configuration
 */
export function initializeCMS(config: CMSConfig): CMSClient {
  const factory = CMSFactory.getInstance()
  globalCMSClient = factory.createClient(config)
  return globalCMSClient
}

/**
 * Get the global CMS client instance
 */
export function getCMSClient(): CMSClient {
  if (!globalCMSClient) {
    throw new Error('CMS client not initialized. Call initializeCMS() first.')
  }
  return globalCMSClient
}

/**
 * Get CMS configuration from environment variables
 */
export function getCMSConfig(): CMSConfig {
  const provider = process.env.CMS_PROVIDER as CMSProvider
  
  if (!provider) {
    throw new Error('CMS_PROVIDER environment variable is required')
  }
  
  const baseConfig: CMSConfig = {
    provider,
    previewMode: process.env.NODE_ENV === 'development',
  }
  
  switch (provider) {
    case 'sanity':
      return {
        ...baseConfig,
        projectId: process.env.SANITY_PROJECT_ID!,
        dataset: process.env.SANITY_DATASET || 'production',
        token: process.env.SANITY_API_TOKEN,
        apiVersion: process.env.SANITY_API_VERSION || '2023-12-01',
      }
    
    case 'contentful':
      return {
        ...baseConfig,
        spaceId: process.env.CONTENTFUL_SPACE_ID!,
        environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
        previewAccessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
      }
    
    case 'strapi':
      return {
        ...baseConfig,
        apiUrl: process.env.STRAPI_API_URL!,
        apiKey: process.env.STRAPI_API_KEY,
      }
    
    default:
      throw new Error(`Unsupported CMS provider: ${provider}`)
  }
}