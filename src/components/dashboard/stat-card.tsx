'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { NumberTicker } from '@/components/ui/number-ticker';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down';
    label: string;
  };
  icon?: React.ReactNode;
  className?: string;
  animated?: boolean;
  prefix?: string;
  suffix?: string;
}

/**
 * Stat Card Component
 * Displays key metrics with optional trend indicator
 */
export function StatCard({
  label,
  value,
  change,
  icon,
  className,
  animated = true,
  prefix = '',
  suffix = '',
}: StatCardProps) {
  const trendIcon = change?.direction === 'up' ? (
    <TrendingUp className="h-3 w-3" />
  ) : (
    <TrendingDown className="h-3 w-3" />
  );

  const trendColor =
    change?.direction === 'up' ? 'text-success' : 'text-destructive';

  // Check if value is numeric for animation
  const isNumeric = typeof value === 'number' || /^\d+([.,]\d+)?$/.test(String(value));
  const numericValue = isNumeric ? parseFloat(String(value).replace(/,/g, '')) : 0;

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-lg', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && (
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary transition-transform hover:scale-110">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="text-2xl md:text-3xl font-bold">
            {animated && isNumeric ? (
              <>
                {prefix}
                <NumberTicker
                  value={numericValue}
                  className="inline-block"
                  delay={0.5}
                />
                {suffix}
              </>
            ) : (
              value
            )}
          </div>
          {change && (
            <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
              {trendIcon}
              <span>
                {change.direction === 'up' ? '↑' : '↓'} {change.value}{' '}
                {change.label}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
