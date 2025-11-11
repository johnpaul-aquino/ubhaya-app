/**
 * Authorization Utilities
 * Helper functions for role-based access control
 */

import { UserRole } from '@prisma/client';

/**
 * Role hierarchy levels (higher number = more permissions)
 */
const ROLE_LEVELS: Record<UserRole, number> = {
  VIEWER: 1,
  MEMBER: 2,
  TEAM_LEADER: 3,
  ADMIN: 4,
};

/**
 * Check if a user has a specific role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
}

/**
 * Check if user is an admin
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === 'ADMIN';
}

/**
 * Check if user is a team leader or higher
 */
export function isTeamLeader(userRole: UserRole): boolean {
  return hasRole(userRole, 'TEAM_LEADER');
}

/**
 * Check if user is a member or higher (not viewer)
 */
export function isMember(userRole: UserRole): boolean {
  return hasRole(userRole, 'MEMBER');
}

/**
 * Check if user can edit resources
 */
export function canEdit(userRole: UserRole): boolean {
  return hasRole(userRole, 'MEMBER');
}

/**
 * Check if user can delete resources
 */
export function canDelete(userRole: UserRole): boolean {
  return hasRole(userRole, 'TEAM_LEADER');
}

/**
 * Check if user can manage team (invite/remove members)
 */
export function canManageTeam(userRole: UserRole): boolean {
  return hasRole(userRole, 'TEAM_LEADER');
}

/**
 * Check if user can access admin features
 */
export function canAccessAdmin(userRole: UserRole): boolean {
  return isAdmin(userRole);
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  return role.replace('_', ' ');
}

/**
 * Get all roles at or below a certain level
 */
export function getRolesAtOrBelow(role: UserRole): UserRole[] {
  const userLevel = ROLE_LEVELS[role];
  return Object.entries(ROLE_LEVELS)
    .filter(([_, level]) => level <= userLevel)
    .map(([roleName]) => roleName as UserRole);
}
