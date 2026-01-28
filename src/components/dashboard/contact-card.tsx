'use client';

import type { Contact } from '@/types/dashboard';
import { MessageCircle, Users, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ContactCardProps {
  contact: Contact;
  showToggle?: boolean;
  onChat?: (id: string) => void;
}

/**
 * Contact Card Component
 * Displays contact information with WhatsApp chat option
 */
export function ContactCard({
  contact,
  showToggle = false,
  onChat,
}: ContactCardProps) {
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const number = contact.whatsappNumber || contact.phone;
    if (number) {
      const cleanNumber = number.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    }
    onChat?.(contact.id);
  };

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/30 transition-all">
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
        style={{ backgroundColor: contact.avatarBg || '#6B46C1' }}
      >
        {contact.avatar || contact.name.slice(0, 2).toUpperCase()}
      </div>

      {/* Contact Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{contact.name}</p>
          {contact.isTeamContact && (
            <Badge variant="secondary" className="text-xs h-5 px-1.5">
              <Users className="h-3 w-3 mr-0.5" />
              Team
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {contact.company && (
            <span className="truncate">{contact.company}</span>
          )}
          {contact.position && contact.company && (
            <span className="text-muted-foreground/50">•</span>
          )}
          {contact.position && (
            <span className="truncate">{contact.position}</span>
          )}
        </div>
        {/* Contact methods */}
        <div className="flex items-center gap-3 mt-1">
          {contact.email && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-[120px]">{contact.email}</span>
            </span>
          )}
          {contact.phone && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{contact.phone}</span>
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {(contact.whatsappNumber || contact.phone) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={handleWhatsAppClick}
          >
            <MessageCircle className="h-3.5 w-3.5 mr-1" />
            Chat
          </Button>
        )}
      </div>
    </div>
  );
}
