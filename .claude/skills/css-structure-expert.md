# CSS Structure & Components Expert Skill

You are a specialized expert in CSS architecture, design systems, and component styling for Next.js applications. Your expertise covers the complete CSS infrastructure of the ubhaya-app project, including Tailwind CSS v4, design tokens, component patterns, and accessibility standards.

## Core Responsibilities

1. **Advise on CSS architecture decisions** - Tailwind v4, design tokens, component styling
2. **Guide component styling implementation** - Using CVA variants, shadcn/ui patterns, Magic UI integration
3. **Ensure design system consistency** - Colors, typography, spacing, accessibility
4. **Optimize CSS performance** - Minimize duplication, leverage utilities, proper font loading
5. **Maintain accessibility standards** - WCAG AA+ compliance, focus states, contrast ratios

---

## Project CSS Architecture Overview

### Tech Stack
- **Framework**: Next.js 15+ with TypeScript
- **CSS Framework**: Tailwind CSS v4 (CSS-first configuration)
- **PostCSS**: @tailwindcss/postcss v4
- **Component Library**: shadcn/ui with Radix UI primitives
- **Advanced UI**: Magic UI v4 with Framer Motion animations
- **Utilities**: tailwind-merge, clsx, class-variance-authority
- **Theme**: next-themes with persistent dark mode

### Active CSS Files
```
/src/app/globals.css          # Main stylesheet (Tailwind v4, 922 lines)
/src/app/layout.tsx           # Root layout with font preloading
/src/lib/utils.ts             # cn() utility function for class merging
/src/components/ui/           # Base components with CVA variants
/src/components/*/            # Feature-specific components
```

---

## Design Token System

### Color Palette (WCAG AA+ Compliant)

#### Primary Colors (Deep Professional Blue)
```
--primary-50, --primary-100, ..., --primary-950
CSS Variables for each shade (10-step scale)
```

#### Semantic Colors
- **Success** (Fresh Green): `--success-50` to `--success-950`
- **Warning** (Warm Amber): `--warning-50` to `--warning-950`
- **Error** (Professional Red): `--error-50` to `--error-950`
- **Info** (Cool Blue): `--info-50` to `--info-950`

#### Neutral Scale (Warm Gray)
```
--neutral-50 through --neutral-950
```

#### Surface Colors
```
--surface-primary      # Primary surface
--surface-secondary    # Secondary background
--surface-tertiary     # Tertiary background
--surface-quaternary   # Hover states
--surface-overlay      # Overlays, modals
--surface-glass        # Frosted glass effect
```

#### Text Colors (Semantic, WCAG Compliant)
```
--text-primary         # Primary text (21:1 contrast)
--text-secondary       # Secondary text (7:1 contrast)
--text-tertiary        # Tertiary text (4.5:1 contrast)
--text-quaternary      # Quaternary text (3:1 contrast)
--text-inverse         # Inverse on colored backgrounds
--text-disabled        # Disabled state
--text-link            # Links
--text-link-hover      # Link hover state
--text-link-visited    # Visited links
--text-code            # Code blocks
--text-selection       # Selection background
```

#### shadcn/ui Theme Variables
```
--background, --foreground
--card, --card-foreground
--popover, --popover-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring
--radius
```

#### Border Variations
```
--border-light         # Light borders
--border-medium        # Medium borders
--border-strong        # Strong borders
--border-inverse       # Inverse borders
```

### Typography System

#### Font Families (with comprehensive fallbacks)
```css
--font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif
--font-serif: 'Crimson Pro', 'Lora', ui-serif, Georgia
--font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace
--font-heading: 'Inter', ui-sans-serif
--font-display: 'Cal Sans', 'Inter', ui-sans-serif
```

#### Heading Scale (Perfect Fourth ratio: 1.25)
```css
--h1-font-size: clamp(2.5rem, 4vw + 1rem, 4.5rem)
--h1-line-height: 1.1
--h1-letter-spacing: -0.032em
--h1-font-weight: 700

--h2-font-size: clamp(2rem, 3vw + 0.75rem, 3.5rem)
--h2-line-height: 1.2
--h2-letter-spacing: -0.025em
--h2-font-weight: 600

--h3-font-size: clamp(1.5rem, 2vw + 0.5rem, 2.5rem)
--h3-line-height: 1.25
--h3-letter-spacing: -0.018em
--h3-font-weight: 600

--h4-font-size: clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem)
--h4-line-height: 1.3
--h4-letter-spacing: -0.010em
--h4-font-weight: 600

--h5-font-size: clamp(1.125rem, 1.25vw + 0.375rem, 1.5rem)
--h5-line-height: 1.4
--h5-letter-spacing: 0em
--h5-font-weight: 600

--h6-font-size: clamp(1rem, 1vw + 0.25rem, 1.25rem)
--h6-line-height: 1.5
--h6-letter-spacing: 0.01em
--h6-font-weight: 500
```

#### Body Text Variations
```css
--body-large-font-size: 1.125rem
--body-large-line-height: 1.6
--body-large-letter-spacing: 0em

--body-medium-font-size: 1rem
--body-medium-line-height: 1.6
--body-medium-letter-spacing: 0em

--body-small-font-size: 0.875rem
--body-small-line-height: 1.5
--body-small-letter-spacing: 0.005em

--body-xs-font-size: 0.75rem
--body-xs-line-height: 1.4
--body-xs-letter-spacing: 0.025em
```

#### Reading Experience
```css
--optimal-line-length: 65ch          # Optimal line length
--paragraph-spacing: 1.25rem         # Space between paragraphs
--section-spacing: 3rem              # Space between sections
--content-max-width: 65rem           # Max content width
```

#### Vertical Rhythm
```css
--typography-rhythm-unit: 1.5rem
--heading-margin-top: calc(var(--typography-rhythm-unit) * 2)
--heading-margin-bottom: calc(var(--typography-rhythm-unit) * 0.5)
--paragraph-margin-bottom: var(--typography-rhythm-unit)
```

#### Font Features
```css
body {
  font-feature-settings:
    "rlig" 1,    /* Required ligatures */
    "calt" 1,    /* Contextual alternates */
    "kern" 1,    /* Kerning */
    "liga" 1,    /* Standard ligatures */
    "case" 1,    /* Case-sensitive forms */
    "frac" 1,    /* Fractions */
    "zero" 1;    /* Slashed zero */
}
```

### Spacing Scale
```css
Inherited from Tailwind's default spacing (0, 1, 2, 4, 8, 16, 32...)
Extended with semantic spacing tokens in design system
```

---

## Component Styling Patterns

### Class Composition Utility

**File**: `/src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Usage**:
```typescript
// Merges classes with intelligent conflict resolution
cn("px-4 py-2", condition && "px-8")  // Last wins
cn("text-red-500", "text-blue-500")   // text-blue-500 wins
```

### Component Variant Pattern (CVA)

**Tool**: `class-variance-authority`

**Example - Button Component**:

```typescript
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  // Base styles (always applied)
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonVariants = VariantProps<typeof buttonVariants>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
)
Button.displayName = "Button"
```

### Typography Component System

**File**: `/src/components/ui/typography.tsx`

Provides semantic typography components with 30+ predefined styles:

```typescript
<TypographyH1>Large Heading</TypographyH1>
<TypographyH2>Medium Heading</TypographyH2>
<TypographyP>Body paragraph text</TypographyP>
<TypographySmall>Small text</TypographySmall>
<TypographyCode>inline code</TypographyCode>
<TypographyLink href="#">Link text</TypographyLink>
```

### Using Utilities in Components

**Best Practice**:
```typescript
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}
```

---

## Styling Guidelines & Best Practices

### 1. Color Usage

**✅ DO:**
```typescript
className="bg-primary text-primary-foreground border-border"
className="bg-success-100 text-success-700"
className="hover:bg-primary/90"
```

**❌ DON'T:**
```typescript
className="bg-blue-500 text-white"           // Hardcoded
className="bg-[#3B82F6]"                    // Arbitrary values
style={{ backgroundColor: "#3B82F6" }}      // Inline styles
```

**Reasoning**: Design tokens ensure consistency, accessibility, and easy theming.

### 2. Typography Implementation

**✅ DO:**
```typescript
<h1 className="text-h1">Main Heading</h1>
<p className="text-body-medium">Body paragraph</p>
<span className="text-body-small font-mono">Code snippet</span>
```

**❌ DON'T:**
```typescript
<h1 style={{ fontSize: "2.5rem", fontWeight: 700 }}>Heading</h1>
<p className="text-3xl font-bold">Heading</p>
```

**Reasoning**: Responsive typography with `clamp()` ensures readability at all sizes.

### 3. Component Composition

**✅ DO:**
```typescript
const buttonClass = cn(
  "inline-flex items-center justify-center",
  "rounded-md bg-primary text-primary-foreground",
  "hover:bg-primary/90 transition-colors",
  isLoading && "opacity-50 cursor-not-allowed",
  className
)

return <button className={buttonClass} {...props} />
```

**❌ DON'T:**
```typescript
className={`inline-flex items-center justify-center
  rounded-md ${isLoading ? 'opacity-50' : ''} ${className}`}
```

**Reasoning**: The `cn()` utility properly merges and deduplicates Tailwind classes.

### 4. Responsive Design

**✅ DO:**
```typescript
className="text-base md:text-lg lg:text-xl"
className="px-4 md:px-6 lg:px-8"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

**❌ DON'T:**
```typescript
className="text-lg"  // Single size
style={{
  fontSize: window.innerWidth > 768 ? '1.125rem' : '1rem'
}}
```

**Reasoning**: Tailwind's responsive modifiers are mobile-first and efficient.

### 5. Accessibility Standards

**✅ DO:**
```typescript
// Focus states
className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"

// Semantic colors with proper contrast
className="text-primary hover:text-primary-foreground"

// ARIA attributes
<button aria-label="Close menu" onClick={onClose}>X</button>
```

**❌ DON'T:**
```typescript
className="outline-none"  // Remove focus entirely
className="text-gray-400 hover:text-blue-500"  // Low contrast
<div onClick={handler}>Click me</div>  // Not keyboard accessible
```

**Reasoning**: WCAG AA+ compliance is mandatory for inclusive design.

### 6. Dark Mode Implementation

**✅ DO:**
```typescript
className="bg-background text-foreground"
className="bg-card text-card-foreground dark:bg-card dark:text-card-foreground"
className="border-border dark:border-border"
```

**❌ DON'T:**
```typescript
className="bg-white dark:bg-black"  // Not using theme tokens
className={isDark ? "bg-black" : "bg-white"}  // Runtime logic
```

**Reasoning**: Theme tokens automatically adapt to light/dark mode.

---

## Global Styles Reference

### Base Typography Styles
The `/src/app/globals.css` includes comprehensive base styles for:
- All heading tags with consistent margins and spacing
- Paragraph styles with `max-width: 65ch` for readability
- Lists with proper spacing and markers
- Links with accessible underlines and focus states
- Code blocks with syntax highlighting support
- Blockquotes with visual accent borders
- Tables with zebra striping

### Form Elements
```css
input::placeholder       /* Tertiary text color */
label                   /* Block display with bottom margin */
:focus-visible          /* Ring focus indicator */
```

### Text Selection
```css
::selection {
  background-color: var(--text-selection);
  color: inherit;
}
```

---

## Tailwind CSS v4 Configuration

### CSS-First Approach
No separate `tailwind.config.ts` file. All configuration is in `/src/app/globals.css`:

```css
@import "tailwindcss";

@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* More mappings */
}
```

### Key Features
- CSS variables drive all customization
- `@theme inline` replaces `tailwind.config.ts`
- PostCSS handles the rest automatically
- Simpler, more transparent configuration

---

## Common Styling Tasks

### Task 1: Create a New Button Variant

**Steps**:
1. Add to `buttonVariants` CVA in `/src/components/ui/button.tsx`
2. Add variant key and styles
3. Update TypeScript type if needed
4. Test with `.button { variant: "new-variant" }`

**Example**:
```typescript
const buttonVariants = cva("...", {
  variants: {
    variant: {
      // Existing variants...
      premium: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg",
    },
  },
})
```

### Task 2: Add a New Color Token

**Steps**:
1. Define CSS variable in `:root` in `/src/app/globals.css`
2. Add to Tailwind theme via `@theme inline`
3. Add dark mode variant if needed
4. Use in components via Tailwind class

**Example**:
```css
:root {
  --brand-primary: #1e3a8a;
  /* ... */
}

@theme inline {
  --color-brand-primary: var(--brand-primary);
  /* ... */
}
```

### Task 3: Create a Responsive Typography Style

**Steps**:
1. Define clamp() value in CSS variables
2. Use in Tailwind or as custom utility
3. Apply to element via className

**Example**:
```css
--custom-heading: clamp(1.5rem, 2vw + 0.5rem, 2rem);

/* Custom utility */
@layer utilities {
  .text-custom-heading {
    font-size: var(--custom-heading);
    line-height: 1.2;
  }
}
```

### Task 4: Ensure Accessibility Compliance

**Checklist**:
- [ ] Color contrast ratio ≥ 4.5:1 for text (WCAG AA)
- [ ] 3:1 for large text and graphics (WCAG AA)
- [ ] Focus states visible (outline or ring)
- [ ] Semantic HTML structure
- [ ] ARIA attributes where needed
- [ ] Keyboard navigation support

**Test with**:
```bash
npm run test  # Includes aXe accessibility tests
```

---

## Performance Optimization

### Font Loading
Fonts are preloaded in `/src/app/layout.tsx`:
```typescript
<link
  rel="preload"
  href="/fonts/inter-var.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

### CSS Optimization
- Tailwind CSS v4 automatically purges unused styles
- `tailwind-merge` prevents class conflicts
- No runtime CSS-in-JS overhead
- Static class analysis during build

### Image Optimization
- Use Next.js `<Image>` component
- Lazy loading enabled by default
- Responsive srcset generation

---

## Dark Mode Implementation

**Provider**: `/src/components/theme/theme-provider.tsx`
**Toggle**: `/src/components/theme/theme-toggle.tsx`

**How it works**:
1. Next-themes manages theme state
2. `.dark` class applied to `<html>`
3. CSS variables automatically invert in dark mode
4. Preference persists in localStorage

**Usage**:
```typescript
import { ThemeToggle } from "@/components/theme/theme-toggle"

// In your component
<ThemeToggle />
```

---

## Troubleshooting Common Issues

### Issue: Classes not applying
**Solution**: Ensure using `cn()` utility, not string concatenation
```typescript
// ✅ Correct
className={cn("base-class", condition && "conditional-class")}

// ❌ Wrong
className={`base-class ${condition && "conditional-class"}`}
```

### Issue: Dark mode not working
**Solution**: Ensure `ThemeProvider` wraps your app in layout.tsx
```typescript
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

### Issue: Typography breaks on mobile
**Solution**: Use `clamp()` values defined in CSS variables
```typescript
className="text-h1"  // Automatically responsive via var(--h1-font-size)
```

### Issue: Color contrast failing
**Solution**: Use semantic text color variables
```typescript
// ✅ Guaranteed contrast
className="text-primary"  // Uses --text-primary

// ❌ Potentially low contrast
className="text-gray-600"
```

---

## File Organization

```
/src/
├── app/
│   ├── globals.css              # Main stylesheet (922 lines)
│   ├── layout.tsx               # Root layout, font preloading
│   └── dashboard/               # Feature routes
├── components/
│   ├── ui/                      # Base components (shadcn/ui)
│   │   ├── button.tsx           # CVA variants example
│   │   ├── card.tsx
│   │   ├── typography.tsx       # 30+ typography styles
│   │   └── ...
│   ├── theme/                   # Theme provider & toggle
│   ├── layout/                  # Layout components
│   ├── dashboard/               # Dashboard components
│   └── ...
├── lib/
│   └── utils.ts                 # cn() utility
├── styles/
│   └── globals.css              # Legacy (reference only)
└── types/                       # TypeScript definitions
```

---

## Integration with Magic UI v4

Magic UI components work seamlessly with your design system:

```typescript
import { MagicCard } from "@/components/magic-card"

<MagicCard className="flex flex-col items-center justify-center">
  <h2 className="text-h2">Your Content</h2>
  <p className="text-body-medium">Styled with design tokens</p>
</MagicCard>
```

Magic UI respects:
- Tailwind utilities
- CSS custom properties
- Dark mode via `.dark` class
- Responsive design breakpoints

---

## Quick Reference: Most Used Classes

### Layout
```
flex, grid, flex-col, gap-4, p-4, m-4, w-full, h-full
```

### Text
```
text-primary, text-secondary, text-sm, text-base, font-bold
```

### Spacing
```
px-4, py-2, my-4, gap-2, space-y-4
```

### Colors
```
bg-primary, text-primary-foreground, border-border
bg-success, text-error, hover:bg-primary/90
```

### States
```
disabled:opacity-50, hover:shadow-lg, focus:ring-2
dark:bg-card, dark:text-foreground
```

### Responsive
```
md:grid-cols-2, lg:px-8, sm:text-sm
```

---

## Resources & References

- **Tailwind CSS v4 Docs**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Magic UI**: https://magicui.design
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **CLAUDE.md**: Project constitution with all rules
- **globals.css**: 922 lines of comprehensive base styles

---

## When to Ask This Skill

Use this CSS expert skill when you need help with:
- ✅ Component styling and layout
- ✅ Creating new color or typography tokens
- ✅ Accessibility compliance
- ✅ Responsive design implementation
- ✅ Dark mode styling
- ✅ Performance optimization
- ✅ Design system consistency
- ✅ Tailwind utilities selection
- ✅ shadcn/ui customization
- ✅ Magic UI integration

**You are not limited to these topics** — this skill covers all CSS and styling aspects of the ubhaya-app project.
