/**
 * Document Validation Schemas
 * Zod schemas for validating document-related forms and API requests
 */

import { z } from 'zod';

/**
 * Document Type Enum
 */
export const documentTypeEnum = z.enum(['NOTE', 'FILE', 'MEETING_NOTE', 'TEMPLATE']);

/**
 * Document Visibility Enum
 */
export const documentVisibilityEnum = z.enum(['PRIVATE', 'TEAM', 'ORGANIZATION', 'SHARED']);

/**
 * Content Format Enum
 */
export const contentFormatEnum = z.enum(['PLAIN', 'TIPTAP_JSON']);

/**
 * Link Type Enum
 */
export const linkTypeEnum = z.enum(['CONTACT', 'FACILITY', 'TEAM']);

/**
 * Create Document Schema
 * Validates document/note creation form data
 */
export const createDocumentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),

  content: z
    .string()
    .max(500000, 'Content must be less than 500,000 characters')
    .optional()
    .or(z.literal('')),

  contentJson: z.any().optional().nullable(), // Tiptap JSON document structure

  contentFormat: contentFormatEnum.default('PLAIN'),

  type: documentTypeEnum.default('NOTE'),

  visibility: documentVisibilityEnum.default('PRIVATE'),

  teamId: z.string().cuid('Invalid team ID').optional().nullable(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;

/**
 * Update Document Schema
 * Validates document update form data
 */
export const updateDocumentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim()
    .optional(),

  content: z
    .string()
    .max(500000, 'Content must be less than 500,000 characters')
    .optional()
    .nullable(),

  contentJson: z.any().optional().nullable(), // Tiptap JSON document structure

  contentFormat: contentFormatEnum.optional(),

  type: documentTypeEnum.optional(),

  visibility: documentVisibilityEnum.optional(),

  teamId: z.string().cuid('Invalid team ID').optional().nullable(),
});

export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

/**
 * File Upload Schema
 * Validates file upload metadata
 */
export const fileUploadSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),

  fileName: z
    .string()
    .min(1, 'File name is required')
    .max(255, 'File name must be less than 255 characters'),

  fileSize: z
    .number()
    .int()
    .positive('File size must be positive')
    .max(50 * 1024 * 1024, 'File size must be less than 50MB'),

  mimeType: z
    .string()
    .min(1, 'MIME type is required')
    .max(100, 'MIME type must be less than 100 characters'),

  visibility: documentVisibilityEnum.default('PRIVATE'),

  teamId: z.string().cuid('Invalid team ID').optional().nullable(),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

/**
 * Document Link Schema
 * Validates linking a document to an entity
 */
export const createDocumentLinkSchema = z
  .object({
    linkType: linkTypeEnum,
    contactId: z.string().cuid('Invalid contact ID').optional().nullable(),
    facilityId: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      // Ensure at least one target ID is provided based on linkType
      if (data.linkType === 'CONTACT') return !!data.contactId;
      if (data.linkType === 'FACILITY') return !!data.facilityId;
      return true;
    },
    {
      message: 'Target ID is required for the selected link type',
    }
  );

export type CreateDocumentLinkInput = z.infer<typeof createDocumentLinkSchema>;

/**
 * Document Query Params Schema
 * Validates query parameters for document listing
 */
export const documentQuerySchema = z.object({
  search: z.string().optional(),
  type: documentTypeEnum.optional(),
  visibility: documentVisibilityEnum.optional(),
  teamId: z.string().cuid().optional(),
  authorId: z.string().cuid().optional(),
  linkedContactId: z.string().cuid().optional(),
  linkedFacilityId: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type DocumentQueryParams = z.infer<typeof documentQuerySchema>;

/**
 * Document Share Schema
 * Validates document sharing
 */
export const shareDocumentSchema = z.object({
  visibility: documentVisibilityEnum,
  teamId: z.string().cuid('Invalid team ID').optional().nullable(),
  organizationId: z.string().cuid('Invalid organization ID').optional().nullable(),
});

export type ShareDocumentInput = z.infer<typeof shareDocumentSchema>;
