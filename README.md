# 🚀 Next.js Headless Website Boilerplate

A professional, production-ready Next.js boilerplate designed specifically for freelance web developers and agencies. Built with modern web technologies, accessibility in mind, and optimized for headless CMS integration.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)
![React](https://img.shields.io/badge/React-19-61dafb)

## ✨ Features

### 🎨 **Design System**
- **Professional Color Palette** - WCAG AA+ compliant color system
- **Typography Scale** - Fluid, responsive typography with perfect ratios
- **Component Library** - 25+ accessible, reusable UI components
- **Dark Mode** - Persistent theme switching with system preference detection

### 🏗️ **Architecture**
- **Headless CMS Ready** - Supports Sanity, Contentful, Strapi out of the box
- **ISR Implementation** - Incremental Static Regeneration with smart caching
- **Type Safe** - Full TypeScript implementation with comprehensive types
- **API Routes** - RESTful API with caching and webhook support

### 🔍 **SEO & Performance**
- **Advanced SEO** - Dynamic metadata, Open Graph, Twitter Cards
- **Structured Data** - JSON-LD for rich snippets and better search results
- **Performance First** - Optimized images, fonts, and Core Web Vitals
- **Accessibility** - WCAG AA+ compliance with comprehensive testing

### 🛠️ **Developer Experience**
- **Modern Tooling** - ESLint, Prettier, Husky, Commitlint
- **Testing Setup** - Jest, React Testing Library, Accessibility testing
- **CI/CD Ready** - GitHub Actions workflows and deployment configs
- **Documentation** - Comprehensive docs and examples

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johnpaul-aquino/nextjs-boilerplate.git
   cd nextjs-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📚 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (marketing)/     # Marketing pages
│   │   ├── blog/           # Blog functionality
│   │   ├── api/            # API routes
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/            # Base UI components
│   │   ├── layout/        # Layout components
│   │   ├── marketing/     # Marketing components
│   │   ├── navigation/    # Navigation components
│   │   └── seo/          # SEO components
│   ├── lib/               # Utilities and configuration
│   │   ├── cms/          # CMS abstraction layer
│   │   ├── seo/          # SEO utilities
│   │   └── types/        # TypeScript definitions
│   └── styles/           # Additional styles
├── docs/                 # Documentation
├── public/              # Static assets
└── tests/              # Test files
```

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode

# Git Hooks
npm run prepare      # Setup Husky hooks
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Your Site Name"

# CMS Configuration (choose one)
CMS_PROVIDER=sanity  # sanity | contentful | strapi

# Sanity
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### CMS Setup

#### Sanity
1. Create a Sanity project at [sanity.io](https://sanity.io)
2. Add your project ID and API token to `.env.local`
3. Run `npm run cms:setup` to configure schemas

#### Contentful
1. Create a space at [contentful.com](https://contentful.com)
2. Add your space ID and access tokens to `.env.local`
3. Import content models from `/docs/contentful-models.json`

#### Strapi
1. Set up a Strapi instance
2. Add your API URL and token to `.env.local`
3. Configure content types as per `/docs/strapi-config.md`

## 🎨 Customization

### Colors
Edit `/src/styles/globals.css` to customize the color palette:

```css
:root {
  --primary-50: 240 249 255;
  --primary-500: 59 130 246;
  --primary-950: 23 37 84;
}
```

### Typography
Modify `/tailwind.config.ts` to adjust the typography scale:

```typescript
fontSize: {
  'xs': ['0.75rem', { lineHeight: '1rem' }],
  'sm': ['0.875rem', { lineHeight: '1.25rem' }],
  // ... your custom sizes
}
```

### Components
All components are in `/src/components/` and can be customized. They're built with:
- **Accessibility first** - ARIA labels, keyboard navigation
- **Responsive design** - Mobile-first approach
- **Type safety** - Full TypeScript support

## 📱 Responsive Breakpoints

```css
sm:   640px  /* Small devices */
md:   768px  /* Medium devices */
lg:   1024px /* Large devices */
xl:   1280px /* Extra large devices */
2xl:  1536px /* 2X Extra large devices */
```

## ♿ Accessibility

This boilerplate follows WCAG AA+ guidelines:

- ✅ **Color Contrast** - 4.5:1 minimum ratio
- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **Screen Readers** - Proper ARIA labels and semantic HTML
- ✅ **Focus Management** - Visible focus indicators
- ✅ **Alternative Text** - Image descriptions

Test accessibility with:
```bash
npm run test:a11y  # Run accessibility tests
```

## 🧪 Testing

### Unit Tests
```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode
```

### Accessibility Tests
```bash
npm run test:a11y   # Test accessibility compliance
```

### Performance Tests
```bash
npm run lighthouse  # Run Lighthouse audit
```

## 📈 Performance

### Core Web Vitals Optimizations
- **Largest Contentful Paint (LCP)** - Optimized images and fonts
- **First Input Delay (FID)** - Minimal JavaScript execution
- **Cumulative Layout Shift (CLS)** - Stable layouts and image dimensions

### Bundle Analysis
```bash
npm run analyze     # Analyze bundle size
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy `/out` folder
3. Configure environment variables

### Custom Server
```bash
npm run build
npm run start
```

## 📊 SEO Features

### Metadata
- Dynamic page titles and descriptions
- Open Graph and Twitter Card tags
- Canonical URLs
- Robots directives

### Structured Data
- Article schema for blog posts
- Organization schema
- Breadcrumb navigation
- FAQ and How-to schemas

### Sitemap & Robots
- Auto-generated XML sitemap
- Image sitemap
- Dynamic robots.txt

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention
This project follows [Conventional Commits](https://conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code formatting
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Maintenance tasks

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Radix UI](https://radix-ui.com/) - Primitive components
- [Lucide React](https://lucide.dev/) - Icon library

## 📞 Support

- 📧 **Email**: support@yourwebsite.com
- 💬 **Discord**: [Join our community](https://discord.gg/your-server)
- 🐛 **Issues**: [GitHub Issues](https://github.com/johnpaul-aquino/nextjs-boilerplate/issues)
- 📖 **Docs**: [Full Documentation](https://docs.yourwebsite.com)

---

Made with ❤️ for the developer community. Star ⭐ this repository if it helped you!

## 🔗 Links

- [Live Demo](https://website-boilerplate-demo.vercel.app)
- [Documentation](https://docs.yourwebsite.com)
- [Component Library](https://storybook.yourwebsite.com)
- [Changelog](CHANGELOG.md)