/**
 * Dashboard Components Barrel Export
 * Central export point for all dashboard components
 */

export { DashboardLayout } from './dashboard-layout';
export { Navbar } from './navbar';
export { Sidebar } from './sidebar';
export { StatCard } from './stat-card';
export { ActivityFeed } from './activity-feed';
export { ContactCard } from './contact-card';
export { QuickActions } from './quick-actions';

// Document Components
export { UploadDocumentDialog } from './upload-document-dialog';
export { CreateNoteDialog } from './create-note-dialog';
export { DocumentCard } from './document-card';
export { ShareDocumentDialog } from './share-document-dialog';

// Comment Components
export { CommentSection } from './comment-section';
export { CommentThread } from './comment-thread';
export { CommentInput } from './comment-input';
export { MentionAutocomplete } from './mention-autocomplete';

// Skeleton Loaders
export {
  StatCardSkeleton,
  TableRowSkeleton,
  ContactCardSkeleton,
  ActivityItemSkeleton,
  DashboardPageSkeleton
} from './skeletons';

// Types
export type { ActivityItem } from '@/types/dashboard';
