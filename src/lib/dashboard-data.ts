/**
 * Mock Data for Dashboard
 * Used during development and testing
 */

import type {
  Contact,
  TeamMember,
  ActivityItem,
  UpcomingArrival,
  Document,
} from '@/types/dashboard';

// Mock Contacts Data
export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'ABC Logistics',
    phone: '+91 98765 43210',
    email: 'john.doe@abc.com',
    avatar: 'JD',
    avatarBg: '#6B46C1',
    hasTodo: false,
  },
  {
    id: '2',
    name: 'Viola Smith',
    company: 'XYZ Shipping',
    phone: '+91 98765 12345',
    email: 'viola.smith@xyz.com',
    avatar: 'VS',
    avatarBg: '#2563EB',
    hasTodo: true,
  },
  {
    id: '3',
    name: 'Raj Kumar',
    company: 'Global Freight',
    phone: '+91 98765 67890',
    email: 'raj.kumar@global.com',
    avatar: 'RK',
    avatarBg: '#22c55e',
    hasTodo: false,
  },
  {
    id: '4',
    name: 'Sarah Chen',
    company: 'Express Logistics',
    phone: '+91 98765 11111',
    email: 'sarah.chen@express.com',
    avatar: 'SC',
    avatarBg: '#f59e0b',
    hasTodo: true,
  },
  {
    id: '5',
    name: 'Mike Johnson',
    company: 'Speed Cargo',
    phone: '+91 98765 22222',
    email: 'mike.johnson@speed.com',
    avatar: 'MJ',
    avatarBg: '#ef4444',
    hasTodo: false,
  },
  {
    id: '6',
    name: 'Lisa Wang',
    company: 'Pacific Shipping',
    phone: '+91 98765 33333',
    email: 'lisa.wang@pacific.com',
    avatar: 'LW',
    avatarBg: '#8b5cf6',
    hasTodo: false,
  },
];

// Mock Team Members
export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'admin',
    department: 'Management',
    avatar: 'JD',
    avatarBg: '#6B46C1',
    isOnline: true,
    email: 'john.doe@ubhaya.com',
    joinDate: 'Jan 10, 2024',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'team-leader',
    department: 'Operations',
    avatar: 'SC',
    avatarBg: '#2563EB',
    isOnline: true,
    email: 'sarah.chen@ubhaya.com',
    joinDate: 'Jan 15, 2024',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'team-leader',
    department: 'Logistics',
    avatar: 'MJ',
    avatarBg: '#22c55e',
    isOnline: true,
    email: 'mike.johnson@ubhaya.com',
    joinDate: 'Feb 1, 2024',
  },
  {
    id: '4',
    name: 'Lisa Wang',
    role: 'member',
    department: 'Documentation',
    avatar: 'LW',
    avatarBg: '#f59e0b',
    isOnline: true,
    email: 'lisa.wang@ubhaya.com',
    joinDate: 'Feb 10, 2024',
  },
  {
    id: '5',
    name: 'David Lee',
    role: 'member',
    department: 'Shipping',
    avatar: 'DL',
    avatarBg: '#ef4444',
    isOnline: true,
    email: 'david.lee@ubhaya.com',
    joinDate: 'Mar 1, 2024',
  },
  {
    id: '6',
    name: 'Raj Kumar',
    role: 'member',
    department: 'Customer Relations',
    avatar: 'RK',
    avatarBg: '#8b5cf6',
    isOnline: false,
    email: 'raj.kumar@ubhaya.com',
    joinDate: 'Mar 15, 2024',
  },
  {
    id: '7',
    name: 'Amy Park',
    role: 'viewer',
    department: 'Analyst',
    avatar: 'AP',
    avatarBg: '#06b6d4',
    isOnline: false,
    email: 'amy.park@ubhaya.com',
    joinDate: 'Apr 1, 2024',
  },
  {
    id: '8',
    name: 'Tom Chen',
    role: 'viewer',
    department: 'Finance',
    avatar: 'TC',
    avatarBg: '#ec4899',
    isOnline: false,
    email: 'tom.chen@ubhaya.com',
    joinDate: 'Apr 10, 2024',
  },
];

// Mock Activity Items
export const mockActivityItems: ActivityItem[] = [
  {
    id: '1',
    icon: '👤',
    iconBg: '#f3f4f6',
    username: 'Sarah Chen',
    action: 'added a new facility contact',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    icon: '📦',
    iconBg: '#dcfce7',
    iconBgColor: '#22c55e',
    username: 'Mike Johnson',
    action: 'updated shipment FIG-123 status',
    timestamp: '3 hours ago',
  },
  {
    id: '3',
    icon: '📄',
    iconBg: '#fef3c7',
    iconBgColor: '#f59e0b',
    username: 'Lisa Wang',
    action: 'shared a document with the team',
    timestamp: '5 hours ago',
  },
  {
    id: '4',
    icon: '💬',
    iconBg: '#fee2e2',
    iconBgColor: '#ef4444',
    username: 'David Lee',
    action: 'imported WhatsApp contacts',
    timestamp: 'Yesterday',
  },
];

// Mock Upcoming Arrivals
export const mockUpcomingArrivals: UpcomingArrival[] = [
  {
    id: '1',
    shipmentNumber: 'FIG-128',
    location: 'Chennai Port',
    date: 'Dec 2',
  },
  {
    id: '2',
    shipmentNumber: 'FIG-129',
    location: 'Mumbai Airport',
    date: 'Dec 2',
  },
  {
    id: '3',
    shipmentNumber: 'FIG-130',
    location: 'Delhi Warehouse',
    date: 'Dec 2',
  },
  {
    id: '4',
    shipmentNumber: 'FIG-124',
    location: 'Chennai Distribution',
    date: 'Dec 3',
  },
  {
    id: '5',
    shipmentNumber: 'FIG-131',
    location: 'Bangalore Hub',
    date: 'Dec 3',
  },
];

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Shipping Invoice Dec',
    type: 'pdf',
    size: '2.4 MB',
    timestamp: '2h ago',
  },
  {
    id: '2',
    name: 'Meeting Notes',
    type: 'note',
    size: 'Shared by Sarah',
    timestamp: '5h ago',
  },
  {
    id: '3',
    name: 'Q4 Report',
    type: 'excel',
    size: '1.2 MB',
    timestamp: '1d ago',
  },
];

// Mock Stats
export const mockStats = [
  {
    label: 'Active Shipments',
    value: 24,
    change: { value: 12, direction: 'up' as const, label: 'from last week' },
  },
  {
    label: 'Pending Tasks',
    value: 7,
    change: { value: 3, direction: 'down' as const, label: 'urgent' },
  },
  {
    label: 'Team Contacts',
    value: 156,
    change: { value: 8, direction: 'up' as const, label: 'new this week' },
  },
  {
    label: 'Facilities Database',
    value: '50K+',
    change: { value: 0, direction: 'up' as const, label: 'Global coverage' },
  },
];
