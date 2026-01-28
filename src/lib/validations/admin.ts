/**
 * Admin Validation Schemas
 * Zod schemas for admin operations
 */

import { z } from 'zod';

// User Management Schemas
export const updateUserRoleSchema = z.object({
  role: z.enum(['ADMIN', 'TEAM_LEADER', 'MEMBER', 'VIEWER']),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

export const adminResetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
});

// Organization Admin Schemas
export const adminCreateOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  ownerId: z.string().min(1, 'Owner is required'),
  maxTeams: z.number().int().min(1).max(100).optional().default(5),
  maxMembers: z.number().int().min(1).max(1000).optional().default(50),
});

export const adminUpdateOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name is too long')
    .optional(),
  description: z.string().max(500, 'Description is too long').optional(),
  maxTeams: z.number().int().min(1).max(100).optional(),
  maxMembers: z.number().int().min(1).max(1000).optional(),
  isActive: z.boolean().optional(),
});

export const adminTransferOwnershipSchema = z.object({
  newOwnerId: z.string().min(1, 'New owner is required'),
});

export const adminAddOrgMemberSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  role: z.enum(['ADMIN', 'MEMBER', 'GUEST']).default('MEMBER'),
});

export const adminUpdateOrgMemberSchema = z.object({
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER', 'GUEST']),
});

// Team Admin Schemas
export const adminCreateTeamSchema = z.object({
  name: z
    .string()
    .min(2, 'Team name must be at least 2 characters')
    .max(100, 'Team name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  ownerId: z.string().min(1, 'Owner is required'),
  organizationId: z.string().optional(),
  maxMembers: z.number().int().min(1).max(100).optional().default(10),
});

export const adminUpdateTeamSchema = z.object({
  name: z
    .string()
    .min(2, 'Team name must be at least 2 characters')
    .max(100, 'Team name is too long')
    .optional(),
  description: z.string().max(500, 'Description is too long').optional(),
  maxMembers: z.number().int().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
  organizationId: z.string().nullable().optional(),
});

export const adminAddTeamMemberSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  teamRole: z.enum(['OWNER', 'LEADER', 'MEMBER', 'VIEWER']).default('MEMBER'),
});

export const adminUpdateTeamMemberSchema = z.object({
  teamRole: z.enum(['OWNER', 'LEADER', 'MEMBER', 'VIEWER']),
});

// Query/Filter Schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const userFilterSchema = paginationSchema.extend({
  search: z.string().optional(),
  role: z.enum(['ADMIN', 'TEAM_LEADER', 'MEMBER', 'VIEWER']).optional(),
  isActive: z.coerce.boolean().optional(),
});

export const organizationFilterSchema = paginationSchema.extend({
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const teamFilterSchema = paginationSchema.extend({
  search: z.string().optional(),
  organizationId: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

// Type exports
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type AdminResetPasswordInput = z.infer<typeof adminResetPasswordSchema>;
export type AdminCreateOrganizationInput = z.infer<typeof adminCreateOrganizationSchema>;
export type AdminUpdateOrganizationInput = z.infer<typeof adminUpdateOrganizationSchema>;
export type AdminTransferOwnershipInput = z.infer<typeof adminTransferOwnershipSchema>;
export type AdminAddOrgMemberInput = z.infer<typeof adminAddOrgMemberSchema>;
export type AdminUpdateOrgMemberInput = z.infer<typeof adminUpdateOrgMemberSchema>;
export type AdminCreateTeamInput = z.infer<typeof adminCreateTeamSchema>;
export type AdminUpdateTeamInput = z.infer<typeof adminUpdateTeamSchema>;
export type AdminAddTeamMemberInput = z.infer<typeof adminAddTeamMemberSchema>;
export type AdminUpdateTeamMemberInput = z.infer<typeof adminUpdateTeamMemberSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type UserFilterInput = z.infer<typeof userFilterSchema>;
export type OrganizationFilterInput = z.infer<typeof organizationFilterSchema>;
export type TeamFilterInput = z.infer<typeof teamFilterSchema>;
