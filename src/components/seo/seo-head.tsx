import type { Metadata } from 'next';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: {
    url: string;
    alt: string;
  };
}

interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage?: string;
}

interface GenerateMetadataProps {
  seo?: SEOData;
  siteConfig: SiteConfig;
  url?: string;
  type?: 'website' | 'article';
}

export function generateMetadata({
  seo,
  siteConfig,
  url,
  type = 'website'
}: GenerateMetadataProps): Metadata {
  const title = seo?.title || siteConfig.name;
  const description = seo?.description || siteConfig.description;
  const canonical = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const imageUrl = seo?.image?.url || siteConfig.ogImage;

  return {
    title,
    description,
    keywords: seo?.keywords,
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            alt: seo?.image?.alt || title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imageUrl && {
        images: [imageUrl],
      }),
    },
    alternates: {
      canonical,
    },
  };
}