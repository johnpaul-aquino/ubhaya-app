/**
 * Web App Manifest - PWA configuration for SEO and user experience
 */

import type { MetadataRoute } from 'next'
// import { getSiteConfiguration } from '@/lib/cms'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // const siteConfig = await getSiteConfiguration()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    name: 'Next.js Headless Website',
    short_name: 'Headless Site',
    description: 'A modern headless website built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    categories: ['business', 'productivity', 'education'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/icon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Homepage screenshot on desktop',
      },
      {
        src: '/screenshot-narrow.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Homepage screenshot on mobile',
      },
    ],
    shortcuts: [
      {
        name: 'Blog',
        short_name: 'Blog',
        description: 'Read our latest blog posts',
        url: '/blog',
        icons: [{ src: '/icon-blog.png', sizes: '96x96' }],
      },
      {
        name: 'Contact',
        short_name: 'Contact',
        description: 'Get in touch with us',
        url: '/contact',
        icons: [{ src: '/icon-contact.png', sizes: '96x96' }],
      },
    ],
  }
}