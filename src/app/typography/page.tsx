'use client'

import React from 'react'
import {
  Typography,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyLead,
  TypographyLarge,
  TypographySmall,
  TypographyMuted,
  TypographyCode,
  TypographyBlockquote,
  TypographyList,
  TypographyListItem,
} from '@/components/ui/typography'

export default function TypographyShowcase() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="content-width">
          <Typography variant="display-2xl" as="h1" balance className="mb-6">
            Typography System
          </Typography>
          <TypographyLead className="mb-8 max-w-3xl">
            A comprehensive, scalable, and accessible typography system built with TailwindCSS. 
            Designed for optimal readability across all devices with perfect vertical rhythm and harmonious scaling.
          </TypographyLead>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>✓ WCAG AA+ Compliant</span>
            <span>✓ Responsive & Fluid</span>
            <span>✓ Performance Optimized</span>
            <span>✓ Design Token Based</span>
          </div>
        </div>
      </section>

      <div className="content-width px-6 pb-20">
        {/* Display Typography Section */}
        <section className="mb-20">
          <TypographyH2 className="mb-8">Display Typography</TypographyH2>
          <TypographyP className="mb-8 text-secondary">
            Large, attention-grabbing text for hero sections, landing pages, and major announcements. 
            Uses fluid scaling with clamp() for perfect responsiveness.
          </TypographyP>
          
          <div className="space-y-8 border-l-2 border-border pl-8">
            <div>
              <TypographyMuted className="mb-2">Display 2XL - Hero Headlines</TypographyMuted>
              <Typography variant="display-2xl" balance>
                Revolutionary Design
              </Typography>
            </div>
            <div>
              <TypographyMuted className="mb-2">Display XL - Major Headings</TypographyMuted>
              <Typography variant="display-xl" balance>
                Exceptional User Experience
              </Typography>
            </div>
            <div>
              <TypographyMuted className="mb-2">Display LG - Section Headers</TypographyMuted>
              <Typography variant="display-lg" balance>
                Thoughtful Typography
              </Typography>
            </div>
            <div>
              <TypographyMuted className="mb-2">Display MD - Subsection Headers</TypographyMuted>
              <Typography variant="display-md">
                Crafted with Precision
              </Typography>
            </div>
          </div>
        </section>

        {/* Heading Hierarchy Section */}
        <section className="mb-20">
          <TypographyH2 className="mb-8">Semantic Heading Hierarchy</TypographyH2>
          <TypographyP className="mb-8 text-secondary">
            Semantic headings (H1-H6) with consistent scaling, proper spacing, and accessibility features. 
            Each heading maintains optimal line-height and letter-spacing for readability.
          </TypographyP>
          
          <div className="space-y-6">
            <div>
              <TypographyMuted className="mb-2">H1 - Page Title</TypographyMuted>
              <TypographyH1>The Art of Digital Typography</TypographyH1>
            </div>
            <div>
              <TypographyMuted className="mb-2">H2 - Major Section</TypographyMuted>
              <TypographyH2>Principles of Readable Design</TypographyH2>
            </div>
            <div>
              <TypographyMuted className="mb-2">H3 - Subsection</TypographyMuted>
              <TypographyH3>Visual Hierarchy and Rhythm</TypographyH3>
            </div>
            <div>
              <TypographyMuted className="mb-2">H4 - Minor Section</TypographyMuted>
              <TypographyH4>Typography in User Interface</TypographyH4>
            </div>
            <div>
              <TypographyMuted className="mb-2">H5 - Component Title</TypographyMuted>
              <Typography variant="h5">Accessibility Considerations</Typography>
            </div>
            <div>
              <TypographyMuted className="mb-2">H6 - Small Section</TypographyMuted>
              <Typography variant="h6">Implementation Details</Typography>
            </div>
          </div>
        </section>

        {/* Body Text Section */}
        <section className="mb-20">
          <TypographyH2 className="mb-8">Body Text Variants</TypographyH2>
          <TypographyP className="mb-8 text-secondary">
            A complete range of body text sizes optimized for different contexts and reading distances. 
            All variants maintain optimal line-height ratios (1.5-1.75) for comfortable reading.
          </TypographyP>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <TypographyMuted className="mb-2">Body 2XL - Feature Text</TypographyMuted>
              <Typography variant="body-2xl" className="mb-4">
                This is extra large body text, perfect for feature introductions and important statements 
                that need to stand out while remaining highly readable.
              </Typography>
            </div>
            <div>
              <TypographyMuted className="mb-2">Body XL - Highlighted Content</TypographyMuted>
              <Typography variant="body-xl" className="mb-4">
                Large body text works excellently for highlighted content, pull quotes, 
                and introductory paragraphs that deserve extra attention.
              </Typography>
            </div>
            <div>
              <TypographyMuted className="mb-2">Body LG - Comfortable Reading</TypographyMuted>
              <Typography variant="body-lg" className="mb-4">
                Large body text provides comfortable reading for longer content while maintaining 
                excellent readability across all devices and screen sizes.
              </Typography>
            </div>
            <div>
              <TypographyMuted className="mb-2">Body MD - Default Text (1rem)</TypographyMuted>
              <TypographyP className="mb-4">
                This is the default body text size, optimized for maximum readability with perfect 
                line-height and letter-spacing. It forms the foundation of our typography system.
              </TypographyP>
            </div>
            <div>
              <TypographyMuted className="mb-2">Body SM - Compact Content</TypographyMuted>
              <Typography variant="body-sm" className="mb-4">
                Small body text is perfect for compact layouts, secondary information, 
                and contexts where space is at a premium while maintaining readability.
              </Typography>
            </div>
            <div>
              <TypographyMuted className="mb-2">Body XS - Fine Print</TypographyMuted>
              <Typography variant="body-xs" className="mb-4">
                Extra small text for captions, metadata, fine print, and other supplementary 
                information that supports the main content without competing for attention.
              </Typography>
            </div>
          </div>
        </section>

        {/* Specialized Text Section */}
        <section className="mb-20">
          <TypographyH2 className="mb-8">Specialized Text Styles</TypographyH2>
          <TypographyP className="mb-8 text-secondary">
            Purpose-built text styles for specific use cases in modern web applications.
          </TypographyP>

          <div className="space-y-8">
            <div>
              <TypographyMuted className="mb-2">Lead Paragraph</TypographyMuted>
              <TypographyLead className="max-w-3xl">
                Lead paragraphs introduce articles and content sections with slightly larger, 
                lighter text that draws readers in and provides context for what follows. 
                Perfect for article introductions and section summaries.
              </TypographyLead>
            </div>

            <div>
              <TypographyMuted className="mb-2">Large Emphasis</TypographyMuted>
              <TypographyLarge>
                Large emphasized text for callouts, key metrics, and important statements 
                that need to stand out within body content.
              </TypographyLarge>
            </div>

            <div>
              <TypographyMuted className="mb-2">Small Supporting Text</TypographyMuted>
              <TypographySmall>
                Small text for supporting information, bylines, dates, and other metadata 
                that complements the main content without overwhelming it.
              </TypographySmall>
            </div>

            <div>
              <TypographyMuted className="mb-2">Muted/Secondary Text</TypographyMuted>
              <TypographyMuted>
                Muted text with reduced contrast for less important information, 
                placeholder text, and content that should recede into the background.
              </TypographyMuted>
            </div>
          </div>
        </section>

        {/* UI Elements Section */}
        <section className="mb-20">
          <TypographyH2 className="mb-8">Interface Elements</TypographyH2>
          <TypographyP className="mb-8 text-secondary">
            Typography styles specifically designed for user interface elements, labels, and interactive components.
          </TypographyP>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <TypographyMuted className="mb-4">Labels</TypographyMuted>
              <div className="space-y-3">
                <div>
                  <Typography variant="label-lg">Large Label</Typography>
                  <TypographySmall>For prominent form fields and sections</TypographySmall>
                </div>
                <div>
                  <Typography variant="label-md">Medium Label</Typography>
                  <TypographySmall>Standard form labels and UI elements</TypographySmall>
                </div>
                <div>
                  <Typography variant="label-sm">Small Label</Typography>
                  <TypographySmall>Compact forms and dense interfaces</TypographySmall>
                </div>
              </div>
            </div>

            <div>
              <TypographyMuted className="mb-4">Special Elements</TypographyMuted>
              <div className="space-y-4">
                <div>
                  <Typography variant="caption">Navigation Item</Typography>
                  <TypographySmall className="block">Uppercase, tracked text for navigation</TypographySmall>
                </div>
                <div>
                  <Typography variant="overline">Section Overline</Typography>
                  <TypographySmall className="block">Heavily tracked, all-caps section labels</TypographySmall>
                </div>
                <div className="flex items-center gap-3">
                  <TypographyCode>npm install</TypographyCode>
                  <Typography variant="kbd">⌘ + K</Typography>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography in Context */}
        <section className="mb-20">
          <TypographyH2 className="mb-8">Typography in Context</TypographyH2>
          <TypographyP className="mb-8 text-secondary">
            Real-world examples showing how different typography styles work together 
            to create hierarchy, improve readability, and enhance user experience.
          </TypographyP>

          <div className="space-y-16">
            {/* Article Example */}
            <div className="border border-border rounded-lg p-8">
              <TypographyMuted className="mb-6">Article Layout Example</TypographyMuted>
              
              <TypographyH1 className="mb-4">
                The Future of Web Typography
              </TypographyH1>
              
              <div className="flex items-center gap-4 mb-8 text-sm text-muted-foreground">
                <span>By Design Team</span>
                <span>•</span>
                <span>March 15, 2024</span>
                <span>•</span>
                <span>8 min read</span>
              </div>

              <TypographyLead className="mb-8">
                Modern web typography has evolved far beyond simple text display. 
                Today's typography systems are comprehensive design languages that enhance 
                readability, accessibility, and user experience across all digital touchpoints.
              </TypographyLead>

              <TypographyP className="mb-6">
                The foundation of exceptional web typography lies in understanding the relationship 
                between font selection, sizing, spacing, and color. Each decision impacts not just 
                aesthetic appeal, but also user comprehension and engagement.
              </TypographyP>

              <TypographyH3 className="mb-4">
                Principles of Modern Typography
              </TypographyH3>

              <TypographyP className="mb-4">
                Great typography follows several key principles:
              </TypographyP>

              <TypographyList className="mb-6">
                <TypographyListItem>
                  <strong>Hierarchy:</strong> Clear visual distinction between content levels
                </TypographyListItem>
                <TypographyListItem>
                  <strong>Readability:</strong> Optimal line lengths, heights, and contrast ratios
                </TypographyListItem>
                <TypographyListItem>
                  <strong>Consistency:</strong> Systematic approach to sizing and spacing
                </TypographyListItem>
                <TypographyListItem>
                  <strong>Accessibility:</strong> WCAG compliance and inclusive design
                </TypographyListItem>
              </TypographyList>

              <TypographyBlockquote className="mb-6">
                "Typography is the craft of endowing human language with a durable visual form."
              </TypographyBlockquote>

              <TypographyP className="mb-4">
                When implementing a typography system, consider the context in which text will be consumed. 
                Reading on mobile devices requires different considerations than desktop displays, 
                and our system adapts fluidly to these varying contexts.
              </TypographyP>
            </div>

            {/* Card Layout Example */}
            <div className="grid gap-6 md:grid-cols-3">
              <TypographyMuted className="md:col-span-3 mb-2">Card Layout Examples</TypographyMuted>
              
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border rounded-lg p-6">
                  <Typography variant="overline" className="mb-2">
                    Feature {i}
                  </Typography>
                  <TypographyH4 className="mb-3">
                    Responsive Design
                  </TypographyH4>
                  <TypographyP className="mb-4 text-secondary">
                    Our typography system scales beautifully across all screen sizes, 
                    maintaining optimal readability and visual appeal.
                  </TypographyP>
                  <Typography variant="link" href="#" className="font-medium">
                    Learn more →
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Color Variations */}
        <section className="mb-20">
          <TypographyH2 className="mb-8">Color Variations</TypographyH2>
          <TypographyP className="mb-8 text-secondary">
            All typography colors are carefully calibrated for WCAG AA+ compliance 
            and work seamlessly in both light and dark modes.
          </TypographyP>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border border-border rounded-lg">
              <Typography variant="body-lg" color="primary" className="mb-2">
                Primary Text
              </Typography>
              <TypographySmall>Highest contrast, main content</TypographySmall>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Typography variant="body-lg" color="secondary" className="mb-2">
                Secondary Text
              </Typography>
              <TypographySmall>Reduced emphasis, descriptions</TypographySmall>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Typography variant="body-lg" color="tertiary" className="mb-2">
                Tertiary Text
              </Typography>
              <TypographySmall>Subtle text, metadata</TypographySmall>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Typography variant="body-lg" color="muted" className="mb-2">
                Muted Text
              </Typography>
              <TypographySmall>Placeholder text, disabled states</TypographySmall>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Typography variant="body-lg" color="success" className="mb-2">
                Success Text
              </Typography>
              <TypographySmall>Positive feedback, confirmations</TypographySmall>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Typography variant="body-lg" color="warning" className="mb-2">
                Warning Text
              </Typography>
              <TypographySmall>Caution messages, alerts</TypographySmall>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Typography variant="body-lg" color="error" className="mb-2">
                Error Text
              </Typography>
              <TypographySmall>Error messages, validation</TypographySmall>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Typography variant="body-lg" color="info" className="mb-2">
                Info Text
              </Typography>
              <TypographySmall>Helpful information, tips</TypographySmall>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="mb-20">
          <TypographyH2 className="mb-8">Technical Implementation</TypographyH2>
          <TypographyP className="mb-8 text-secondary">
            Our typography system is built with modern web technologies and follows industry best practices 
            for performance, accessibility, and maintainability.
          </TypographyP>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <TypographyH4 className="mb-4">Font Loading Strategy</TypographyH4>
              <TypographyList className="mb-6">
                <TypographyListItem>Variable fonts for optimal performance</TypographyListItem>
                <TypographyListItem>Proper fallback stacks for system fonts</TypographyListItem>
                <TypographyListItem>Font display: swap for faster loading</TypographyListItem>
                <TypographyListItem>Preload critical font files</TypographyListItem>
              </TypographyList>
            </div>

            <div>
              <TypographyH4 className="mb-4">Accessibility Features</TypographyH4>
              <TypographyList className="mb-6">
                <TypographyListItem>WCAG AA+ contrast ratios (4.5:1 minimum)</TypographyListItem>
                <TypographyListItem>Scalable typography up to 200% zoom</TypographyListItem>
                <TypographyListItem>Proper focus indicators on interactive text</TypographyListItem>
                <TypographyListItem>Screen reader optimized heading hierarchy</TypographyListItem>
              </TypographyList>
            </div>

            <div>
              <TypographyH4 className="mb-4">Performance Optimization</TypographyH4>
              <TypographyList className="mb-6">
                <TypographyListItem>CSS custom properties for dynamic theming</TypographyListItem>
                <TypographyListItem>Minimal font feature usage for smaller bundles</TypographyListItem>
                <TypographyListItem>System font preferences respected</TypographyListItem>
                <TypographyListItem>Optimized for Core Web Vitals</TypographyListItem>
              </TypographyList>
            </div>

            <div>
              <TypographyH4 className="mb-4">Design Token Integration</TypographyH4>
              <TypographyList>
                <TypographyListItem>All values stored as CSS custom properties</TypographyListItem>
                <TypographyListItem>Semantic naming convention for clarity</TypographyListItem>
                <TypographyListItem>Easy integration with design tools</TypographyListItem>
                <TypographyListItem>Automatic dark mode support</TypographyListItem>
              </TypographyList>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}