/**
 * Authorization Utilities
 * Helper functions for role-based access control
 */

import { UserRole, OrgRole } from '@prisma/client';

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
 * Organization role hierarchy levels
 */
const ORG_ROLE_LEVELS: Record<OrgRole, number> = {
  GUEST: 1,
  MEMBER: 2,
  ADMIN: 3,
  OWNER: 4,
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

// ============================================
// ORGANIZATION ROLE FUNCTIONS
// ============================================

/**
 * Check if org role meets required level
 */
export function hasOrgRole(userOrgRole: OrgRole, requiredRole: OrgRole): boolean {
  return ORG_ROLE_LEVELS[userOrgRole] >= ORG_ROLE_LEVELS[requiredRole];
}

/**
 * Check if user is organization owner
 */
export function isOrgOwner(orgRole: OrgRole | null | undefined): boolean {
  return orgRole === 'OWNER';
}

/**
 * Check if user is organization admin or higher
 */
export function isOrgAdmin(orgRole: OrgRole | null | undefined): boolean {
  if (!orgRole) return false;
  return hasOrgRole(orgRole, 'ADMIN');
}

/**
 * Check if user is organization member or higher
 */
export function isOrgMember(orgRole: OrgRole | null | undefined): boolean {
  if (!orgRole) return false;
  return hasOrgRole(orgRole, 'MEMBER');
}

/**
 * Check if user can manage organization (update settings, invite members)
 */
export function canManageOrg(orgRole: OrgRole | null | undefined): boolean {
  if (!orgRole) return false;
  return hasOrgRole(orgRole, 'ADMIN');
}

/**
 * Check if user can view organization resources
 */
export function canViewOrgResources(orgRole: OrgRole | null | undefined): boolean {
  if (!orgRole) return false;
  return hasOrgRole(orgRole, 'GUEST');
}

/**
 * Check if user can edit organization resources
 */
export function canEditOrgResources(orgRole: OrgRole | null | undefined): boolean {
  if (!orgRole) return false;
  return hasOrgRole(orgRole, 'MEMBER');
}

/**
 * Get org role display name
 */
export function getOrgRoleDisplayName(role: OrgRole): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

/**
 * Get all org roles at or below a certain level
 */
export function getOrgRolesAtOrBelow(role: OrgRole): OrgRole[] {
  const roleLevel = ORG_ROLE_LEVELS[role];
  return Object.entries(ORG_ROLE_LEVELS)
    .filter(([_, level]) => level <= roleLevel)
    .map(([roleName]) => roleName as OrgRole);
}
