'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ThemeTestPage() {
  const colors = [
    { name: 'Primary', className: 'bg-primary text-primary-foreground' },
    { name: 'Secondary', className: 'bg-secondary text-secondary-foreground' },
    { name: 'Accent', className: 'bg-accent text-accent-foreground' },
    { name: 'Destructive', className: 'bg-destructive text-destructive-foreground' },
    { name: 'Muted', className: 'bg-muted text-muted-foreground' },
    { name: 'Card', className: 'bg-card text-card-foreground border' },
  ];

  const chartColors = [
    { name: 'Chart 1', style: { backgroundColor: 'var(--chart-1)' } },
    { name: 'Chart 2', style: { backgroundColor: 'var(--chart-2)' } },
    { name: 'Chart 3', style: { backgroundColor: 'var(--chart-3)' } },
    { name: 'Chart 4', style: { backgroundColor: 'var(--chart-4)' } },
    { name: 'Chart 5', style: { backgroundColor: 'var(--chart-5)' } },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">OKLCH Theme Test</h1>
          <p className="text-muted-foreground">
            Testing the new OKLCH color system with improved color consistency
          </p>
        </div>

        {/* Main Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Main Theme Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {colors.map((color) => (
                <div key={color.name} className="space-y-2">
                  <div className={`p-4 rounded-lg ${color.className} text-center font-medium`}>
                    {color.name}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">{color.className}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Chart Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              {chartColors.map((color) => (
                <div key={color.name} className="text-center">
                  <div
                    className="w-20 h-20 rounded-lg mb-2"
                    style={color.style}
                  />
                  <p className="text-xs">{color.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Variants</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle>Typography with Montserrat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold">Heading 1 - Montserrat</h1>
              <h2 className="text-3xl font-semibold">Heading 2 - Montserrat</h2>
              <h3 className="text-2xl font-medium">Heading 3 - Montserrat</h3>
              <p className="text-base">Body text using Montserrat sans-serif font</p>
              <p className="text-sm text-muted-foreground">Small muted text</p>
            </div>
            <div className="font-mono bg-muted p-4 rounded">
              <code>const theme = "OKLCH Color Space";</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}