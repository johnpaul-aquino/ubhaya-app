/**
 * Product Schema Component - Structured data for products and services
 */

import { JsonLd } from './json-ld'

export interface ProductOffer {
  price: string
  currency: string
  availability: 'InStock' | 'OutOfStock' | 'PreOrder' | 'LimitedAvailability'
  validFrom?: string
  validThrough?: string
  seller?: {
    name: string
    url?: string
  }
}

export interface ProductReview {
  author: string
  reviewRating: number
  reviewBody: string
  datePublished?: string
}

interface ProductSchemaProps {
  name: string
  description: string
  image: string | string[]
  brand?: string
  model?: string
  sku?: string
  mpn?: string
  gtin?: string
  offers: ProductOffer | ProductOffer[]
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
    bestRating?: number
    worstRating?: number
  }
  reviews?: ProductReview[]
  category?: string
  color?: string
  material?: string
  weight?: string
  dimensions?: {
    height?: string
    width?: string
    depth?: string
  }
  url?: string
}

export function ProductSchema({
  name,
  description,
  image,
  brand,
  model,
  sku,
  mpn,
  gtin,
  offers,
  aggregateRating,
  reviews,
  category,
  color,
  material,
  weight,
  dimensions,
  url,
}: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const processImage = (img: string) => 
    img.startsWith('http') ? img : `${baseUrl}${img}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: Array.isArray(image) ? image.map(processImage) : processImage(image),
    ...(brand && { brand: { '@type': 'Brand', name: brand } }),
    ...(model && { model }),
    ...(sku && { sku }),
    ...(mpn && { mpn }),
    ...(gtin && { gtin13: gtin }),
    ...(category && { category }),
    ...(color && { color }),
    ...(material && { material }),
    ...(weight && { weight }),
    ...(url && { url: url.startsWith('http') ? url : `${baseUrl}${url}` }),
    ...(dimensions && {
      depth: dimensions.depth,
      height: dimensions.height,
      width: dimensions.width,
    }),
    offers: Array.isArray(offers) 
      ? offers.map(offer => ({
          '@type': 'Offer',
          price: offer.price,
          priceCurrency: offer.currency,
          availability: `https://schema.org/${offer.availability}`,
          ...(offer.validFrom && { validFrom: offer.validFrom }),
          ...(offer.validThrough && { validThrough: offer.validThrough }),
          ...(offer.seller && {
            seller: {
              '@type': 'Organization',
              name: offer.seller.name,
              ...(offer.seller.url && { url: offer.seller.url }),
            },
          }),
        }))
      : {
          '@type': 'Offer',
          price: offers.price,
          priceCurrency: offers.currency,
          availability: `https://schema.org/${offers.availability}`,
          ...(offers.validFrom && { validFrom: offers.validFrom }),
          ...(offers.validThrough && { validThrough: offers.validThrough }),
          ...(offers.seller && {
            seller: {
              '@type': 'Organization',
              name: offers.seller.name,
              ...(offers.seller.url && { url: offers.seller.url }),
            },
          }),
        },
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: aggregateRating.bestRating || 5,
        worstRating: aggregateRating.worstRating || 1,
      },
    }),
    ...(reviews && reviews.length > 0 && {
      review: reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.reviewRating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: review.reviewBody,
        ...(review.datePublished && { datePublished: review.datePublished }),
      })),
    }),
  }

  return <JsonLd data={schema} />
}