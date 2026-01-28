/**
 * Contact Validation Schemas
 * Zod schemas for validating contact-related forms and API requests
 */

import { z } from 'zod';

/**
 * Create Contact Schema
 * Validates contact creation form data
 */
export const createContactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .or(z.literal('')),

  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .optional()
    .or(z.literal('')),

  position: z
    .string()
    .max(100, 'Position must be less than 100 characters')
    .optional()
    .or(z.literal('')),

  whatsappNumber: z
    .string()
    .optional()
    .transform((val) => val ? val.replace(/[\s\-\(\)]/g, '') : val)
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
      {
        message: 'Invalid phone number format (use +1234567890)',
      }
    ),

  website: z
    .string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),

  address: z
    .string()
    .max(500, 'Address must be less than 500 characters')
    .optional()
    .or(z.literal('')),

  tags: z
    .array(z.string().max(50, 'Tag must be less than 50 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .default([]),

  isTeamContact: z.boolean().optional().default(false),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;

/**
 * Update Contact Schema
 * Validates contact update form data (all fields optional)
 */
export const updateContactSchema = createContactSchema.partial();

export type UpdateContactInput = z.infer<typeof updateContactSchema>;

/**
 * Contact Note Schema
 * Validates contact note creation
 */
export const createContactNoteSchema = z.object({
  content: z
    .string()
    .min(1, 'Note content is required')
    .max(10000, 'Note must be less than 10,000 characters')
    .trim(),

  isPinned: z.boolean().optional().default(false),
});

export type CreateContactNoteInput = z.infer<typeof createContactNoteSchema>;

/**
 * Update Contact Note Schema
 * Validates contact note updates
 */
export const updateContactNoteSchema = z.object({
  content: z
    .string()
    .min(1, 'Note content is required')
    .max(10000, 'Note must be less than 10,000 characters')
    .trim()
    .optional(),

  isPinned: z.boolean().optional(),
});

export type UpdateContactNoteInput = z.infer<typeof updateContactNoteSchema>;

/**
 * Share Type Enum
 */
export const shareTypeEnum = z.enum(['TEAM', 'ORGANIZATION']);

/**
 * Share Contact Schema
 * Validates contact sharing with team or organization
 */
export const shareContactSchema = z.object({
  shareType: shareTypeEnum,
  teamId: z.string().cuid('Invalid team ID').optional(),
}).refine(
  (data) => {
    // teamId is required when sharing with TEAM
    if (data.shareType === 'TEAM') return !!data.teamId;
    return true;
  },
  {
    message: 'Team ID is required when sharing with team',
    path: ['teamId'],
  }
);

export type ShareContactInput = z.infer<typeof shareContactSchema>;

/**
 * Contact Query Params Schema
 * Validates query parameters for contact listing
 */
export const contactQuerySchema = z.object({
  search: z.string().optional(),
  teamId: z.string().cuid().optional(),
  organizationId: z.string().cuid().optional(),
  tags: z.array(z.string()).optional(),
  isTeamContact: z.coerce.boolean().optional(),
  isOrgContact: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type ContactQueryParams = z.infer<typeof contactQuerySchema>;
