/**
 * Image SEO Component - Optimized images with SEO best practices
 */

import Image from 'next/image'
import { type MediaAsset } from '@/lib/types/cms'

interface ImageSEOProps {
  image: MediaAsset
  priority?: boolean
  sizes?: string
  className?: string
  fill?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function ImageSEO({
  image,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className,
  fill = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
}: ImageSEOProps) {
  // Generate structured data for the image
  const imageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: image.url,
    ...(image.width && { width: image.width }),
    ...(image.height && { height: image.height }),
    ...(image.description && { description: image.description }),
    ...(image.alt && { name: image.alt }),
    encodingFormat: image.mimeType,
  }

  return (
    <>
      {/* Structured data for the image */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageStructuredData) }}
      />
      
      {/* Optimized Next.js Image */}
      <Image
        src={image.url}
        alt={image.alt || image.title || 'Image'}
        {...(fill ? {} : { width: image.width || 1200, height: image.height || 630 })}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        {...(blurDataURL && { blurDataURL })}
        className={className}
        // SEO attributes
        title={image.title}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
      />
    </>
  )
}

/**
 * Logo Component - Optimized logo with structured data
 */
interface LogoSEOProps {
  logo: MediaAsset
  organizationName: string
  className?: string
  priority?: boolean
}

export function LogoSEO({ logo, organizationName, className, priority = true }: LogoSEOProps) {
  const logoStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organizationName,
    logo: {
      '@type': 'ImageObject',
      url: logo.url,
      ...(logo.width && { width: logo.width }),
      ...(logo.height && { height: logo.height }),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(logoStructuredData) }}
      />
      
      <Image
        src={logo.url}
        alt={`${organizationName} logo`}
        width={logo.width || 200}
        height={logo.height || 50}
        quality={95}
        priority={priority}
        className={className}
        title={`${organizationName} logo`}
        loading="eager"
        decoding="sync"
      />
    </>
  )
}

/**
 * Hero Image Component - Above-the-fold optimized image
 */
interface HeroImageSEOProps {
  image: MediaAsset
  title?: string
  className?: string
}

export function HeroImageSEO({ image, title, className }: HeroImageSEOProps) {
  return (
    <ImageSEO
      image={image}
      priority={true}
      sizes="100vw"
      quality={90}
      className={className}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  )
}