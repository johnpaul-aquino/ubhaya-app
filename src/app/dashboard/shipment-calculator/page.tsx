'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { CalculatorForm } from '@/components/dashboard/shipment-calculator/calculator-form';
import { CarrierResults } from '@/components/dashboard/shipment-calculator/carrier-results';
import { SavedCalculations } from '@/components/dashboard/shipment-calculator/saved-calculations';
import { BlurFade } from '@/components/ui/blur-fade';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Package } from 'lucide-react';
import { toast } from 'sonner';
import type {
  CalculatorFormData,
  CarrierQuote,
  ShipmentCalculation,
} from '@/types/dashboard';

// Mock carrier data for Phase 1
const MOCK_CARRIERS = [
  { id: 'dhl', name: 'DHL Express', baseRate: 15, perKg: 2.5, baseDays: 3 },
  { id: 'fedex', name: 'FedEx Ground', baseRate: 12, perKg: 2.0, baseDays: 5 },
  { id: 'ups', name: 'UPS Standard', baseRate: 10, perKg: 1.8, baseDays: 4 },
  { id: 'usps', name: 'USPS Priority', baseRate: 8, perKg: 1.5, baseDays: 7 },
];

const STORAGE_KEY = 'shipment-calculations';

/**
 * Generate mock carrier quotes based on form data
 */
function generateMockQuotes(formData: CalculatorFormData): CarrierQuote[] {
  // Convert weight to kg if needed
  let weightKg = formData.weight;
  if (formData.weightUnit === 'lbs') {
    weightKg = formData.weight * 0.453592;
  }

  // Calculate dimensional weight if dimensions provided
  let dimWeight = 0;
  if (formData.length && formData.width && formData.height) {
    let volume = formData.length * formData.width * formData.height;
    // Convert to cm if in inches
    if (formData.dimensionUnit === 'in') {
      volume = volume * 16.387; // cubic inches to cubic cm
    }
    // DIM factor typically 5000 for international
    dimWeight = volume / 5000;
  }

  // Use greater of actual or dimensional weight
  const chargeableWeight = Math.max(weightKg, dimWeight);

  // Determine if international (affects pricing)
  const isInternational = formData.originCountry !== formData.destCountry;
  const intlMultiplier = isInternational ? 2.5 : 1;

  // Calculate delivery date
  const today = new Date();

  return MOCK_CARRIERS.map((carrier) => {
    const cost =
      (carrier.baseRate + carrier.perKg * chargeableWeight) * intlMultiplier;
    const deliveryDays = carrier.baseDays + (isInternational ? 2 : 0);
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);

    return {
      id: carrier.id,
      carrier: carrier.name,
      cost: Math.round(cost * 100) / 100,
      currency: '$',
      deliveryDays,
      deliveryDate: deliveryDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      service: isInternational ? 'International' : 'Domestic',
    };
  }).sort((a, b) => a.cost - b.cost);
}

/**
 * Shipment Calculator Page
 * Calculate shipping costs across multiple carriers
 */
export default function ShipmentCalculatorPage() {
  // State
  const [quotes, setQuotes] = useState<CarrierQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<CarrierQuote | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState<ShipmentCalculation[]>([]);
  const [currentFormData, setCurrentFormData] = useState<CalculatorFormData | null>(null);

  // Save dialog state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

  // Load saved calculations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedCalculations(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse saved calculations:', e);
      }
    }
  }, []);

  // Save to localStorage when calculations change
  useEffect(() => {
    if (savedCalculations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCalculations));
    }
  }, [savedCalculations]);

  // Handle calculate
  const handleCalculate = useCallback((formData: CalculatorFormData) => {
    setIsCalculating(true);
    setCurrentFormData(formData);
    setSelectedQuote(null);

    // Simulate API delay
    setTimeout(() => {
      const newQuotes = generateMockQuotes(formData);
      setQuotes(newQuotes);
      setIsCalculating(false);
      toast.success(`Found ${newQuotes.length} carrier options`);
    }, 800);
  }, []);

  // Handle quote selection
  const handleSelectQuote = useCallback(
    (quote: CarrierQuote) => {
      setSelectedQuote(quote);
      setSaveDialogOpen(true);
    },
    []
  );

  // Handle save calculation
  const handleSaveCalculation = useCallback(() => {
    if (!currentFormData || !selectedQuote) return;

    const newCalculation: ShipmentCalculation = {
      id: crypto.randomUUID(),
      name: saveName.trim() || undefined,
      originCity: currentFormData.originCity,
      originCountry: currentFormData.originCountry,
      destCity: currentFormData.destCity,
      destCountry: currentFormData.destCountry,
      weight: currentFormData.weight,
      weightUnit: currentFormData.weightUnit,
      length: currentFormData.length,
      width: currentFormData.width,
      height: currentFormData.height,
      dimensionUnit: currentFormData.dimensionUnit,
      selectedCarrier: selectedQuote.carrier,
      estimatedCost: selectedQuote.cost,
      currency: selectedQuote.currency,
      estimatedDays: selectedQuote.deliveryDays,
      authorId: 'current-user', // Will be replaced with actual user ID
      visibility: 'PRIVATE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSavedCalculations((prev) => [newCalculation, ...prev]);
    setSaveDialogOpen(false);
    setSaveName('');
    toast.success('Calculation saved!');
  }, [currentFormData, selectedQuote, saveName]);

  // Handle reuse calculation
  const handleReuseCalculation = useCallback((calc: ShipmentCalculation) => {
    // For now, just show a toast - in future, this could pre-fill the form
    toast.info('Reuse feature coming soon!');
  }, []);

  // Handle share calculation
  const handleShareCalculation = useCallback((calc: ShipmentCalculation) => {
    // For now, just show a toast - backend integration needed
    toast.info('Share feature will be available in the next update');
  }, []);

  // Handle delete calculation
  const handleDeleteCalculation = useCallback((id: string) => {
    setSavedCalculations((prev) => prev.filter((c) => c.id !== id));
    toast.success('Calculation deleted');
  }, []);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <BlurFade delay={0.1} inView>
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Shipment Calculator</h1>
          </div>
          <p className="text-muted-foreground">
            Calculate shipping costs across multiple carriers and compare rates
          </p>
        </div>
      </BlurFade>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Calculator Form */}
        <BlurFade delay={0.2} inView>
          <CalculatorForm
            onCalculate={handleCalculate}
            isCalculating={isCalculating}
          />
        </BlurFade>

        {/* Carrier Results */}
        <BlurFade delay={0.3} inView>
          <CarrierResults
            quotes={quotes}
            loading={isCalculating}
            onSelectQuote={handleSelectQuote}
            selectedQuoteId={selectedQuote?.id}
          />
        </BlurFade>
      </div>

      {/* Saved Calculations */}
      <SavedCalculations
        calculations={savedCalculations}
        onReuse={handleReuseCalculation}
        onShare={handleShareCalculation}
        onDelete={handleDeleteCalculation}
      />

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Save Calculation
            </DialogTitle>
            <DialogDescription>
              Give this calculation a name to save it for later reference.
            </DialogDescription>
          </DialogHeader>

          {selectedQuote && (
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{selectedQuote.carrier}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedQuote.service} &middot; {selectedQuote.deliveryDays} days
                  </div>
                </div>
                <div className="text-xl font-bold">
                  {selectedQuote.currency}{selectedQuote.cost.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="calcName">Name (optional)</Label>
            <Input
              id="calcName"
              placeholder="e.g., Order #12345"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCalculation}>
              Save Calculation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
