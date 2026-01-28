'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { MapPin, Package, RotateCcw, Calculator } from 'lucide-react';
import type { CalculatorFormData, WeightUnit, DimensionUnit } from '@/types/dashboard';

// Common countries for shipping
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CN', name: 'China' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'JP', name: 'Japan' },
  { code: 'FR', name: 'France' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'KR', name: 'South Korea' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
];

interface CalculatorFormProps {
  onCalculate: (data: CalculatorFormData) => void;
  isCalculating: boolean;
}

const initialFormData: CalculatorFormData = {
  originCity: '',
  originCountry: '',
  destCity: '',
  destCountry: '',
  weight: 1,
  weightUnit: 'kg',
  length: undefined,
  width: undefined,
  height: undefined,
  dimensionUnit: 'cm',
};

/**
 * Calculator Form Component
 * Input form for shipment details
 */
export function CalculatorForm({ onCalculate, isCalculating }: CalculatorFormProps) {
  const [formData, setFormData] = useState<CalculatorFormData>(initialFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  const updateField = <K extends keyof CalculatorFormData>(
    field: K,
    value: CalculatorFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    formData.originCity.trim() !== '' &&
    formData.originCountry !== '' &&
    formData.destCity.trim() !== '' &&
    formData.destCountry !== '' &&
    formData.weight > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Calculate Shipping
        </CardTitle>
        <CardDescription>
          Enter shipment details to get carrier quotes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Origin Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-green-500" />
              Origin
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="originCity">City</Label>
                <Input
                  id="originCity"
                  placeholder="e.g., Mumbai"
                  value={formData.originCity}
                  onChange={(e) => updateField('originCity', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originCountry">Country</Label>
                <Select
                  value={formData.originCountry}
                  onValueChange={(v) => updateField('originCountry', v)}
                >
                  <SelectTrigger id="originCountry">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Destination Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-red-500" />
              Destination
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="destCity">City</Label>
                <Input
                  id="destCity"
                  placeholder="e.g., Delhi"
                  value={formData.destCity}
                  onChange={(e) => updateField('destCity', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destCountry">Country</Label>
                <Select
                  value={formData.destCountry}
                  onValueChange={(v) => updateField('destCountry', v)}
                >
                  <SelectTrigger id="destCountry">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Package Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4 text-blue-500" />
              Package Details
            </div>

            {/* Weight */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.weight || ''}
                  onChange={(e) => updateField('weight', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightUnit">Unit</Label>
                <Select
                  value={formData.weightUnit}
                  onValueChange={(v) => updateField('weightUnit', v as WeightUnit)}
                >
                  <SelectTrigger id="weightUnit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-2">
              <Label>Dimensions (optional)</Label>
              <div className="grid grid-cols-4 gap-2">
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="L"
                  value={formData.length || ''}
                  onChange={(e) => updateField('length', parseFloat(e.target.value) || undefined)}
                />
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="W"
                  value={formData.width || ''}
                  onChange={(e) => updateField('width', parseFloat(e.target.value) || undefined)}
                />
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="H"
                  value={formData.height || ''}
                  onChange={(e) => updateField('height', parseFloat(e.target.value) || undefined)}
                />
                <Select
                  value={formData.dimensionUnit}
                  onValueChange={(v) => updateField('dimensionUnit', v as DimensionUnit)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="in">in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <ShimmerButton
              type="submit"
              disabled={!isFormValid || isCalculating}
              className="flex-1"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Rates'}
            </ShimmerButton>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isCalculating}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
