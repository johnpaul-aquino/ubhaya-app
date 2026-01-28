/**
 * Comment Validation Schemas
 * Zod schemas for validating comment-related forms and API requests
 */

import { z } from 'zod';

/**
 * Entity Type Enum for comments
 */
export const entityTypeEnum = z.enum(['DOCUMENT', 'CONTACT', 'TEAM', 'FACILITY', 'COMMENT']);

/**
 * Create Comment Schema
 * Validates comment creation
 */
export const createCommentSchema = z
  .object({
    content: z
      .string()
      .min(1, 'Comment content is required')
      .max(5000, 'Comment must be less than 5,000 characters')
      .trim(),

    documentId: z.string().cuid('Invalid document ID').optional().nullable(),

    contactId: z.string().cuid('Invalid contact ID').optional().nullable(),

    parentId: z.string().cuid('Invalid parent comment ID').optional().nullable(),
  })
  .refine(
    (data) => {
      // Either documentId or contactId must be provided (but not both for top-level comments)
      // Replies (with parentId) inherit the target from parent
      if (data.parentId) return true;
      return !!(data.documentId || data.contactId);
    },
    {
      message: 'Either documentId or contactId must be provided',
    }
  );

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

/**
 * Update Comment Schema
 * Validates comment updates
 */
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .max(5000, 'Comment must be less than 5,000 characters')
    .trim(),
});

export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;

/**
 * Comment Query Params Schema
 * Validates query parameters for comment listing
 */
export const commentQuerySchema = z.object({
  documentId: z.string().cuid().optional(),
  contactId: z.string().cuid().optional(),
  parentId: z.string().cuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type CommentQueryParams = z.infer<typeof commentQuerySchema>;

/**
 * Mention Schema
 * Validates @mention data (usually parsed from content)
 */
export const mentionSchema = z.object({
  mentionedId: z.string().cuid('Invalid user ID'),
});

export type MentionInput = z.infer<typeof mentionSchema>;

/**
 * Notification Type Enum
 */
export const notificationTypeEnum = z.enum([
  'MENTION',
  'COMMENT',
  'DOCUMENT_SHARED',
  'ASSIGNMENT',
  'TEAM_INVITE',
  'SYSTEM',
]);

/**
 * Create Notification Schema
 * Validates notification creation (typically internal use)
 */
export const createNotificationSchema = z.object({
  type: notificationTypeEnum,

  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),

  message: z
    .string()
    .min(1, 'Message is required')
    .max(1000, 'Message must be less than 1,000 characters')
    .trim(),

  userId: z.string().cuid('Invalid user ID'),

  entityType: entityTypeEnum.optional().nullable(),

  entityId: z.string().optional().nullable(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

/**
 * Notification Query Params Schema
 * Validates query parameters for notification listing
 */
export const notificationQuerySchema = z.object({
  isRead: z.coerce.boolean().optional(),
  type: notificationTypeEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
});

export type NotificationQueryParams = z.infer<typeof notificationQuerySchema>;

/**
 * Activity Action Enum
 */
export const activityActionEnum = z.enum([
  'DOCUMENT_CREATED',
  'DOCUMENT_UPDATED',
  'DOCUMENT_DELETED',
  'DOCUMENT_SHARED',
  'DOCUMENT_LINKED',
  'DOCUMENT_UNLINKED',
  'CONTACT_CREATED',
  'CONTACT_UPDATED',
  'CONTACT_DELETED',
  'CONTACT_NOTE_ADDED',
  'CONTACT_SHARED',
  'COMMENT_ADDED',
  'COMMENT_UPDATED',
  'COMMENT_DELETED',
  'USER_MENTIONED',
  'ASSIGNED',
  'UNASSIGNED',
]);

/**
 * Activity Query Params Schema
 * Validates query parameters for activity feed
 */
export const activityQuerySchema = z.object({
  entityType: entityTypeEnum.optional(),
  entityId: z.string().optional(),
  userId: z.string().cuid().optional(),
  teamId: z.string().cuid().optional(),
  action: activityActionEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type ActivityQueryParams = z.infer<typeof activityQuerySchema>;
