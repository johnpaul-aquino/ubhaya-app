/**
 * Dashboard Types
 * Shared interfaces for dashboard components and data
 */

// ============================================
// ENUMS (matching Prisma schema)
// ============================================

export type DocumentType = 'NOTE' | 'FILE' | 'MEETING_NOTE' | 'TEMPLATE';
export type DocumentVisibility = 'PRIVATE' | 'TEAM' | 'ORGANIZATION' | 'SHARED';
export type LinkType = 'CONTACT' | 'FACILITY' | 'TEAM';
export type EntityType = 'DOCUMENT' | 'CONTACT' | 'TEAM' | 'FACILITY' | 'COMMENT';
export type NotificationType = 'MENTION' | 'COMMENT' | 'DOCUMENT_SHARED' | 'ASSIGNMENT' | 'TEAM_INVITE' | 'SYSTEM';
export type OrgRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';

export type ActivityAction =
  | 'DOCUMENT_CREATED'
  | 'DOCUMENT_UPDATED'
  | 'DOCUMENT_DELETED'
  | 'DOCUMENT_SHARED'
  | 'DOCUMENT_LINKED'
  | 'DOCUMENT_UNLINKED'
  | 'CONTACT_CREATED'
  | 'CONTACT_UPDATED'
  | 'CONTACT_DELETED'
  | 'CONTACT_NOTE_ADDED'
  | 'CONTACT_SHARED'
  | 'COMMENT_ADDED'
  | 'COMMENT_UPDATED'
  | 'COMMENT_DELETED'
  | 'USER_MENTIONED'
  | 'ASSIGNED'
  | 'UNASSIGNED';

// ============================================
// ORGANIZATION TYPES
// ============================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  avatar?: string | null;
  ownerId: string;
  maxTeams: number;
  maxMembers: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relations (optional)
  owner?: { id: string; firstName: string; lastName: string; email: string };
  members?: OrganizationMember[];
  teams?: Team[];
  _count?: { members: number; teams: number };
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  orgRole: OrgRole;
  joinedAt: Date | string;
  updatedAt: Date | string;
  // Relations (optional)
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    role?: string;
  };
  organization?: Organization;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  avatar?: string | null;
  ownerId: string;
  organizationId?: string | null;
  maxMembers: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relations (optional)
  organization?: Organization;
  members?: TeamMemberDB[];
  _count?: { members: number };
}

export interface TeamMemberDB {
  id: string;
  userId: string;
  teamId: string;
  teamRole: 'OWNER' | 'LEADER' | 'MEMBER' | 'VIEWER';
  joinedAt: Date | string;
  updatedAt: Date | string;
  // Relations
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    role?: string;
  };
}

// ============================================
// CONTACT TYPES
// ============================================

export interface Contact {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  position?: string | null;
  whatsappNumber?: string | null;
  website?: string | null;
  address?: string | null;
  avatar?: string | null;
  avatarBg?: string | null;
  isTeamContact: boolean;
  isOrgContact: boolean;
  tags: string[];
  userId: string;
  teamId?: string | null;
  organizationId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relations (optional, when included)
  notes?: ContactNote[];
  comments?: Comment[];
  documentLinks?: DocumentLink[];
  user?: { id: string; firstName: string; lastName: string };
  organization?: Organization;
}

export interface ContactNote {
  id: string;
  content: string;
  isPinned: boolean;
  contactId: string;
  authorId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relations
  author?: { id: string; firstName: string; lastName: string; avatar?: string };
}

// Team Member Types
export type TeamRole = 'admin' | 'team-leader' | 'member' | 'viewer';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  department: string;
  avatar: string;
  avatarBg: string;
  isOnline: boolean;
  email: string;
  joinDate: string;
}

// Activity Types
export interface ActivityItem {
  id: string;
  icon: string;
  iconBg: string;
  username: string;
  action: string;
  timestamp: string;
}

// Stat Card Types
export interface StatValue {
  label: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down';
    label: string;
  };
  icon?: React.ReactNode;
}

// Upcoming Arrival Types
export interface UpcomingArrival {
  id: string;
  shipmentNumber: string;
  location: string;
  date: string;
}

// ============================================
// DOCUMENT TYPES
// ============================================

export type ContentFormat = 'PLAIN' | 'TIPTAP_JSON';

export interface Document {
  id: string;
  title: string;
  content?: string | null;
  contentJson?: Record<string, unknown> | null; // Tiptap JSON document
  contentFormat?: ContentFormat;
  type: DocumentType;
  visibility: DocumentVisibility;
  // File fields (for FILE type)
  fileName?: string | null;
  fileUrl?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  s3Key?: string | null;
  // Ownership
  authorId: string;
  teamId?: string | null;
  organizationId?: string | null;
  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relations (optional)
  author?: { id: string; firstName: string; lastName: string; avatar?: string };
  links?: DocumentLink[];
  comments?: Comment[];
  organization?: Organization;
  _count?: { links: number; comments: number };
}

export interface DocumentLink {
  id: string;
  linkType: LinkType;
  documentId: string;
  contactId?: string | null;
  facilityId?: string | null;
  createdById: string;
  createdAt: Date | string;
  // Relations
  contact?: { id: string; name: string };
  createdBy?: { id: string; firstName: string; lastName: string };
}

// Legacy Document type for backward compatibility with mock data
export interface LegacyDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'excel' | 'note';
  size: string;
  sharedBy?: string;
  timestamp: string;
}

// ============================================
// ACTIVITY TYPES
// ============================================

export interface Activity {
  id: string;
  action: ActivityAction;
  entityType: EntityType;
  entityId: string;
  metadata?: Record<string, unknown> | null;
  userId: string;
  documentId?: string | null;
  teamId?: string | null;
  organizationId?: string | null;
  createdAt: Date | string;
  // Relations
  user?: { id: string; firstName: string; lastName: string; avatar?: string };
  document?: { id: string; title: string };
  organization?: Organization;
}

// ============================================
// COMMENT TYPES
// ============================================

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  documentId?: string | null;
  contactId?: string | null;
  parentId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relations
  author?: { id: string; firstName: string; lastName: string; avatar?: string };
  replies?: Comment[];
  mentions?: Mention[];
}

// ============================================
// MENTION TYPES
// ============================================

export interface Mention {
  id: string;
  mentionedId: string;
  mentionerId: string;
  commentId?: string | null;
  createdAt: Date | string;
  // Relations
  mentionedUser?: { id: string; firstName: string; lastName: string };
  mentioner?: { id: string; firstName: string; lastName: string };
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: EntityType | null;
  entityId?: string | null;
  isRead: boolean;
  readAt?: Date | string | null;
  userId: string;
  createdAt: Date | string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ContactsResponse {
  success: boolean;
  contacts: Contact[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface DocumentsResponse {
  success: boolean;
  documents: Document[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ActivityResponse {
  success: boolean;
  activities: Activity[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface NotificationsResponse {
  success: boolean;
  notifications: Notification[];
  unreadCount: number;
}

// ============================================
// FILTER TYPES
// ============================================

// Filter Types
export interface FilterChip {
  id: string;
  label: string;
  value: string;
}

// Pagination Types
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// Table Column Types
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

// Facility Types
export interface Facility {
  id: string;
  name: string;
  address: string;
  countryCode: string;
  countryName: string;
  lat: number;
  lng: number;
  sector: string[];
  numberOfWorkers?: string;
  parentCompany?: string;
  facilityType?: string;
  productType?: string;
  isClosed: boolean;
}

export interface FacilitiesResponse {
  success: boolean;
  facilities: Facility[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: {
    countries: { code: string; name: string; count: number }[];
    sectors: { name: string; count: number }[];
  };
}

// ============================================
// SHIPMENT CALCULATOR TYPES
// ============================================

export type WeightUnit = 'kg' | 'lbs';
export type DimensionUnit = 'cm' | 'in';

export interface ShipmentCalculation {
  id: string;
  name?: string;
  originCity: string;
  originCountry: string;
  destCity: string;
  destCountry: string;
  weight: number;
  weightUnit: WeightUnit;
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit: DimensionUnit;
  selectedCarrier?: string;
  estimatedCost?: number;
  currency: string;
  estimatedDays?: number;
  authorId: string;
  teamId?: string;
  visibility: DocumentVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface CarrierQuote {
  id: string;
  carrier: string;
  logo?: string;
  cost: number;
  currency: string;
  deliveryDays: number;
  deliveryDate: string;
  service: string;
}

export interface CalculatorFormData {
  originCity: string;
  originCountry: string;
  destCity: string;
  destCountry: string;
  weight: number;
  weightUnit: WeightUnit;
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit: DimensionUnit;
}
