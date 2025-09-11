/**
 * API Route: /api/pages
 * Handles requests for page content with ISR support
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCMSClient, initializeCMS, getCMSConfig } from '@/lib/cms'
import type { ContentQuery } from '@/lib/types/cms'

// Initialize CMS client
let cmsClient: any = null

async function initCMS() {
  if (!cmsClient) {
    const config = getCMSConfig()
    cmsClient = initializeCMS(config)
  }
  return cmsClient
}

export async function GET(request: NextRequest) {
  try {
    await initCMS()
    
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const query: ContentQuery = {
      limit: parseInt(searchParams.get('limit') || '10'),
      offset: parseInt(searchParams.get('offset') || '0'),
      orderBy: searchParams.get('orderBy') || 'updatedAt',
      orderDirection: (searchParams.get('orderDirection') as 'asc' | 'desc') || 'desc',
      search: searchParams.get('search') || undefined,
    }
    
    // Add filters if present
    const filters: Record<string, any> = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith('filter.')) {
        const filterKey = key.replace('filter.', '')
        filters[filterKey] = value
      }
    })
    
    if (Object.keys(filters).length > 0) {
      query.filters = filters
    }
    
    const client = getCMSClient()
    const result = await client.getPages(query)
    
    // Set cache headers for ISR
    const response = NextResponse.json(result)
    
    // Cache for 5 minutes, stale while revalidate for 1 hour
    response.headers.set(
      'Cache-Control',
      's-maxage=300, stale-while-revalidate=3600'
    )
    
    // Add cache tags for selective revalidation
    response.headers.set('Cache-Tag', 'pages,content')
    
    return response
  } catch (error) {
    console.error('API Error - Pages:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch pages',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await initCMS()
    
    const body = await request.json()
    const { action, data } = body
    
    switch (action) {
      case 'revalidate':
        const client = getCMSClient()
        await client.revalidateCache(['pages'])
        
        return NextResponse.json({ success: true, message: 'Pages cache revalidated' })
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('API Error - Pages POST:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}