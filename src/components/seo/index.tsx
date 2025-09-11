export { generateMetadata } from './seo-head';
export { PerformanceHead } from './performance-head';

// Simple WebPageSchema component
export function WebPageSchema({ page, siteConfig }: { page: any; siteConfig: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: `${siteConfig.url}/${page.slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}