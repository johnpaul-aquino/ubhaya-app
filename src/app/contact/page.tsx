import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TypographyH1, TypographyH2, TypographyP, TypographyLead } from '@/components/ui/typography';
import { WebPageSchema } from '@/components/seo';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Website Boilerplate',
  description: 'Get in touch with us about our Next.js website boilerplate. We\'re here to help with your web development projects.',
  openGraph: {
    title: 'Contact Us | Website Boilerplate',
    description: 'Get in touch with us about our Next.js website boilerplate. We\'re here to help with your web development projects.',
    type: 'website',
  },
};

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    details: 'hello@yourwebsite.com',
    description: 'Send us an email anytime',
  },
  {
    icon: Phone,
    title: 'Phone',
    details: '+1 (555) 123-4567',
    description: 'Mon-Fri from 8am to 6pm',
  },
  {
    icon: MapPin,
    title: 'Office',
    details: 'Remote-First',
    description: 'Working globally',
  },
  {
    icon: Clock,
    title: 'Response Time',
    details: '24 hours',
    description: 'Average response time',
  },
];

const services = [
  'Custom Website Development',
  'Headless CMS Implementation',
  'Performance Optimization',
  'SEO Consultation',
  'Accessibility Audits',
  'Technical Support',
];

export default function ContactPage() {
  return (
    <>
      <WebPageSchema
        page={{
          id: 'contact',
          title: 'Contact Us',
          description: 'Get in touch with us about our Next.js website boilerplate. We\'re here to help with your web development projects.',
          slug: 'contact',
          seo: {
            title: 'Contact Us | Website Boilerplate',
            description: 'Get in touch with us about our Next.js website boilerplate. We\'re here to help with your web development projects.',
            keywords: 'contact, support, web development, nextjs, consultation',
            canonical: '/contact',
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
            <TypographyH1>Contact Us</TypographyH1>
            <TypographyLead className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Have questions about the boilerplate or need help with your project? 
              We're here to help you build amazing websites.
            </TypographyLead>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Contact Form */}
            <Card className="p-8">
              <TypographyH2 className="mb-6">Send us a message</TypographyH2>
              <form className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      placeholder="John" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      placeholder="Doe" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input 
                    id="company" 
                    name="company" 
                    placeholder="Your Company" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type</Label>
                  <select 
                    id="projectType" 
                    name="projectType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select a project type</option>
                    <option value="new-website">New Website</option>
                    <option value="redesign">Website Redesign</option>
                    <option value="cms-migration">CMS Migration</option>
                    <option value="consultation">Consultation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range (Optional)</Label>
                  <select 
                    id="budget" 
                    name="budget"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select budget range</option>
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="over-50k">Over $50,000</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="Tell us about your project..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <TypographyH2 className="mb-6">Get in touch</TypographyH2>
                <TypographyP className="text-muted-foreground mb-8">
                  We'd love to hear from you. Whether you need help with the boilerplate, 
                  want to discuss a project, or just want to say hello.
                </TypographyP>
                
                <div className="grid gap-4">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="font-semibold text-foreground">{item.details}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="p-6">
                <TypographyH2 className="mb-4 text-xl">Services We Offer</TypographyH2>
                <TypographyP className="text-muted-foreground mb-4">
                  We specialize in modern web development with a focus on performance, 
                  accessibility, and user experience.
                </TypographyP>
                <div className="flex flex-wrap gap-2">
                  {services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <TypographyH2 className="mb-4 text-xl">FAQ</TypographyH2>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Is this boilerplate free to use?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, this boilerplate is open source and free to use for personal and commercial projects.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Do you offer customization services?</h4>
                    <p className="text-sm text-muted-foreground">
                      Absolutely! We can help customize the boilerplate for your specific needs and requirements.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">What CMS platforms do you support?</h4>
                    <p className="text-sm text-muted-foreground">
                      We support Sanity, Contentful, Strapi, and can add support for other headless CMS platforms.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}