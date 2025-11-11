/**
 * Dashboard Types
 * Shared interfaces for dashboard components and data
 */

// Shipment Types
export interface Shipment {
  id: string;
  number: string;
  route: string;
  status: 'on-time' | 'delayed' | 'in-transit' | 'delivered';
  priority: 'high' | 'normal' | 'low';
  eta: string;
  updatedAt: string;
}

// Contact Types
export interface Contact {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  avatar: string;
  avatarBg: string;
  hasTodo?: boolean;
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

// Document Types
export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'excel' | 'note';
  size: string;
  sharedBy?: string;
  timestamp: string;
}

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
