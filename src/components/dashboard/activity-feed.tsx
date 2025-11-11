'use client';

import type { ActivityItem } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  items: ActivityItem[];
  maxItems?: number;
}

/**
 * Activity Feed Component
 * Displays a list of recent team activities
 */
export function ActivityFeed({ items, maxItems = 4 }: ActivityFeedProps) {
  const displayedItems = items.slice(0, maxItems);

  return (
    <div className="space-y-3">
      {displayedItems.map((item) => (
        <div
          key={item.id}
          className="flex gap-3 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors"
        >
          {/* Activity Icon */}
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
            style={{ backgroundColor: item.iconBg }}
          >
            {item.icon}
          </div>

          {/* Activity Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <strong>{item.username}</strong> {item.action}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {item.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
