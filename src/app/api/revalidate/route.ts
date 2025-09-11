/**
 * API Route: /api/revalidate
 * Handles cache revalidation requests (for webhooks and manual triggers)
 */

import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'
import { getCMSClient, initializeCMS, getCMSConfig } from '@/lib/cms'
import type { WebhookPayload } from '@/lib/types/cms'

// Initialize CMS client
let cmsClient: any = null

async function initCMS() {
  if (!cmsClient) {
    const config = getCMSConfig()
    cmsClient = initializeCMS(config)
  }
  return cmsClient
}

// Verify webhook signature (implement according to your CMS)
function verifyWebhookSignature(request: NextRequest, body: string): boolean {
  const signature = request.headers.get('x-webhook-signature')
  const secret = process.env.WEBHOOK_SECRET
  
  if (!signature || !secret) {
    return process.env.NODE_ENV === 'development' // Allow in dev mode
  }
  
  // Implement signature verification based on your CMS
  // Example for generic webhook:
  // const expectedSignature = crypto
  //   .createHmac('sha256', secret)
  //   .update(body)
  //   .digest('hex')
  
  // return signature === expectedSignature
  
  return true // Simplified for example
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    
    // Verify webhook signature
    if (!verifyWebhookSignature(request, body)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }
    
    await initCMS()
    
    const payload = JSON.parse(body)
    const client = getCMSClient()
    
    // Handle different types of revalidation requests
    if (payload.type === 'webhook') {
      // CMS webhook payload
      const webhookPayload = payload as WebhookPayload
      await handleWebhookRevalidation(webhookPayload)
      
      // Also trigger CMS client webhook handler
      await client.handleWebhook(webhookPayload)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Webhook processed and cache revalidated',
        event: webhookPayload.event,
        model: webhookPayload.model
      })
    } else if (payload.type === 'manual') {
      // Manual revalidation request
      const { tags, paths } = payload
      
      if (tags && Array.isArray(tags)) {
        // Revalidate specific cache tags
        tags.forEach((tag: string) => {
          revalidateTag(tag)
        })
        
        // Also clear CMS client cache
        await client.revalidateCache(tags)
      }
      
      if (paths && Array.isArray(paths)) {
        // Revalidate specific paths
        paths.forEach((path: string) => {
          revalidatePath(path)
        })
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Manual revalidation completed',
        tags: tags || [],
        paths: paths || []
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid revalidation type' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('API Error - Revalidation:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process revalidation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

async function handleWebhookRevalidation(payload: WebhookPayload) {
  const { event, model, entry } = payload
  
  switch (model) {
    case 'page':
      revalidateTag('pages')
      revalidateTag(`page:${entry.id}`)
      revalidatePath(`/${entry.slug}`)
      break
      
    case 'blogPost':
      revalidateTag('blog')
      revalidateTag('blogPosts')
      revalidateTag(`blogPost:${entry.id}`)
      revalidatePath(`/blog/${entry.slug}`)
      revalidatePath('/blog') // Blog listing page
      break
      
    case 'author':
      revalidateTag('authors')
      revalidateTag(`author:${entry.slug}`)
      revalidateTag('blog') // Author changes affect blog posts
      break
      
    case 'category':
      revalidateTag('categories')
      revalidateTag(`category:${entry.slug}`)
      revalidateTag('blog') // Category changes affect blog posts
      break
      
    case 'tag':
      revalidateTag('tags')
      revalidateTag(`tag:${entry.slug}`)
      revalidateTag('blog') // Tag changes affect blog posts
      break
      
    case 'navigation':
      revalidateTag('navigation')
      revalidatePath('/') // Navigation changes affect all pages
      break
      
    case 'siteConfig':
      revalidateTag('siteConfig')
      revalidatePath('/') // Site config changes affect all pages
      break
      
    default:
      // Generic revalidation for unknown models
      revalidateTag(model)
      revalidateTag(`${model}:${entry.id}`)
  }
  
  console.log(`Revalidated cache for ${model} ${event} event`, {
    entryId: entry.id,
    entrySlug: entry.slug
  })
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Revalidation endpoint is active',
    timestamp: new Date().toISOString()
  })
}