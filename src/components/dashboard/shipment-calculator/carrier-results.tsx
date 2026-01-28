'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { NumberTicker } from '@/components/ui/number-ticker';
import { BlurFade } from '@/components/ui/blur-fade';
import { Truck, Clock, Check, Package } from 'lucide-react';
import type { CarrierQuote } from '@/types/dashboard';

interface CarrierResultsProps {
  quotes: CarrierQuote[];
  loading: boolean;
  onSelectQuote: (quote: CarrierQuote) => void;
  selectedQuoteId?: string;
}

// Carrier icons/logos mapping
const CARRIER_ICONS: Record<string, { bg: string; text: string }> = {
  dhl: { bg: 'bg-yellow-500', text: 'text-yellow-900' },
  fedex: { bg: 'bg-purple-500', text: 'text-white' },
  ups: { bg: 'bg-amber-700', text: 'text-white' },
  usps: { bg: 'bg-blue-600', text: 'text-white' },
};

/**
 * Carrier Results Component
 * Display shipping quotes from multiple carriers
 */
export function CarrierResults({
  quotes,
  loading,
  onSelectQuote,
  selectedQuoteId,
}: CarrierResultsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Carrier Quotes
          </CardTitle>
          <CardDescription>Calculating shipping rates...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (quotes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Carrier Quotes
          </CardTitle>
          <CardDescription>
            Enter shipment details and click calculate to get quotes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              No quotes yet. Fill in the form to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          Carrier Quotes
        </CardTitle>
        <CardDescription>
          {quotes.length} carrier{quotes.length !== 1 ? 's' : ''} available
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {quotes.map((quote, index) => {
          const carrierStyle = CARRIER_ICONS[quote.id] || {
            bg: 'bg-gray-500',
            text: 'text-white',
          };
          const isSelected = selectedQuoteId === quote.id;

          return (
            <BlurFade key={quote.id} delay={0.1 * index}>
              <div
                className={`relative rounded-lg border p-4 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary'
                    : 'hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Carrier Info */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${carrierStyle.bg} ${carrierStyle.text} font-bold text-sm`}
                    >
                      {quote.carrier.substring(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{quote.carrier}</div>
                      <div className="text-sm text-muted-foreground">
                        {quote.service}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      <span className="text-muted-foreground text-base mr-1">
                        {quote.currency}
                      </span>
                      <NumberTicker value={quote.cost} decimalPlaces={2} />
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {quote.deliveryDays} day{quote.deliveryDays !== 1 ? 's' : ''} &middot;{' '}
                      {quote.deliveryDate}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => onSelectQuote(quote)}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Selected
                      </>
                    ) : (
                      'Select'
                    )}
                  </Button>
                </div>

                {/* Best Price Badge */}
                {index === 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-green-500">
                    Best Price
                  </Badge>
                )}
              </div>
            </BlurFade>
          );
        })}
      </CardContent>
    </Card>
  );
}
