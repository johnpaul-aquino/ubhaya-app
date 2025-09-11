import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Pricing } from '@/components/marketing/pricing';
import { CTA } from '@/components/marketing/cta';
import { TypographyH1, TypographyLead } from '@/components/ui/typography';
import { WebPageSchema } from '@/components/seo';

export const metadata: Metadata = {
  title: 'Pricing | Website Boilerplate',
  description: 'Choose the perfect plan for your web development needs. From basic websites to enterprise solutions.',
  openGraph: {
    title: 'Pricing | Website Boilerplate',
    description: 'Choose the perfect plan for your web development needs. From basic websites to enterprise solutions.',
    type: 'website',
  },
};

const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small projects and personal websites',
    price: 99,
    interval: 'project',
    features: [
      'Basic website setup',
      'Up to 5 pages',
      'Mobile responsive design',
      'Basic SEO optimization',
      'Contact form integration',
      '30 days of support',
      'Basic analytics setup',
    ],
    popular: false,
    cta: {
      text: 'Get Started',
      href: '/contact',
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for business websites and e-commerce',
    price: 299,
    interval: 'project',
    features: [
      'Everything in Starter',
      'Up to 15 pages',
      'CMS integration (Sanity/Contentful)',
      'Advanced SEO optimization',
      'Blog functionality',
      'E-commerce integration',
      '90 days of support',
      'Performance optimization',
      'Custom contact forms',
      'Social media integration',
    ],
    popular: true,
    cta: {
      text: 'Choose Professional',
      href: '/contact',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large-scale applications and custom solutions',
    price: 799,
    interval: 'project',
    features: [
      'Everything in Professional',
      'Unlimited pages',
      'Custom CMS development',
      'Multi-language support',
      'Advanced integrations',
      'User authentication',
      'Custom dashboard',
      '1 year of support',
      'Priority support',
      'Custom training',
      'Performance monitoring',
      'Security audit',
    ],
    popular: false,
    cta: {
      text: 'Contact Sales',
      href: '/contact',
    },
  },
];

const addOns = [
  {
    name: 'Additional Pages',
    description: 'Extra pages beyond the plan limit',
    price: '$25 per page',
  },
  {
    name: 'Custom Integrations',
    description: 'Third-party API integrations',
    price: '$150 per integration',
  },
  {
    name: 'Priority Support',
    description: '24/7 support with 2-hour response time',
    price: '$99/month',
  },
  {
    name: 'Monthly Maintenance',
    description: 'Updates, backups, and monitoring',
    price: '$199/month',
  },
];

export default function PricingPage() {
  return (
    <>
      <WebPageSchema
        page={{
          id: 'pricing',
          title: 'Pricing',
          description: 'Choose the perfect plan for your web development needs. From basic websites to enterprise solutions.',
          slug: 'pricing',
          seo: {
            title: 'Pricing | Website Boilerplate',
            description: 'Choose the perfect plan for your web development needs. From basic websites to enterprise solutions.',
            keywords: 'pricing, web development, website cost, plans, freelance',
            canonical: '/pricing',
          },
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }}
        siteConfig={{
          name: 'Website Boilerplate',
          description: 'Professional Next.js website boilerplate',
          url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        }}
      />

      <Section className="py-12 lg:py-20">
        <Container>
          <div className="text-center mb-12">
            <TypographyH1>Simple, Transparent Pricing</TypographyH1>
            <TypographyLead className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your project. All plans include our professional 
              website boilerplate and expert development.
            </TypographyLead>
          </div>

          <Pricing
            plans={pricingPlans}
            billing="project"
            showBillingToggle={false}
          />

          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Add-On Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Extend your website with additional features and services
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {addOns.map((addOn, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-6 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold mb-1">{addOn.name}</h3>
                    <p className="text-sm text-muted-foreground">{addOn.description}</p>
                  </div>
                  <div className="font-semibold text-primary">
                    {addOn.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-muted/50 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Need a Custom Quote?</h3>
              <p className="text-muted-foreground mb-6">
                Have specific requirements or need a solution that doesn't fit our standard plans? 
                Contact us for a custom quote tailored to your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Get Custom Quote
                </a>
                <a 
                  href="mailto:hello@yourwebsite.com" 
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CTA
        title="Ready to Get Started?"
        description="Choose your plan and let's build something amazing together. All plans include our professional website boilerplate and expert support."
        actions={[
          {
            label: 'Contact Us',
            href: '/contact',
            variant: 'default',
          },
          {
            label: 'View Portfolio',
            href: '#',
            variant: 'outline',
          },
        ]}
      />
    </>
  );
}