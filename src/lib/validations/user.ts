/**
 * User Profile Validation Schemas
 * Zod schemas for validating user profile data
 */

import { z } from 'zod';

/**
 * Update Profile Schema
 * Validates user profile update form data
 */
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .trim(),

  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),

  whatsappNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
      {
        message: 'Invalid phone number format (use +1234567890)',
      }
    ),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Team Creation Schema
 * Validates team creation form data
 */
export const createTeamSchema = z.object({
  name: z
    .string()
    .min(2, 'Team name must be at least 2 characters')
    .max(100, 'Team name must be less than 100 characters')
    .trim(),

  slug: z
    .string()
    .min(2, 'Team slug must be at least 2 characters')
    .max(50, 'Team slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .trim(),

  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;

/**
 * Invite Member Schema
 * Validates team member invitation
 */
export const inviteMemberSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),

  role: z.enum(['TEAM_LEADER', 'MEMBER', 'VIEWER'], {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
