// CMS Configuration and Client Export
export interface SiteConfiguration {
  name: string;
  description: string;
  url: string;
  ogImage?: string;
  author?: {
    name: string;
    email: string;
    twitter?: string;
  };
  links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// Mock function for now - will be implemented by CMS providers
export async function getSiteConfiguration(): Promise<SiteConfiguration> {
  return {
    name: 'Website Boilerplate',
    description: 'A professional Next.js headless website boilerplate',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    author: {
      name: 'Your Name',
      email: 'hello@yourwebsite.com',
    },
    links: {
      twitter: 'https://twitter.com/yourusername',
      github: 'https://github.com/yourusername',
    },
  };
}