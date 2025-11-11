'use client';

import type { Contact } from '@/types/dashboard';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ContactCardProps {
  contact: Contact;
  showToggle?: boolean;
  onToggle?: (id: string, checked: boolean) => void;
  onChat?: (id: string) => void;
}

/**
 * Contact Card Component
 * Displays contact information with WhatsApp chat and todo toggle
 */
export function ContactCard({
  contact,
  showToggle = true,
  onToggle,
  onChat,
}: ContactCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/30 transition-all">
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
        style={{ backgroundColor: contact.avatarBg }}
      >
        {contact.avatar}
      </div>

      {/* Contact Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{contact.name}</p>
        <p className="text-xs text-muted-foreground truncate">{contact.company}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={() => onChat?.(contact.id)}
        >
          <MessageCircle className="h-3.5 w-3.5 mr-1" />
          Chat
        </Button>

        {showToggle && (
          <label className="flex items-center cursor-pointer">
            <Checkbox
              checked={contact.hasTodo || false}
              onCheckedChange={(checked) =>
                onToggle?.(contact.id, !!checked)
              }
            />
          </label>
        )}
      </div>
    </div>
  );
}
