/**
 * Organization Validation Schemas
 * Zod schemas for organization-related operations
 */

import { z } from 'zod';

// ============================================
// ORGANIZATION SCHEMAS
// ============================================

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must be less than 100 characters')
    .trim(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    )
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable(),
});

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must be less than 100 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable(),
  maxTeams: z.number().min(1).max(100).optional(),
  maxMembers: z.number().min(1).max(1000).optional(),
});

// ============================================
// ORGANIZATION MEMBER SCHEMAS
// ============================================

export const inviteOrgMemberSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  role: z.enum(['ADMIN', 'MEMBER', 'GUEST'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
});

export const updateOrgMemberSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER', 'GUEST'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type InviteOrgMemberInput = z.infer<typeof inviteOrgMemberSchema>;
export type UpdateOrgMemberInput = z.infer<typeof updateOrgMemberSchema>;
