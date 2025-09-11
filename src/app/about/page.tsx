import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Hero } from '@/components/layout/hero';
import { Features } from '@/components/marketing/features';
import { CTA } from '@/components/marketing/cta';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About Us | Website Boilerplate',
  description: 'Learn about our professional Next.js website boilerplate designed for modern web development and headless CMS integration.',
  openGraph: {
    title: 'About Us | Website Boilerplate',
    description: 'Learn about our professional Next.js website boilerplate designed for modern web development and headless CMS integration.',
    type: 'website',
  },
};

const technologies = [
  { name: 'Next.js 15', description: 'React framework with App Router' },
  { name: 'TypeScript', description: 'Type-safe development' },
  { name: 'TailwindCSS', description: 'Utility-first CSS framework' },
  { name: 'shadcn/ui', description: 'Beautiful component library' },
  { name: 'Headless CMS', description: 'Multi-provider support' },
  { name: 'SEO Optimized', description: 'Built-in SEO best practices' },
];

const features = [
  {
    title: 'Professional Design System',
    description: 'A complete design system with accessible colors, typography, and components.',
  },
  {
    title: 'CMS Agnostic',
    description: 'Works with Sanity, Contentful, Strapi, and other headless CMS providers.',
  },
  {
    title: 'SEO Optimized',
    description: 'Built-in SEO components, structured data, and performance optimizations.',
  },
  {
    title: 'Developer Experience',
    description: 'TypeScript, ESLint, Prettier, Husky, and comprehensive testing setup.',
  },
  {
    title: 'Performance First',
    description: 'ISR, image optimization, and modern web performance techniques.',
  },
  {
    title: 'Accessibility',
    description: 'WCAG AA+ compliance with comprehensive accessibility features.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        title="About Website Boilerplate"
        description="A professional, production-ready Next.js boilerplate designed to accelerate your freelance projects with modern web technologies and best practices."
        ctaText="View Features"
        ctaHref="#features"
        secondaryCtaText="Get Started"
        secondaryCtaHref="/"
      />

      <Section className="bg-muted/50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why This Boilerplate?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Built from years of freelance experience, this boilerplate includes everything you need 
              to deliver professional websites quickly and efficiently.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {technologies.map((tech, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary">
                    {tech.name}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {tech.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="features">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Comprehensive Features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to build professional websites
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="p-8">
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-muted/50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for Freelancers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              This boilerplate was created specifically for freelance web developers who need to 
              deliver high-quality websites efficiently.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-4">Time-Saving</h3>
              <p className="text-muted-foreground mb-4">
                Skip the setup phase and focus on what matters - building unique features for your clients. 
                This boilerplate includes all the foundational work done right.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Complete development environment setup</li>
                <li>• Pre-configured tooling and linting</li>
                <li>• Ready-to-use component library</li>
                <li>• SEO optimization built-in</li>
              </ul>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-4">Professional Quality</h3>
              <p className="text-muted-foreground mb-4">
                Deliver websites that meet enterprise standards with built-in accessibility, 
                performance optimization, and modern web practices.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• WCAG AA+ accessibility compliance</li>
                <li>• Performance optimization</li>
                <li>• Security best practices</li>
                <li>• Type-safe development</li>
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      <Section>
        <Container maxWidth="xl" className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Ready to Build Amazing Websites?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your next project with this comprehensive boilerplate and deliver professional results faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href="/">
                Get Started
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/components">
                View Components
              </a>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}