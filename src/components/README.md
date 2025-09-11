# UI Components Library

A comprehensive set of React UI components built following 21st.dev design system principles for the website boilerplate. All components are built with TypeScript, accessibility (WCAG AA+), and responsive design in mind.

## 🎨 Theme System

### ThemeProvider
Provides dark/light mode support with system preference detection.
```tsx
import { ThemeProvider } from '@/components'

<ThemeProvider>
  <App />
</ThemeProvider>
```

### ThemeToggle
A dropdown toggle for switching between light, dark, and system themes.
```tsx
import { ThemeToggle } from '@/components'

<ThemeToggle />
```

## 📐 Layout Components

### Container
Responsive container with configurable max-widths and padding.
```tsx
import { Container } from '@/components'

<Container maxWidth="lg" padding="md">
  Content goes here
</Container>
```

**Props:**
- `maxWidth`: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "default"
- `center`: boolean (default: true)
- `padding`: "none" | "sm" | "md" | "lg" | "xl"

### Section
Semantic section wrapper with consistent spacing and optional container.
```tsx
import { Section } from '@/components'

<Section spacing="lg" background="muted">
  <h2>Section Title</h2>
  <p>Section content</p>
</Section>
```

**Props:**
- `as`: HTML element (default: "section")
- `spacing`: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "default"
- `background`: "default" | "muted" | "accent" | "primary" | "transparent"
- `contained`: boolean (default: true)

### Header
Responsive header with navigation and mobile menu.
```tsx
import { Header } from '@/components'

<Header sticky={true} background="blur" />
```

**Props:**
- `sticky`: boolean (default: true)
- `border`: boolean (default: true)
- `background`: "solid" | "blur" | "transparent"

### Footer
Comprehensive footer with links, social media, and multiple variants.
```tsx
import { Footer } from '@/components'

<Footer variant="default" border={true} />
```

**Props:**
- `border`: boolean (default: true)
- `variant`: "default" | "minimal" | "extended"

## 🧩 UI Components

### Card
Flexible card component with header, content, and footer sections.
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Badge
Status indicators and labels with multiple variants.
```tsx
import { Badge } from '@/components'

<Badge variant="success" size="lg" interactive>
  New Feature
</Badge>
```

**Props:**
- `variant`: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"
- `size`: "default" | "sm" | "lg"
- `interactive`: boolean

### Alert
Contextual alerts with automatic icons and dismissible option.
```tsx
import { Alert, AlertTitle, AlertDescription, AlertSuccess } from '@/components'

<Alert variant="warning" dismissible>
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Please check your input.</AlertDescription>
</Alert>

// Convenience components
<AlertSuccess>Operation completed successfully</AlertSuccess>
```

**Props:**
- `variant`: "default" | "destructive" | "success" | "warning" | "info"
- `dismissible`: boolean
- `onDismiss`: () => void

### Dialog/Modal
Accessible modal dialogs with multiple sizes.
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, Modal } from '@/components'

// Using Dialog primitives
<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>

// Using Modal convenience component
<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="lg"
>
  <p>Modal content</p>
</Modal>
```

## 📝 Form Components

### Input
Enhanced input with icons, validation states, and password toggle.
```tsx
import { Input } from '@/components'

<Input
  placeholder="Enter text"
  leftIcon={<Search />}
  error="This field is required"
  showCounter
  maxLength={100}
/>
```

**Props:**
- `error`: string
- `success`: string
- `showCounter`: boolean
- `inputSize`: "sm" | "md" | "lg"
- `leftIcon`: React.ReactNode
- `rightIcon`: React.ReactNode

### Textarea
Auto-resizing textarea with validation and character counter.
```tsx
import { Textarea } from '@/components'

<Textarea
  placeholder="Enter description"
  autoResize
  minRows={3}
  maxRows={10}
  showCounter
  maxLength={500}
/>
```

### Select
Accessible select dropdown with validation states.
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components'

<Select>
  <SelectTrigger error="Please select an option">
    <SelectValue placeholder="Choose option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Checkbox
Feature-rich checkbox with labels, descriptions, and indeterminate state.
```tsx
import { Checkbox } from '@/components'

<Checkbox
  id="terms"
  label="Accept terms and conditions"
  description="By checking this, you agree to our terms"
  indeterminate={false}
  error="You must accept the terms"
/>
```

### RadioGroup
Radio button groups with labels and descriptions.
```tsx
import { RadioGroup, RadioGroupItem } from '@/components'

<RadioGroup error="Please select an option">
  <RadioGroupItem 
    id="option1" 
    value="1"
    label="Option 1"
    description="First option description"
  />
  <RadioGroupItem 
    id="option2" 
    value="2"
    label="Option 2"
    description="Second option description"
  />
</RadioGroup>
```

## 🧭 Navigation Components

### Navbar
Flexible navigation with dropdown menus and active state highlighting.
```tsx
import { Navbar, type NavItem } from '@/components'

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { 
    label: "Products", 
    children: [
      { label: "Web Apps", href: "/products/web", description: "Build web applications" },
      { label: "Mobile Apps", href: "/products/mobile", description: "Create mobile apps" }
    ]
  }
]

<Navbar items={navItems} highlightActive />
```

### MobileMenu
Sheet-based mobile navigation with collapsible sections.
```tsx
import { MobileMenu } from '@/components'

<MobileMenu 
  items={navItems}
  title="Navigation"
  description="Browse our site"
/>
```

### Breadcrumbs
Hierarchical navigation with truncation and home icon support.
```tsx
import { Breadcrumbs, useBreadcrumbs, type BreadcrumbItem } from '@/components'

const items: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Current Page", isCurrent: true }
]

<Breadcrumbs 
  items={items} 
  showHomeIcon 
  maxItems={3}
/>

// Auto-generate from pathname
const breadcrumbs = useBreadcrumbs(pathname, { 'products': 'Our Products' })
<Breadcrumbs items={breadcrumbs} />
```

## 🚀 Marketing Components

### Hero
Conversion-optimized hero sections with multiple variants.
```tsx
import { Hero } from '@/components'

<Hero
  title="Build Amazing Websites"
  description="Create beautiful, accessible websites with our component library"
  announcement="New v2.0 Released!"
  primaryAction={{ label: "Get Started", href: "/start" }}
  secondaryAction={{ label: "Learn More", href: "/docs" }}
  variant="centered"
  background="gradient"
  decorative
>
  <img src="/hero-image.png" alt="Product showcase" />
</Hero>
```

**Props:**
- `variant`: "default" | "centered" | "split"
- `background`: "default" | "gradient" | "pattern" | "image"
- `backgroundImage`: string

### Features
Showcase product features with multiple layout options.
```tsx
import { Features, type Feature } from '@/components'

const features: Feature[] = [
  {
    title: "Fast Performance",
    description: "Lightning-fast load times with optimized code",
    icon: <Zap className="w-6 h-6" />,
    badge: "New"
  }
]

<Features
  features={features}
  title="Why Choose Us"
  variant="cards"
  columns={3}
  showIcons
/>
```

**Props:**
- `variant`: "grid" | "list" | "cards" | "showcase"
- `columns`: 1 | 2 | 3 | 4

### CTA
Call-to-action sections for driving conversions.
```tsx
import { CTA } from '@/components'

<CTA
  title="Ready to Get Started?"
  description="Join thousands of satisfied customers"
  badge="Limited Time Offer"
  primaryAction={{ label: "Start Free Trial", href: "/signup" }}
  secondaryAction={{ label: "Contact Sales", href: "/contact" }}
  variant="card"
  background="primary"
  size="lg"
/>
```

**Props:**
- `variant`: "default" | "centered" | "banner" | "card"
- `background`: "default" | "primary" | "gradient" | "muted"
- `size`: "sm" | "md" | "lg"

### Testimonials
Social proof with customer testimonials and ratings.
```tsx
import { Testimonials, type Testimonial } from '@/components'

const testimonials: Testimonial[] = [
  {
    content: "This product changed our business completely.",
    author: "John Doe",
    title: "CEO",
    company: "Tech Corp",
    avatar: "/avatar.jpg",
    rating: 5,
    featured: true
  }
]

<Testimonials
  testimonials={testimonials}
  title="What Our Customers Say"
  variant="grid"
  columns={3}
  showRatings
/>
```

**Props:**
- `variant`: "grid" | "masonry" | "carousel" | "featured"
- `columns`: 1 | 2 | 3

### Pricing
Pricing tables with plan comparison and billing toggles.
```tsx
import { Pricing, type PricingPlan } from '@/components'

const plans: PricingPlan[] = [
  {
    name: "Starter",
    description: "Perfect for small projects",
    price: 29,
    period: "month",
    features: [
      "Up to 5 projects",
      "Basic support",
      { feature: "Advanced features", included: false }
    ],
    cta: { label: "Start Free Trial", href: "/signup" },
    popular: true
  }
]

<Pricing
  plans={plans}
  title="Choose Your Plan"
  showBillingToggle
  billingPeriod="monthly"
  onBillingChange={(period) => console.log(period)}
/>
```

## 🎯 Best Practices

### Accessibility
- All components follow WCAG AA+ standards
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility

### Performance
- Tree-shakable exports
- Optimized bundle size
- Minimal re-renders
- Lazy loading support

### Responsive Design
- Mobile-first approach
- Flexible grid systems
- Adaptive typography
- Touch-friendly interactions

### Type Safety
- Full TypeScript support
- Comprehensive prop interfaces
- Generic type support
- Strict type checking

## 📚 Usage Examples

Import individual components:
```tsx
import { Button, Card, Hero } from '@/components'
```

Import with types:
```tsx
import { Navbar, type NavItem } from '@/components'
```

Use with form libraries:
```tsx
import { useForm } from 'react-hook-form'
import { Input, Button, Alert } from '@/components'

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email', { required: 'Email is required' })}
        error={errors.email?.message}
        placeholder="Enter email"
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## 🔧 Customization

All components use CSS custom properties defined in your `globals.css` and can be customized through:

1. **Tailwind Configuration**: Extend `tailwind.config.ts`
2. **CSS Custom Properties**: Modify color tokens in `globals.css`
3. **Component Variants**: Use `class-variance-authority` for new variants
4. **Theme Customization**: Extend the theme provider configuration

## 🚀 Getting Started

1. Import the components you need
2. Wrap your app with `ThemeProvider`
3. Use components with TypeScript intellisense
4. Customize themes and variants as needed
5. Build amazing user experiences!

For more detailed documentation, visit our [Storybook](https://storybook.js.org) or check individual component files for comprehensive prop documentation.