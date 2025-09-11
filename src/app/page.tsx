export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Next.js Website Boilerplate
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A professional, production-ready boilerplate for modern web development. 
            Built with Next.js 15, TypeScript, TailwindCSS, and headless CMS integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/about"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Learn More
            </a>
            <a
              href="/components"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              View Components
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A comprehensive foundation for your next project
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col p-8 bg-card rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Modern Stack</h3>
              <p className="text-muted-foreground">
                Built with Next.js 15, TypeScript, and TailwindCSS for a modern development experience.
              </p>
            </div>

            <div className="flex flex-col p-8 bg-card rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Headless CMS</h3>
              <p className="text-muted-foreground">
                Supports Sanity, Contentful, and Strapi out of the box with a flexible abstraction layer.
              </p>
            </div>

            <div className="flex flex-col p-8 bg-card rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">SEO Optimized</h3>
              <p className="text-muted-foreground">
                Advanced SEO components with structured data, Open Graph, and performance optimization.
              </p>
            </div>

            <div className="flex flex-col p-8 bg-card rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Accessibility First</h3>
              <p className="text-muted-foreground">
                WCAG AA+ compliant components with comprehensive accessibility features.
              </p>
            </div>

            <div className="flex flex-col p-8 bg-card rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Developer Experience</h3>
              <p className="text-muted-foreground">
                Complete tooling setup with ESLint, Prettier, testing, and Git hooks.
              </p>
            </div>

            <div className="flex flex-col p-8 bg-card rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Production Ready</h3>
              <p className="text-muted-foreground">
                Optimized for performance with ISR, image optimization, and Core Web Vitals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your next project with this comprehensive boilerplate and save weeks of setup time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}