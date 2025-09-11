/**
 * API Route: /api/blog/[slug]
 * Handles requests for individual blog post content with ISR support
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCMSClient, initializeCMS, getCMSConfig } from '@/lib/cms'

// Initialize CMS client
let cmsClient: any = null

async function initCMS() {
  if (!cmsClient) {
    const config = getCMSConfig()
    cmsClient = initializeCMS(config)
  }
  return cmsClient
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await initCMS()
    
    const { slug } = params
    const client = getCMSClient()
    const post = await client.getBlogPost(slug)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }
    
    // Set cache headers for ISR
    const response = NextResponse.json(post)
    
    // Cache for 5 minutes, stale while revalidate for 1 hour
    response.headers.set(
      'Cache-Control',
      's-maxage=300, stale-while-revalidate=3600'
    )
    
    // Add cache tags for selective revalidation
    const cacheTags = [
      'blog',
      'blogPosts',
      `blogPost:${post.id}`,
      `category:${post.category.slug}`,
      `author:${post.author.slug}`,
      ...post.tags.map(tag => `tag:${tag.slug}`)
    ]
    
    response.headers.set('Cache-Tag', cacheTags.join(','))
    
    return response
  } catch (error) {
    console.error('API Error - Blog post by slug:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch blog post',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle revalidation for specific blog post
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await initCMS()
    
    const { slug } = params
    const body = await request.json()
    const { action } = body
    
    if (action === 'revalidate') {
      const client = getCMSClient()
      
      // Get post to find its ID and related content for cache tagging
      const post = await client.getBlogPost(slug)
      if (post) {
        const cacheTags = [
          `blogPost:${post.id}`,
          'blog',
          'blogPosts',
          `category:${post.category.slug}`,
          `author:${post.author.slug}`,
          ...post.tags.map(tag => `tag:${tag.slug}`)
        ]
        
        await client.revalidateCache(cacheTags)
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Blog post ${slug} cache revalidated` 
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('API Error - Blog post revalidation:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to revalidate blog post',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}