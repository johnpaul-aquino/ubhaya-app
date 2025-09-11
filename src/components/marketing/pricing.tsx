'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  popular?: boolean;
  cta: {
    text: string;
    href: string;
  };
}

interface PricingProps {
  plans: PricingPlan[];
  billing?: 'monthly' | 'yearly' | 'project';
  showBillingToggle?: boolean;
  className?: string;
}

export function Pricing({
  plans,
  billing = 'monthly',
  showBillingToggle = true,
  className,
}: PricingProps) {
  return (
    <section className={cn('py-12 lg:py-20', className)}>
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                'relative p-8',
                plan.popular && 'border-primary shadow-lg scale-105'
              )}
            >
              {plan.popular && (
                <Badge
                  variant="default"
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                >
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-muted-foreground">{plan.description}</p>
                
                <div className="mt-6">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="ml-2 text-muted-foreground">/{plan.interval}</span>
                  </div>
                </div>

                <Button
                  className="mt-6 w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  <a href={plan.cta.href}>{plan.cta.text}</a>
                </Button>
              </div>

              <div className="mt-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}