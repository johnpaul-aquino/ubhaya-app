/**
 * Validation Schemas Index
 * Re-exports all validation schemas for easy imports
 */

// Auth validations
export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  type RegisterInput,
  type LoginInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type ChangePasswordInput,
} from './auth';

// User validations
export {
  updateProfileSchema,
  createTeamSchema,
  inviteMemberSchema,
  type UpdateProfileInput,
  type CreateTeamInput,
  type InviteMemberInput,
} from './user';

// Contact validations
export {
  createContactSchema,
  updateContactSchema,
  createContactNoteSchema,
  updateContactNoteSchema,
  shareContactSchema,
  contactQuerySchema,
  type CreateContactInput,
  type UpdateContactInput,
  type CreateContactNoteInput,
  type UpdateContactNoteInput,
  type ShareContactInput,
  type ContactQueryParams,
} from './contact';

// Document validations
export {
  documentTypeEnum,
  documentVisibilityEnum,
  linkTypeEnum,
  createDocumentSchema,
  updateDocumentSchema,
  fileUploadSchema,
  createDocumentLinkSchema,
  documentQuerySchema,
  shareDocumentSchema,
  type CreateDocumentInput,
  type UpdateDocumentInput,
  type FileUploadInput,
  type CreateDocumentLinkInput,
  type DocumentQueryParams,
  type ShareDocumentInput,
} from './document';

// Comment, mention, notification, and activity validations
export {
  entityTypeEnum,
  createCommentSchema,
  updateCommentSchema,
  commentQuerySchema,
  mentionSchema,
  notificationTypeEnum,
  createNotificationSchema,
  notificationQuerySchema,
  activityActionEnum,
  activityQuerySchema,
  type CreateCommentInput,
  type UpdateCommentInput,
  type CommentQueryParams,
  type MentionInput,
  type CreateNotificationInput,
  type NotificationQueryParams,
  type ActivityQueryParams,
} from './comment';

// Organization validations
export {
  createOrganizationSchema,
  updateOrganizationSchema,
  inviteOrgMemberSchema,
  updateOrgMemberSchema,
  type CreateOrganizationInput,
  type UpdateOrganizationInput,
  type InviteOrgMemberInput,
  type UpdateOrgMemberInput,
} from './organization';
