import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

// Typography component variants using the comprehensive type scale
const typographyVariants = cva('', {
  variants: {
    variant: {
      // Display variants - for hero sections and major headings
      'display-2xl': 'text-display-2xl font-display font-extrabold text-primary tracking-tighter',
      'display-xl': 'text-display-xl font-display font-bold text-primary tracking-tight',
      'display-lg': 'text-display-lg font-display font-semibold text-primary tracking-tight',
      'display-md': 'text-display-md font-heading font-semibold text-primary tracking-tight',
      'display-sm': 'text-display-sm font-heading font-medium text-primary',
      'display-xs': 'text-display-xs font-heading font-medium text-primary',
      
      // Semantic heading variants
      'h1': 'text-heading-1 font-heading font-bold text-primary tracking-tight',
      'h2': 'text-heading-2 font-heading font-semibold text-primary tracking-tight',
      'h3': 'text-heading-3 font-heading font-semibold text-primary tracking-tight',
      'h4': 'text-heading-4 font-heading font-medium text-primary',
      'h5': 'text-heading-5 font-heading font-medium text-primary',
      'h6': 'text-heading-6 font-heading font-medium text-primary',
      
      // Body text variants
      'body-2xl': 'text-body-2xl font-sans text-primary',
      'body-xl': 'text-body-xl font-sans text-primary',
      'body-lg': 'text-body-lg font-sans text-primary',
      'body-md': 'text-body-md font-sans text-primary',
      'body-sm': 'text-body-sm font-sans text-secondary',
      'body-xs': 'text-body-xs font-sans text-secondary',
      
      // Specialized text variants
      'lead': 'text-body-lg font-sans text-secondary font-normal',
      'large': 'text-lg font-sans font-medium text-primary',
      'small': 'text-sm font-sans text-secondary',
      'muted': 'text-sm font-sans text-muted-foreground',
      
      // UI element variants
      'caption': 'text-caption font-sans font-medium text-secondary uppercase tracking-wide',
      'overline': 'text-overline font-sans font-semibold text-secondary',
      'label-lg': 'text-label-lg font-sans font-medium text-primary',
      'label-md': 'text-label-md font-sans font-medium text-primary',
      'label-sm': 'text-label-sm font-sans font-medium text-secondary',
      
      // Code and technical text
      'code': 'text-sm font-mono bg-muted px-1.5 py-0.5 rounded-md text-code font-medium',
      'kbd': 'text-sm font-mono bg-muted border border-border px-2 py-1 rounded-md text-primary font-medium shadow-sm',
      
      // Inline text styles
      'link': 'text-link underline underline-offset-2 decoration-1 hover:text-link-hover hover:decoration-2 transition-all duration-200',
      'quote': 'text-body-lg font-serif italic text-secondary border-l-4 border-border pl-6 py-2',
    },
    
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
    
    color: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      tertiary: 'text-tertiary',
      muted: 'text-muted-foreground',
      inverse: 'text-inverse',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      info: 'text-info',
    }
  },
  defaultVariants: {
    variant: 'body-md',
    align: 'left',
  },
})

// Typography component props
export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType
  children: React.ReactNode
  balance?: boolean
  pretty?: boolean
  readable?: boolean
  href?: string
}

// Main Typography component
const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, align, weight, color, as, balance, pretty, readable, children, href, ...props }, ref) => {
    // Determine the appropriate HTML element based on variant
    const getDefaultElement = (variant: string) => {
      if (variant?.startsWith('h') && variant.length === 2) return variant
      if (variant?.startsWith('display')) return 'h1'
      if (variant === 'lead' || variant?.startsWith('body')) return 'p'
      if (variant === 'quote') return 'blockquote'
      if (variant === 'code') return 'code'
      if (variant === 'kbd') return 'kbd'
      if (variant === 'link') return href ? 'a' : 'span'
      if (variant === 'caption' || variant === 'overline') return 'span'
      if (variant?.startsWith('label')) return 'label'
      return 'p'
    }

    const Component = as || getDefaultElement(variant || 'body-md')
    
    const classes = cn(
      typographyVariants({ variant, align, weight, color }),
      {
        'text-balance': balance,
        'text-pretty': pretty,
        'text-readable': readable,
      },
      className
    )

    // Handle link-specific props
    const linkProps = Component === 'a' && href ? { href } : {}

    return (
      <Component
        className={classes}
        ref={ref}
        {...linkProps}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Typography.displayName = 'Typography'

// Convenience components for common use cases
const TypographyH1 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'as'>>(
  ({ className, ...props }, ref) => (
    <Typography ref={ref} as="h1" variant="h1" balance className={className} {...props} />
  )
)
TypographyH1.displayName = 'TypographyH1'

const TypographyH2 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'as'>>(
  ({ className, ...props }, ref) => (
    <Typography ref={ref} as="h2" variant="h2" balance className={className} {...props} />
  )
)
TypographyH2.displayName = 'TypographyH2'

const TypographyH3 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'as'>>(
  ({ className, ...props }, ref) => (
    <Typography ref={ref} as="h3" variant="h3" balance className={className} {...props} />
  )
)
TypographyH3.displayName = 'TypographyH3'

const TypographyH4 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant' | 'as'>>(
  ({ className, ...props }, ref) => (
    <Typography ref={ref} as="h4" variant="h4" className={className} {...props} />
  )
)
TypographyH4.displayName = 'TypographyH4'

const TypographyP = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant' | 'as'>>(
  ({ className, ...props }, ref) => (
    <Typography ref={ref} as="p" variant="body-md" pretty className={className} {...props} />
  )
)
TypographyP.displayName = 'TypographyP'

const TypographyLead = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant' | 'as'>>(
  ({ className, ...props }, ref) => (
    <Typography ref={ref} as="p" variant="lead" pretty className={className} {...props} />
  )
)
TypographyLead.displayName = 'TypographyLead'

const TypographyLarge = React.forwardRef<HTMLDivElement, Omit<TypographyProps, 'variant' | 'as'>>(
  ({ className, ...props }, ref) => (
    <Typography ref={ref} as="div" variant="large" className={className} {...props} />
  )
)
TypographyLarge.displayName = 'TypographyLarge'

const TypographySmall = React.forwardRef<HTMLElement, Omit<TypographyProps, 'variant' | 'as'>>(
  ({ className, ...props }, ref) => (
    <Typography ref={ref} as="small" variant="small" className={className} {...props} />
  )
)
TypographySmall.displayName = 'TypographySmall'

const TypographyMuted = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant' | 'as'>>(
  ({ className, ...props }, ref) => (
    <Typography ref={ref} as="p" variant="muted" className={className} {...props} />
  )
)
TypographyMuted.displayName = 'TypographyMuted'

const TypographyCode = React.forwardRef<HTMLElement, Omit<TypographyProps, 'variant' | 'as'>>(
  ({ className, ...props }, ref) => (
    <Typography ref={ref} as="code" variant="code" className={className} {...props} />
  )
)
TypographyCode.displayName = 'TypographyCode'

const TypographyBlockquote = React.forwardRef<HTMLQuoteElement, Omit<TypographyProps, 'variant' | 'as'>>(
  ({ className, ...props }, ref) => (
    <Typography ref={ref} as="blockquote" variant="quote" className={className} {...props} />
  )
)
TypographyBlockquote.displayName = 'TypographyBlockquote'

// List components with proper typography
const TypographyList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('my-6 ml-6 list-disc text-body-md text-primary', className)} {...props} />
  )
)
TypographyList.displayName = 'TypographyList'

const TypographyListItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('mt-2', className)} {...props} />
  )
)
TypographyListItem.displayName = 'TypographyListItem'

// Export all components
export {
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
  typographyVariants,
}

// Type exports
export type { TypographyProps }