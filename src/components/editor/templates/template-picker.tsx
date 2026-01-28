'use client';

import { useState } from 'react';
import type { JSONContent } from '@tiptap/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  FileText,
  Users,
  Target,
  Calendar,
  User,
  Building,
  LayoutTemplate,
} from 'lucide-react';
import { defaultTemplates, type DocumentTemplate } from './default-templates';

const ICONS: Record<string, React.ElementType> = {
  FileText,
  Users,
  Target,
  Calendar,
  User,
  Building,
};

const CATEGORY_LABELS: Record<DocumentTemplate['category'], string> = {
  meeting: 'Meetings',
  project: 'Projects',
  report: 'Reports',
  general: 'General',
};

interface TemplatePickerProps {
  onSelect: (content: JSONContent) => void;
  trigger?: React.ReactNode;
}

/**
 * Template Picker Dialog
 * Allows users to select a pre-built template for their document
 */
export function TemplatePicker({ onSelect, trigger }: TemplatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DocumentTemplate['category'] | 'all'>(
    'all'
  );

  const filteredTemplates =
    selectedCategory === 'all'
      ? defaultTemplates
      : defaultTemplates.filter((t) => t.category === selectedCategory);

  const handleSelect = (template: DocumentTemplate) => {
    onSelect(template.content);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <LayoutTemplate className="h-4 w-4 mr-2" />
            Use Template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Start with a pre-built template to save time
          </DialogDescription>
        </DialogHeader>

        {/* Category Filter */}
        <div className="flex gap-2 py-2 border-b">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Badge>
          {(Object.keys(CATEGORY_LABELS) as DocumentTemplate['category'][]).map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {CATEGORY_LABELS[category]}
            </Badge>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 gap-3 py-4 overflow-y-auto flex-1">
          {filteredTemplates.map((template) => {
            const Icon = ICONS[template.icon] || FileText;
            return (
              <Card
                key={template.id}
                className={cn(
                  'cursor-pointer transition-all hover:border-primary hover:shadow-md',
                  'group'
                )}
                onClick={() => handleSelect(template)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1 line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
