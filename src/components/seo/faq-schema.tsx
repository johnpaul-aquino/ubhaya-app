/**
 * FAQ Schema Component - Structured data for frequently asked questions
 */

import { JsonLd } from './json-ld'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return <JsonLd data={schema} />
}

/**
 * HOW-TO Schema Component - Structured data for step-by-step guides
 */
export interface HowToStep {
  name: string
  text: string
  image?: string
  url?: string
}

interface HowToSchemaProps {
  name: string
  description: string
  steps: HowToStep[]
  totalTime?: string
  image?: string
  video?: {
    name: string
    description: string
    thumbnailUrl: string
    uploadDate: string
    duration: string
    contentUrl: string
  }
}

export function HowToSchema({ name, description, steps, totalTime, image, video }: HowToSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(image && {
      image: image.startsWith('http') ? image : `${baseUrl}${image}`,
    }),
    ...(totalTime && {
      totalTime,
    }),
    supply: [],
    tool: [],
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: step.image.startsWith('http') ? step.image : `${baseUrl}${step.image}`,
      }),
      ...(step.url && {
        url: step.url.startsWith('http') ? step.url : `${baseUrl}${step.url}`,
      }),
    })),
    ...(video && {
      video: {
        '@type': 'VideoObject',
        name: video.name,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `${baseUrl}${video.thumbnailUrl}`,
        uploadDate: video.uploadDate,
        duration: video.duration,
        contentUrl: video.contentUrl,
      },
    }),
  }

  return <JsonLd data={schema} />
}