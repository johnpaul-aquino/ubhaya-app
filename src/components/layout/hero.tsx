/**
 * Hero Component - Reusable hero section
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeroProps {
  title: string
  description?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  backgroundImage?: string
  className?: string
}

export function Hero({
  title,
  description,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  backgroundImage,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        'relative flex items-center justify-center px-4 py-24 text-center md:py-32 lg:py-40',
        backgroundImage && 'bg-cover bg-center bg-no-repeat',
        className
      )}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {/* Overlay for background image */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      )}
      
      <div className="relative z-10 mx-auto max-w-4xl">
        <h1 className={cn(
          'mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl',
          backgroundImage && 'text-white'
        )}>
          {title}
        </h1>
        
        {description && (
          <p className={cn(
            'mb-8 text-xl leading-relaxed text-muted-foreground',
            backgroundImage && 'text-gray-100'
          )}>
            {description}
          </p>
        )}
        
        {(ctaText || secondaryCtaText) && (
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            {ctaText && ctaHref && (
              <Button asChild size="lg">
                <Link href={ctaHref}>
                  {ctaText}
                </Link>
              </Button>
            )}
            
            {secondaryCtaText && secondaryCtaHref && (
              <Button asChild variant="outline" size="lg">
                <Link href={secondaryCtaHref}>
                  {secondaryCtaText}
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}