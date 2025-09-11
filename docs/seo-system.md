# SEO System Documentation

This document describes the comprehensive SEO system implemented in the Next.js headless website boilerplate.

## Overview

The SEO system provides complete search engine optimization with structured data, performance optimizations, and social media integration. All components work seamlessly with the CMS abstraction layer.

## Features

### 1. Metadata Management
- **Dynamic metadata generation** using Next.js 15 metadata API
- **Title optimization** with length validation (30-60 characters)
- **Description optimization** with length validation (120-160 characters)
- **Keywords extraction** and density analysis
- **Canonical URLs** with duplicate content prevention
- **Open Graph** tags for social media sharing
- **Twitter Cards** with rich media support
- **Robots directives** (index/noindex, follow/nofollow)

### 2. Structured Data (JSON-LD)
- **Article schema** for blog posts with author, publisher, and article metadata
- **WebPage schema** for general pages
- **Website schema** with organization information
- **Breadcrumb schema** for navigation
- **FAQ schema** for question/answer content
- **Product schema** for e-commerce pages
- **HowTo schema** for step-by-step guides
- **Image schema** for rich image results

### 3. Performance Optimizations
- **Critical CSS inlining** for above-the-fold content
- **DNS prefetching** for external domains
- **Resource preloading** for critical assets
- **Font optimization** with display: swap
- **Image optimization** with Next.js Image component
- **Lazy loading** for non-critical images
- **Web App Manifest** for PWA capabilities

### 4. Advanced Sitemaps
- **Dynamic XML sitemap** generation from CMS content
- **Priority calculation** based on content type and recency
- **Change frequency** optimization based on content age
- **Image sitemap** for better image indexing
- **News sitemap** support (if needed)

### 5. Robots.txt Management
- **Environment-aware** robots configuration
- **Crawler-specific rules** (Googlebot, Bingbot, etc.)
- **AI crawler blocking** options
- **Development environment protection**

## Components

### Core Components

#### `SEOHead`
```tsx
import { generateMetadata } from '@/components/seo'

export async function generateMetadata({ params }): Promise<Metadata> {
  const metadata = generateMetadata({
    seo: seoData,
    siteConfig,
    url: '/page-url',
    type: 'website' | 'article',
    article: {
      publishedTime: '2024-01-01',
      modifiedTime: '2024-01-02',
      author: 'Author Name',
      section: 'Category',
      tags: ['tag1', 'tag2']
    }
  })
  
  return metadata
}
```

#### `ArticleSchema`
```tsx
import { ArticleSchema } from '@/components/seo'

<ArticleSchema 
  article={blogPost} 
  siteConfig={siteConfig}
  url="/blog/post-slug"
/>
```

#### `PerformanceHead`
```tsx
import { PerformanceHead } from '@/components/seo'

<PerformanceHead 
  criticalCSS="/* critical styles */"
  preloadFonts={['font-url-1', 'font-url-2']}
  prefetchDomains={['domain1.com', 'domain2.com']}
  preloadImages={['hero-image.jpg']}
/>
```

### Structured Data Components

All structured data components automatically generate JSON-LD markup:

- `ArticleSchema` - Blog posts and articles
- `WebPageSchema` - General pages
- `WebsiteSchema` - Site-wide organization data
- `BreadcrumbsSchema` - Navigation breadcrumbs
- `FAQSchema` - FAQ pages
- `ProductSchema` - Product pages
- `HowToSchema` - Tutorial content

### Image Components

#### `ImageSEO`
```tsx
import { ImageSEO } from '@/components/seo'

<ImageSEO
  image={mediaAsset}
  priority={true}
  sizes="(max-width: 768px) 100vw, 50vw"
  quality={90}
/>
```

#### `HeroImageSEO`
```tsx
import { HeroImageSEO } from '@/components/seo'

<HeroImageSEO
  image={heroImage}
  title="Page Title"
  className="hero-image"
/>
```

## Utilities

### SEO Validation
```tsx
import { seoValidation } from '@/lib/seo'

const validation = seoValidation.validateSEO(seoMetadata, content)
// Returns: { isValid: boolean, errors: string[], warnings: string[], score: number }
```

### Keyword Analysis
```tsx
import { keywordUtils } from '@/lib/seo'

const density = keywordUtils.calculateDensity(content, 'target keyword')
const keywords = keywordUtils.extractKeywords(content, 10)
const optimization = keywordUtils.validateKeywordOptimization(content, 'keyword')
```

### Reading Time
```tsx
import { readingTimeUtils } from '@/lib/seo'

const readingTime = readingTimeUtils.calculate(content)
const formatted = readingTimeUtils.format(readingTime) // "5 minutes"
```

### URL Utilities
```tsx
import { urlUtils } from '@/lib/seo'

const slug = urlUtils.generateSlug('Article Title With Special Characters!')
const validation = urlUtils.validateSlug(slug)
const canonicalUrl = urlUtils.buildCanonicalUrl(baseUrl, '/path')
```

## Configuration

### Environment Variables
```env
# Required
NEXT_PUBLIC_SITE_URL=https://yoursite.com

# Optional SEO
GOOGLE_VERIFICATION_ID=your-google-verification-id
BING_VERIFICATION_ID=your-bing-verification-id
YANDEX_VERIFICATION_ID=your-yandex-verification-id

# Development
ALLOW_INDEXING=false # Set to false for staging environments
```

### CMS Configuration
Ensure your CMS models include the `SEOMetadata` interface:

```typescript
interface SEOMetadata {
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
```

## Best Practices

### 1. Title Optimization
- Keep titles between 30-60 characters
- Include primary keyword near the beginning
- Use descriptive, unique titles for each page
- Include brand name at the end (handled automatically)

### 2. Description Optimization
- Keep descriptions between 120-160 characters
- Include primary and secondary keywords naturally
- Write compelling, action-oriented descriptions
- Avoid duplicate descriptions across pages

### 3. Image Optimization
- Use descriptive alt text for all images
- Include relevant keywords in image filenames
- Optimize image sizes and formats (WebP when possible)
- Use structured data for important images

### 4. Content Structure
- Use semantic HTML5 elements
- Implement proper heading hierarchy (H1 → H2 → H3)
- Include relevant keywords in headings
- Use internal linking strategically

### 5. Performance
- Minimize cumulative layout shift (CLS)
- Optimize largest contentful paint (LCP)
- Reduce first input delay (FID)
- Use critical CSS for above-the-fold content

## Testing and Validation

### 1. SEO Tools
- **Google Search Console** - Monitor search performance
- **Rich Results Test** - Validate structured data
- **PageSpeed Insights** - Check Core Web Vitals
- **Lighthouse** - Comprehensive SEO audit

### 2. Validation Functions
```tsx
import { seoValidation } from '@/lib/seo'

// Validate complete SEO setup
const validation = seoValidation.validateSEO(seoData, content)

// Check individual elements
const titleCheck = seoUtils.validateTitle(title)
const descCheck = seoUtils.validateDescription(description)
```

### 3. Testing Components
```tsx
import { render } from '@testing-library/react'
import { ArticleSchema } from '@/components/seo'

test('generates correct article structured data', () => {
  const { container } = render(<ArticleSchema article={mockPost} />)
  const script = container.querySelector('script[type="application/ld+json"]')
  const data = JSON.parse(script.textContent)
  
  expect(data['@type']).toBe('Article')
  expect(data.headline).toBe(mockPost.title)
})
```

## Integration Examples

### Blog Post Page
```tsx
import { ArticleSchema, BreadcrumbsSchema, generateMetadata } from '@/components/seo'

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  const siteConfig = await getSiteConfiguration()
  
  return generateMetadata({
    seo: post.seo,
    siteConfig,
    url: `/blog/${post.slug}`,
    type: 'article',
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      author: post.author.name,
      section: post.category.name,
      tags: post.tags.map(tag => tag.name)
    }
  })
}

export default function BlogPost({ post }) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` }
  ]

  return (
    <>
      <ArticleSchema article={post} siteConfig={siteConfig} />
      <BreadcrumbsSchema items={breadcrumbs} />
      {/* Page content */}
    </>
  )
}
```

### Product Page
```tsx
import { ProductSchema } from '@/components/seo'

<ProductSchema
  name="Product Name"
  description="Product description"
  image={['image1.jpg', 'image2.jpg']}
  brand="Brand Name"
  offers={{
    price: "99.99",
    currency: "USD",
    availability: "InStock"
  }}
  aggregateRating={{
    ratingValue: 4.5,
    reviewCount: 123
  }}
/>
```

This comprehensive SEO system ensures your Next.js headless website achieves maximum search engine visibility while maintaining excellent performance and user experience.