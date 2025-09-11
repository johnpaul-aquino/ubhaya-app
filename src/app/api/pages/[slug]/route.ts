/**
 * API Route: /api/pages/[slug]
 * Handles requests for individual page content with ISR support
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
    const page = await client.getPage(slug)
    
    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }
    
    // Set cache headers for ISR
    const response = NextResponse.json(page)
    
    // Cache for 5 minutes, stale while revalidate for 1 hour
    response.headers.set(
      'Cache-Control',
      's-maxage=300, stale-while-revalidate=3600'
    )
    
    // Add cache tags for selective revalidation
    response.headers.set('Cache-Tag', `pages,page:${page.id}`)
    
    return response
  } catch (error) {
    console.error('API Error - Page by slug:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch page',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle revalidation for specific page
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
      
      // Get page to find its ID for cache tagging
      const page = await client.getPage(slug)
      if (page) {
        await client.revalidateCache([`page:${page.id}`, 'pages'])
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Page ${slug} cache revalidated` 
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('API Error - Page revalidation:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to revalidate page',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}