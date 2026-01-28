'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BlurFade } from '@/components/ui/blur-fade';
import {
  History,
  MoreHorizontal,
  Share2,
  Trash2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import type { ShipmentCalculation } from '@/types/dashboard';

interface SavedCalculationsProps {
  calculations: ShipmentCalculation[];
  onReuse: (calculation: ShipmentCalculation) => void;
  onShare: (calculation: ShipmentCalculation) => void;
  onDelete: (id: string) => void;
}

/**
 * Saved Calculations Component
 * Display history of saved shipment calculations
 */
export function SavedCalculations({
  calculations,
  onReuse,
  onShare,
  onDelete,
}: SavedCalculationsProps) {
  if (calculations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Saved Calculations
          </CardTitle>
          <CardDescription>
            Your saved shipping calculations will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              No saved calculations yet. Select a carrier quote to save.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <BlurFade delay={0.3}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Saved Calculations
          </CardTitle>
          <CardDescription>
            {calculations.length} saved calculation{calculations.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculations.map((calc) => (
                  <TableRow key={calc.id}>
                    <TableCell className="font-medium">
                      {calc.name || 'Untitled'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground">
                          {calc.originCity}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>{calc.destCity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {calc.weight} {calc.weightUnit}
                    </TableCell>
                    <TableCell>
                      {calc.selectedCarrier ? (
                        <Badge variant="secondary">
                          {calc.selectedCarrier}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {calc.estimatedCost ? (
                        <span>
                          {calc.currency} {calc.estimatedCost.toFixed(2)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {calc.estimatedDays ? (
                        <span>
                          {calc.estimatedDays} day{calc.estimatedDays !== 1 ? 's' : ''}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onReuse(calc)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reuse
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onShare(calc)}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(calc.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </BlurFade>
  );
}
