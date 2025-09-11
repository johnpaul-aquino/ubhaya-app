import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Components Showcase | Website Boilerplate',
  description: 'Explore all the beautiful, accessible UI components included in our Next.js website boilerplate.',
};

export default function ComponentsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Components Showcase
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore all the beautiful, accessible UI components included in our website boilerplate. 
            Each component is built with accessibility, performance, and developer experience in mind.
          </p>
        </div>

        {/* Typography Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Typography</h2>
          <div className="bg-card border rounded-lg p-8">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold">Heading 1 - Main Page Title</h1>
              <h2 className="text-3xl font-bold">Heading 2 - Section Title</h2>
              <h3 className="text-2xl font-semibold">Heading 3 - Subsection Title</h3>
              <p className="text-xl font-medium text-foreground">
                This is a lead paragraph. Perfect for introductions and important information that needs to stand out.
              </p>
              <p className="text-base">
                This is a regular paragraph. It's designed for optimal readability with proper line height, 
                letter spacing, and color contrast. The text flows naturally and is comfortable to read 
                on all devices.
              </p>
              <p className="text-sm text-muted-foreground">
                This is muted text, perfect for secondary information, captions, and supporting details.
              </p>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Buttons</h2>
          <div className="bg-card border rounded-lg p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Button Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Primary
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
                    Secondary
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                    Outline
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-primary underline-offset-4 hover:underline">
                    Link
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Button Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Small
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Default
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90">
                    Large
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Cards</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Simple Card</h3>
              <p className="text-muted-foreground">
                This is a simple card with just content. Perfect for basic information display.
              </p>
            </div>

            <div className="bg-card border rounded-lg">
              <div className="p-6 pb-4">
                <h3 className="text-xl font-semibold mb-3">Card with Footer</h3>
                <p className="text-muted-foreground">
                  This card has a separate footer area for actions or additional information.
                </p>
              </div>
              <div className="px-6 py-4 border-t">
                <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Learn More
                </button>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                  Featured
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Featured Card</h3>
              <p className="text-muted-foreground mb-4">
                This card includes a badge and call-to-action button.
              </p>
              <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                Get Started
              </button>
            </div>
          </div>
        </section>

        {/* Form Elements Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Form Elements</h2>
          <div className="bg-card border rounded-lg p-8">
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium leading-none">
                    Name
                  </label>
                  <input
                    id="name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium leading-none">
                  Message
                </label>
                <textarea
                  id="message"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Enter your message..."
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Submit Form
              </button>
            </form>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Color Palette</h2>
          <div className="bg-card border rounded-lg p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-4">Primary Colors</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-10 bg-primary rounded border"></div>
                    <span className="text-sm">Primary</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-10 bg-secondary rounded border"></div>
                    <span className="text-sm">Secondary</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-10 bg-accent rounded border"></div>
                    <span className="text-sm">Accent</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Semantic Colors</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-10 bg-green-500 rounded border"></div>
                    <span className="text-sm">Success</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-10 bg-yellow-500 rounded border"></div>
                    <span className="text-sm">Warning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-10 bg-red-500 rounded border"></div>
                    <span className="text-sm">Error</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-10 bg-blue-500 rounded border"></div>
                    <span className="text-sm">Info</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Use</h2>
          <p className="text-lg text-muted-foreground mb-8">
            This component library is ready to use in your projects. All components are 
            accessible, responsive, and follow modern design principles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Back to Home
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Learn More
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}