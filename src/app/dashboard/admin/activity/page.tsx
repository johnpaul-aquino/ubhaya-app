/**
 * Admin Activity Log Page
 * View system-wide activity and audit log
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  RefreshCw,
  Activity,
  Filter,
  FileText,
  Users,
  MessageSquare,
  Share2,
  Trash2,
  Edit,
  Plus,
  Link2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ActivityUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
}

interface ActivityTeam {
  id: string;
  name: string;
  slug: string;
}

interface ActivityOrg {
  id: string;
  name: string;
  slug: string;
}

interface ActivityItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: ActivityUser;
  team: ActivityTeam | null;
  organization: ActivityOrg | null;
}

interface ActivityStat {
  action: string;
  count: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  DOCUMENT_CREATED: Plus,
  DOCUMENT_UPDATED: Edit,
  DOCUMENT_DELETED: Trash2,
  DOCUMENT_SHARED: Share2,
  DOCUMENT_LINKED: Link2,
  DOCUMENT_UNLINKED: Link2,
  CONTACT_CREATED: Plus,
  CONTACT_UPDATED: Edit,
  CONTACT_DELETED: Trash2,
  CONTACT_NOTE_ADDED: MessageSquare,
  CONTACT_SHARED: Share2,
  COMMENT_CREATED: MessageSquare,
  COMMENT_UPDATED: Edit,
  COMMENT_DELETED: Trash2,
};

const ENTITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  DOCUMENT: FileText,
  CONTACT: Users,
  TEAM: Users,
  COMMENT: MessageSquare,
};

function formatAction(action: string): string {
  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function getActionColor(action: string): string {
  if (action.includes('CREATED')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  if (action.includes('UPDATED')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  if (action.includes('DELETED')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  if (action.includes('SHARED')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<ActivityStat[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '50');

      if (entityTypeFilter !== 'all') params.set('entityType', entityTypeFilter);
      if (actionFilter !== 'all') params.set('action', actionFilter);

      const response = await fetch(`/api/admin/activity?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setActivities(data.activities);
        setStats(data.stats);
        setPagination(data.pagination);
      } else {
        toast.error(data.error || 'Failed to load activity log');
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      toast.error('Failed to load activity log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [page, entityTypeFilter, actionFilter]);

  const handleClearFilters = () => {
    setEntityTypeFilter('all');
    setActionFilter('all');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8" />
            Activity Log
          </h1>
          <p className="text-muted-foreground">
            View system-wide activity and audit trail
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchActivities}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Summary</CardTitle>
            <CardDescription>Top activity types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.slice(0, 8).map((stat) => (
                <Badge
                  key={stat.action}
                  variant="secondary"
                  className="text-sm py-1 px-3"
                >
                  {formatAction(stat.action)}: {stat.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="DOCUMENT">Documents</SelectItem>
                <SelectItem value="CONTACT">Contacts</SelectItem>
                <SelectItem value="TEAM">Teams</SelectItem>
                <SelectItem value="COMMENT">Comments</SelectItem>
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="DOCUMENT_CREATED">Document Created</SelectItem>
                <SelectItem value="DOCUMENT_UPDATED">Document Updated</SelectItem>
                <SelectItem value="DOCUMENT_DELETED">Document Deleted</SelectItem>
                <SelectItem value="CONTACT_CREATED">Contact Created</SelectItem>
                <SelectItem value="CONTACT_UPDATED">Contact Updated</SelectItem>
                <SelectItem value="COMMENT_CREATED">Comment Created</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>
            Activity Feed {pagination && `(${pagination.total})`}
          </CardTitle>
          <CardDescription>
            {pagination
              ? `Showing ${((pagination.page - 1) * pagination.limit + 1)}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total}`
              : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-64 mb-2" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No activity found</p>
              <p className="text-sm mt-1">Activity will appear here as users interact with the system</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => {
                const ActionIcon = ACTION_ICONS[activity.action] || Activity;
                const EntityIcon = ENTITY_ICONS[activity.entityType] || FileText;

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.user.avatar || undefined} />
                      <AvatarFallback>
                        {activity.user.firstName[0]}
                        {activity.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">
                          {activity.user.firstName} {activity.user.lastName}
                        </span>
                        <Badge className={getActionColor(activity.action)}>
                          <ActionIcon className="h-3 w-3 mr-1" />
                          {formatAction(activity.action)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <EntityIcon className="h-4 w-4" />
                        <span>{activity.entityType}</span>
                        {activity.team && (
                          <>
                            <span>•</span>
                            <span>Team: {activity.team.name}</span>
                          </>
                        )}
                        {activity.organization && (
                          <>
                            <span>•</span>
                            <span>Org: {activity.organization.name}</span>
                          </>
                        )}
                      </div>
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded p-2">
                          {JSON.stringify(activity.metadata, null, 2).substring(0, 100)}
                          {JSON.stringify(activity.metadata).length > 100 && '...'}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatTimeAgo(activity.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
