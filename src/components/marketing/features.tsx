'use client';

import { cn } from '@/lib/utils';

interface FeatureItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface FeaturesProps {
  id?: string;
  title?: string;
  subtitle?: string;
  features: FeatureItem[];
  variant?: 'grid' | 'list';
  className?: string;
}

export function Features({
  id,
  title,
  subtitle,
  features,
  variant = 'grid',
  className,
}: FeaturesProps) {
  return (
    <section id={id} className={cn('py-12 lg:py-20', className)}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={cn(
          variant === 'grid' 
            ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
            : 'space-y-6'
        )}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col p-6 bg-card rounded-lg border"
            >
              {feature.icon && (
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  {feature.icon}
                </div>
              )}
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}