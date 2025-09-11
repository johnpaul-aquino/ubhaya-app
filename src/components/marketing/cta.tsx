'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CTAAction {
  label: string;
  href: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
}

interface CTAProps {
  title: string;
  description?: string;
  actions?: CTAAction[];
  className?: string;
}

export function CTA({
  title,
  description,
  actions = [],
  className,
}: CTAProps) {
  return (
    <section className={cn('py-12 lg:py-20 bg-muted/50', className)}>
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
          {actions.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  asChild
                >
                  <a href={action.href}>{action.label}</a>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}