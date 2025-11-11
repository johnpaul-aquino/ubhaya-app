# Authentication & User Management Development Plan

**Project:** Ubhaya Supply Chain Management Platform
**Version:** 1.1
**Last Updated:** 2025-11-11
**Status:** Planning Phase
**Database:** PostgreSQL (Docker) with Prisma ORM

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technical Architecture](#technical-architecture)
3. [Database Schema](#database-schema)
4. [Feature Specifications](#feature-specifications)
   - [User Registration](#1-user-registration-simplified)
   - [User Login](#2-user-login)
   - [Forgot Password](#3-forgot-password)
   - [User Profile](#4-user-profile)
   - [Teams/Groups](#5-teamsgroups-simplified)
5. [Implementation Timeline](#implementation-timeline)
6. [Security Considerations](#security-considerations)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Checklist](#deployment-checklist)

---

## Executive Summary

### Current State

- **Authentication:** None implemented
- **Database:** Not configured
- **Protected Routes:** Dashboard is publicly accessible
- **User Management:** No user system exists

### Goal

Build a secure, simplified authentication system with:

- Email/password registration and login
- Password reset functionality
- Basic user profile management
- Simple team/group collaboration features

### Tech Stack

- **Auth:** NextAuth.js v5 (Auth.js)
- **Database:** PostgreSQL via Docker
- **ORM:** Prisma (for database migrations)
- **Email:** Resend
- **Password Hashing:** bcryptjs
- **Validation:** Zod + react-hook-form

---

## Technical Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication System                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│              │      │              │      │              │
│  Client      │─────▶│  NextAuth.js │─────▶│  PostgreSQL  │
│  (Browser)   │      │  API Routes  │      │   (Docker)   │
│              │      │              │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
       │                     │                      │
       │                     │                      │
       ▼                     ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Auth Pages   │      │ Middleware   │      │ Prisma ORM   │
│ - Login      │      │ - Route      │      │ - User Model │
│ - Register   │      │   Protection │      │ - Team Model │
│ - Reset      │      │ - Role Check │      │ - Session    │
└──────────────┘      └──────────────┘      └──────────────┘
```

### Folder Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth route group (no dashboard layout)
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── register/
│   │   │   └── page.tsx          # Registration page
│   │   ├── forgot-password/
│   │   │   └── page.tsx          # Forgot password page
│   │   ├── reset-password/
│   │   │   └── page.tsx          # Reset password with token
│   │   └── layout.tsx            # Auth layout (centered, minimal)
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts     # NextAuth.js handler
│   │   │   ├── register/
│   │   │   │   └── route.ts     # Registration API
│   │   │   └── reset-password/
│   │   │       └── route.ts     # Password reset API
│   │   └── user/
│   │       ├── profile/
│   │       │   └── route.ts     # Update profile
│   │       └── team/
│   │           └── route.ts     # Team operations
│   │
│   └── dashboard/
│       ├── profile/
│       │   └── page.tsx          # User profile page
│       └── team/
│           └── page.tsx          # Team management page (updated)
│
├── components/
│   ├── auth/
│   │   ├── login-form.tsx        # Login form component
│   │   ├── register-form.tsx     # Registration form
│   │   ├── reset-password-form.tsx
│   │   └── auth-provider.tsx     # Session provider wrapper
│   │
│   ├── profile/
│   │   ├── profile-form.tsx      # Edit profile
│   │   ├── avatar-upload.tsx     # Avatar upload
│   │   └── password-change.tsx   # Change password
│   │
│   └── team/
│       ├── team-member-list.tsx  # List team members
│       ├── invite-member.tsx     # Invite to team
│       └── role-badge.tsx        # Display user role
│
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client singleton
│   ├── email.ts                  # Email service (Resend)
│   └── validations/
│       ├── auth.ts               # Zod schemas for auth
│       └── user.ts               # Zod schemas for user
│
├── types/
│   ├── auth.ts                   # Auth type definitions
│   └── user.ts                   # User & Team types
│
└── middleware.ts                 # Route protection middleware

prisma/
└── schema.prisma                 # Database schema
```

---

## Database Schema

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// AUTHENTICATION MODELS
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String

  // Basic Info
  firstName     String
  lastName      String
  phoneNumber   String?
  whatsappNumber String?
  avatar        String?

  // Status
  emailVerified DateTime?
  isActive      Boolean   @default(true)

  // Team & Role
  role          UserRole  @default(MEMBER)
  teamId        String?
  team          Team?     @relation(fields: [teamId], references: [id])

  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?

  // Relations
  sessions      Session[]
  accounts      Account[]
  passwordResets PasswordReset[]

  // Dashboard Relations (connect to existing models later)
  contacts      Contact[]
  shipments     Shipment[]

  @@index([email])
  @@index([teamId])
  @@map("users")
}

model Team {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  avatar      String?

  // Team Owner
  ownerId     String

  // Members
  members     User[]

  // Settings
  maxMembers  Int       @default(10)
  isActive    Boolean   @default(true)

  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations (shared resources)
  contacts    Contact[]

  @@index([slug])
  @@map("teams")
}

enum UserRole {
  ADMIN         // Full system access
  TEAM_LEADER   // Manage team and resources
  MEMBER        // Standard access
  VIEWER        // Read-only access
}

// ============================================
// NEXTAUTH REQUIRED MODELS
// ============================================

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ============================================
// PASSWORD RESET
// ============================================

model PasswordReset {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expires   DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([userId])
  @@map("password_resets")
}

// ============================================
// PLACEHOLDER MODELS (to be implemented later)
// ============================================

model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String?
  phone     String?
  userId    String
  teamId    String?
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  team      Team?    @relation(fields: [teamId], references: [id])

  @@index([userId])
  @@index([teamId])
  @@map("contacts")
}

model Shipment {
  id          String   @id @default(cuid())
  trackingId  String   @unique
  origin      String
  destination String
  status      String
  userId      String
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("shipments")
}
```

### Database Relationships

```
User ──┬─▶ Team (many-to-one)
       ├─▶ Session (one-to-many)
       ├─▶ Account (one-to-many)
       ├─▶ PasswordReset (one-to-many)
       ├─▶ Contact (one-to-many)
       └─▶ Shipment (one-to-many)

Team ──┬─▶ User (one-to-many)
       └─▶ Contact (one-to-many, shared resources)
```

---

## Feature Specifications

### 1. User Registration (Simplified)

#### Overview

Clean, minimal registration flow with only essential fields.

#### User Story

> As a new user, I want to quickly create an account with minimal information so I can start using the platform immediately.

#### Required Fields

1. **First Name** (text, required, 2-50 chars)
2. **Last Name** (text, required, 2-50 chars)
3. **Email** (email, required, unique, validated)
4. **Password** (password, required, min 8 chars)
5. **Confirm Password** (password, required, must match)

#### Optional Fields

- WhatsApp Number (phone, optional, with country code)

#### Form Features

- Real-time validation with Zod
- Password strength indicator (weak/medium/strong)
- Show/hide password toggle
- Email availability check (debounced)
- Terms & Privacy policy checkbox (required)

#### Registration Flow

```
1. User fills registration form
   ↓
2. Client-side validation (Zod)
   ↓
3. POST /api/auth/register
   ↓
4. Server validates:
   - Email uniqueness
   - Password strength
   - Required fields
   ↓
5. Hash password (bcryptjs, 12 rounds)
   ↓
6. Create User record in database
   ↓
7. Auto-login with NextAuth
   ↓
8. Redirect to /dashboard
```

#### API Endpoint

**POST** `/api/auth/register`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "whatsappNumber": "+1234567890"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "clx...",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "John"
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Email already registered"
}
```

#### Validation Schema (Zod)

```typescript
import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters'),

    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters'),

    email: z.string().email('Invalid email address').toLowerCase(),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),

    confirmPassword: z.string(),

    whatsappNumber: z
      .string()
      .optional()
      .refine(val => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
        message: 'Invalid phone number format',
      }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
```

#### UI Component Structure

```typescript
// src/components/auth/register-form.tsx

<Form>
  <div className="grid grid-cols-2 gap-4">
    <Input label="First Name" name="firstName" />
    <Input label="Last Name" name="lastName" />
  </div>

  <Input type="email" label="Email" name="email" />

  <Input
    type="password"
    label="Password"
    name="password"
    rightIcon={<PasswordToggle />}
  />
  <PasswordStrengthIndicator password={password} />

  <Input
    type="password"
    label="Confirm Password"
    name="confirmPassword"
  />

  <PhoneInput
    label="WhatsApp Number (Optional)"
    name="whatsappNumber"
  />

  <Checkbox>
    I agree to the Terms of Service and Privacy Policy
  </Checkbox>

  <Button type="submit" fullWidth loading={isSubmitting}>
    Create Account
  </Button>

  <p>Already have an account? <Link href="/login">Sign in</Link></p>
</Form>
```

#### Security Measures

- Password hashing with bcryptjs (12 rounds)
- Rate limiting (max 5 registration attempts per IP per hour)
- CSRF protection (NextAuth built-in)
- Email validation before account activation
- Sanitize all inputs

#### Post-Registration Actions

1. Create user session (auto-login)
2. Send welcome email (optional)
3. Redirect to dashboard
4. Show onboarding tour (optional)

---

### 2. User Login

#### Overview

Secure login with email and password, with session management.

#### User Story

> As a registered user, I want to securely log in to access my dashboard and data.

#### Login Fields

1. **Email** (email, required)
2. **Password** (password, required)
3. **Remember Me** (checkbox, optional - extends session to 30 days)

#### Login Flow

```
1. User enters credentials
   ↓
2. Client validates form
   ↓
3. POST to NextAuth API (signIn)
   ↓
4. NextAuth validates credentials:
   - Find user by email
   - Compare password hash
   ↓
5. Create session (JWT + database session)
   ↓
6. Set httpOnly cookie
   ↓
7. Redirect to /dashboard
```

#### NextAuth Configuration

```typescript
// src/lib/auth.ts

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { team: true },
        });

        if (!user || !user.isActive) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          teamId: user.teamId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.teamId = user.teamId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.teamId = token.teamId as string;
      }
      return session;
    },
  },
});
```

#### Login UI Component

```typescript
// src/components/auth/login-form.tsx

<Form onSubmit={handleLogin}>
  <Input
    type="email"
    label="Email"
    name="email"
    autoComplete="email"
  />

  <Input
    type="password"
    label="Password"
    name="password"
    autoComplete="current-password"
    rightIcon={<PasswordToggle />}
  />

  <div className="flex items-center justify-between">
    <Checkbox name="rememberMe">Remember me</Checkbox>
    <Link href="/forgot-password">Forgot password?</Link>
  </div>

  <Button type="submit" fullWidth loading={isSubmitting}>
    Sign In
  </Button>

  <p>Don't have an account? <Link href="/register">Sign up</Link></p>
</Form>
```

#### Session Management

- **JWT Strategy:** Tokens stored in httpOnly cookies
- **Session Duration:** 30 days (with remember me) or 7 days (default)
- **Inactivity Timeout:** 30 minutes of inactivity logs out user
- **Refresh:** Auto-refresh token before expiry

#### Security Features

- Rate limiting (max 5 failed attempts, then 15-min lockout)
- CSRF protection
- httpOnly cookies (prevent XSS)
- Secure flag on production
- Password comparison timing attack protection (bcrypt)

---

### 3. Forgot Password

#### Overview

Secure password reset via email with time-limited tokens.

#### User Story

> As a user who forgot my password, I want to receive a secure reset link via email so I can regain access to my account.

#### Reset Password Flow

```
1. User enters email on /forgot-password
   ↓
2. POST /api/auth/reset-password (request)
   ↓
3. Server checks if email exists
   ↓
4. Generate secure token (crypto.randomBytes)
   ↓
5. Store token in database (expires in 1 hour)
   ↓
6. Send email with reset link
   ↓
7. User clicks link: /reset-password?token=xxx
   ↓
8. User enters new password
   ↓
9. POST /api/auth/reset-password (confirm)
   ↓
10. Validate token (not expired, not used)
   ↓
11. Hash new password
   ↓
12. Update user password
   ↓
13. Mark token as used
   ↓
14. Redirect to /login with success message
```

#### API Endpoints

**POST** `/api/auth/reset-password/request`

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "If this email exists, a reset link has been sent"
}
```

**POST** `/api/auth/reset-password/confirm`

**Request:**

```json
{
  "token": "abc123...",
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### Token Generation

```typescript
// src/lib/auth/password-reset.ts

import crypto from 'crypto';

export async function createPasswordResetToken(userId: string) {
  // Generate secure random token
  const token = crypto.randomBytes(32).toString('hex');

  // Hash token for storage
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Store in database
  await prisma.passwordReset.create({
    data: {
      userId,
      token: hashedToken,
      expires: new Date(Date.now() + 3600000), // 1 hour
    },
  });

  return token; // Return unhashed token for email
}

export async function verifyPasswordResetToken(token: string) {
  // Hash provided token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find in database
  const resetRecord = await prisma.passwordReset.findUnique({
    where: { token: hashedToken },
    include: { user: true },
  });

  // Validate
  if (!resetRecord || resetRecord.used) {
    throw new Error('Invalid or expired token');
  }

  if (resetRecord.expires < new Date()) {
    throw new Error('Token expired');
  }

  return resetRecord;
}
```

#### Email Template

```typescript
// src/lib/email/templates/password-reset.tsx

export const PasswordResetEmail = ({
  firstName,
  resetLink,
}: {
  firstName: string;
  resetLink: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Email styles */
  </style>
</head>
<body>
  <h1>Password Reset Request</h1>
  <p>Hi ${firstName},</p>
  <p>You requested to reset your password. Click the button below to continue:</p>

  <a href="${resetLink}" style="background: #6366f1; color: white; padding: 12px 24px;">
    Reset Password
  </a>

  <p>This link will expire in 1 hour.</p>
  <p>If you didn't request this, please ignore this email.</p>
</body>
</html>
`;
```

#### Security Measures

- Tokens expire after 1 hour
- Tokens can only be used once
- Tokens are hashed in database
- Rate limit reset requests (3 per hour per IP)
- Don't reveal if email exists (return success regardless)
- Log all password reset attempts

---

### 4. User Profile

#### Overview

Simple user profile management with basic information editing.

#### User Story

> As a user, I want to view and edit my profile information so I can keep my account details up to date.

#### Profile Sections

#### A. View Profile

- Full name
- Email address
- WhatsApp number
- Role badge
- Team membership
- Account created date
- Last login date

#### B. Edit Profile

**Editable Fields:**

- First name
- Last name
- WhatsApp number
- Avatar/photo (optional)

**Non-editable:**

- Email (requires verification flow)
- Role (admin only)
- Team (requires team leader approval)

#### Profile Page UI Structure

```typescript
// src/app/dashboard/profile/page.tsx

<DashboardLayout>
  <div className="max-w-4xl mx-auto">
    <h1>Profile Settings</h1>

    {/* Profile Header */}
    <Card>
      <div className="flex items-center gap-6">
        <Avatar size="xl" src={user.avatar} />
        <div>
          <h2>{user.firstName} {user.lastName}</h2>
          <p>{user.email}</p>
          <RoleBadge role={user.role} />
        </div>
      </div>
    </Card>

    {/* Edit Profile Form */}
    <Card>
      <h3>Personal Information</h3>
      <ProfileForm user={user} />
    </Card>

    {/* Change Password */}
    <Card>
      <h3>Security</h3>
      <PasswordChangeForm />
    </Card>

    {/* Team Information */}
    {user.team && (
      <Card>
        <h3>Team</h3>
        <TeamInfo team={user.team} />
      </Card>
    )}
  </div>
</DashboardLayout>
```

#### Profile Update API

**PATCH** `/api/user/profile`

**Request:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "whatsappNumber": "+1234567890"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "clx...",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com",
    "whatsappNumber": "+1234567890"
  }
}
```

#### Password Change Flow

**POST** `/api/user/change-password`

**Request:**

```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!",
  "confirmPassword": "NewPass456!"
}
```

**Validation:**

1. Verify current password
2. Validate new password strength
3. Ensure new password != current password
4. Update password hash
5. Invalidate all other sessions (optional)

#### Avatar Upload (Optional)

**POST** `/api/user/avatar`

**Request:** FormData with image file

**Process:**

1. Validate file type (jpg, png, webp)
2. Validate file size (max 2MB)
3. Resize image (200x200)
4. Upload to storage (Supabase Storage or Cloudinary)
5. Update user avatar URL
6. Delete old avatar

---

### 5. Teams/Groups (Simplified)

#### Overview

Basic team collaboration with role-based access control.

#### User Story

> As a team leader, I want to create a team and invite members so we can share contacts and resources.

#### Team Features (Simplified)

#### A. Team Structure

- **One team per user** (simplified, no multiple teams)
- **Team roles:** Owner, Member, Viewer
- **Shared resources:** Contacts only (for MVP)

#### B. Team Roles & Permissions

| Feature              | Owner | Member | Viewer |
| -------------------- | ----- | ------ | ------ |
| View team members    | ✅    | ✅     | ✅     |
| View shared contacts | ✅    | ✅     | ✅     |
| Add/edit contacts    | ✅    | ✅     | ❌     |
| Invite members       | ✅    | ❌     | ❌     |
| Remove members       | ✅    | ❌     | ❌     |
| Delete team          | ✅    | ❌     | ❌     |

#### C. Team Creation Flow

```
1. User clicks "Create Team" in dashboard
   ↓
2. Fill team form:
   - Team name
   - Description (optional)
   ↓
3. POST /api/team/create
   ↓
4. Create Team record
   ↓
5. Set user as owner
   ↓
6. Update user.teamId
   ↓
7. Redirect to team page
```

#### D. Invite Member Flow (Simplified)

```
1. Team owner enters member email
   ↓
2. Check if user exists:
   - YES → Add to team directly
   - NO → Send invitation email
   ↓
3. New member receives notification
   ↓
4. Member joins team
   ↓
5. Member can access shared contacts
```

#### Team Management UI

```typescript
// src/app/dashboard/team/page.tsx

<DashboardLayout>
  <div className="max-w-6xl mx-auto">
    {/* Team Header */}
    <div className="flex items-center justify-between">
      <div>
        <h1>{team.name}</h1>
        <p>{team.description}</p>
      </div>
      {isOwner && (
        <Button onClick={openInviteModal}>
          <UserPlus /> Invite Member
        </Button>
      )}
    </div>

    {/* Team Members */}
    <Card>
      <h2>Team Members ({members.length})</h2>
      <TeamMemberList members={members} />
    </Card>

    {/* Shared Contacts */}
    <Card>
      <h2>Shared Contacts</h2>
      <ContactList contacts={sharedContacts} teamView />
    </Card>
  </div>
</DashboardLayout>
```

#### Team API Endpoints

**POST** `/api/team/create`

```json
{
  "name": "Supply Chain Team",
  "description": "Main logistics team"
}
```

**POST** `/api/team/invite`

```json
{
  "email": "member@example.com",
  "role": "MEMBER"
}
```

**DELETE** `/api/team/member/:userId`

- Remove member from team

**PATCH** `/api/team/member/:userId/role`

```json
{
  "role": "VIEWER"
}
```

#### Team Settings (Simplified)

- Change team name
- Update description
- Set max members (default: 10)
- Leave team (if not owner)
- Delete team (owner only, requires confirmation)

#### Shared Contact Rules

1. Contacts added by team members are automatically shared
2. Only creator or owner can delete shared contacts
3. Viewers can see but not modify contacts
4. Personal contacts (before joining team) remain private unless explicitly shared

---

## Implementation Timeline

### Phase 1: Foundation (Week 1)

**Days 1-2: Database Setup with Docker**

- [ ] Create docker-compose.yml for PostgreSQL
- [ ] Start PostgreSQL container with Docker
- [ ] Install Prisma dependencies (`npm install @prisma/client prisma`)
- [ ] Initialize Prisma (`npx prisma init`)
- [ ] Create prisma/schema.prisma with authentication models
- [ ] Configure DATABASE_URL in .env
- [ ] Run initial migration (`npx prisma migrate dev --name init`)
- [ ] Verify database connection (`npx prisma studio`)
- [ ] Seed test data (optional)

**Days 3-4: NextAuth Setup**

- [ ] Install NextAuth.js v5
- [ ] Create auth configuration (src/lib/auth.ts)
- [ ] Setup API route handler
- [ ] Create Prisma client singleton
- [ ] Test authentication flow

**Days 5-7: Auth UI Components**

- [ ] Create auth layout
- [ ] Build reusable form components
- [ ] Setup Zod validation schemas
- [ ] Create password strength indicator
- [ ] Style auth pages (match OKLCH theme)

**Deliverables:**

- Working database connection
- NextAuth configured and tested
- Auth UI component library

---

### Phase 2: Registration & Login (Week 2)

**Days 1-3: Registration**

- [ ] Create registration page UI
- [ ] Build registration form component
- [ ] Implement client-side validation
- [ ] Create registration API endpoint
- [ ] Add password hashing
- [ ] Test registration flow
- [ ] Add error handling

**Days 4-6: Login**

- [ ] Create login page UI
- [ ] Build login form component
- [ ] Implement NextAuth credentials provider
- [ ] Add session management
- [ ] Create SessionProvider wrapper
- [ ] Test login flow
- [ ] Add "remember me" functionality

**Day 7: Testing & Refinement**

- [ ] End-to-end testing
- [ ] Fix bugs
- [ ] Improve error messages
- [ ] Add loading states

**Deliverables:**

- Working registration system
- Working login system
- Session management functional

---

### Phase 3: Password Reset & Protection (Week 3)

**Days 1-3: Forgot Password**

- [ ] Create forgot password page
- [ ] Build reset password form
- [ ] Implement token generation
- [ ] Create password reset API
- [ ] Setup email service (Resend)
- [ ] Create email templates
- [ ] Test reset flow

**Days 4-5: Route Protection**

- [ ] Create middleware.ts
- [ ] Implement route protection logic
- [ ] Add role-based access control
- [ ] Protect dashboard routes
- [ ] Add unauthorized redirect
- [ ] Test protection

**Days 6-7: Integration**

- [ ] Connect navbar to real user data
- [ ] Add logout functionality
- [ ] Update dashboard layout
- [ ] Test all auth flows together

**Deliverables:**

- Password reset working
- All routes protected
- Dashboard integrated with auth

---

### Phase 4: User Profile (Week 4)

**Days 1-3: Profile Page**

- [ ] Create profile page UI
- [ ] Build profile form component
- [ ] Implement profile update API
- [ ] Add avatar upload (optional)
- [ ] Test profile updates

**Days 4-5: Password Change**

- [ ] Create password change form
- [ ] Implement change password API
- [ ] Add current password verification
- [ ] Test password change flow

**Days 6-7: Polish & Testing**

- [ ] Add profile validation
- [ ] Improve UI/UX
- [ ] Add success notifications
- [ ] Test edge cases

**Deliverables:**

- Functional profile management
- Password change working
- Polished user experience

---

### Phase 5: Teams (Week 5)

**Days 1-3: Team Creation**

- [ ] Create team page UI
- [ ] Build team creation form
- [ ] Implement team creation API
- [ ] Add team to database
- [ ] Update user with teamId
- [ ] Test team creation

**Days 4-5: Team Member Management**

- [ ] Create invite member form
- [ ] Implement invite API
- [ ] Build member list component
- [ ] Add remove member functionality
- [ ] Test member operations

**Days 6-7: Shared Resources**

- [ ] Update contacts model
- [ ] Add team filtering to contacts
- [ ] Implement shared contact logic
- [ ] Test resource sharing
- [ ] Final integration testing

**Deliverables:**

- Team creation working
- Member management functional
- Shared contacts implemented

---

### Phase 6: Testing & Deployment (Week 6)

**Days 1-2: Comprehensive Testing**

- [ ] Unit tests for auth functions
- [ ] Integration tests for auth flows
- [ ] E2E tests with Playwright
- [ ] Security testing
- [ ] Performance testing

**Days 3-4: Bug Fixes & Polish**

- [ ] Fix discovered bugs
- [ ] Improve error handling
- [ ] Add loading states
- [ ] Optimize queries
- [ ] Improve accessibility

**Days 5-7: Deployment**

- [ ] Setup production database
- [ ] Configure environment variables
- [ ] Deploy to Vercel
- [ ] Test production environment
- [ ] Setup monitoring
- [ ] Create documentation

**Deliverables:**

- Production-ready auth system
- Deployed application
- Complete documentation

---

## Security Considerations

### Authentication Security

#### Password Security

- **Hashing Algorithm:** bcryptjs with 12 rounds
- **Minimum Strength:** 8 characters, uppercase, lowercase, number
- **Storage:** Never store plain text passwords
- **Transmission:** Always use HTTPS in production

#### Session Security

- **Token Type:** JWT stored in httpOnly cookies
- **Cookie Flags:**
  - `httpOnly: true` (prevents XSS)
  - `secure: true` (HTTPS only in production)
  - `sameSite: 'lax'` (CSRF protection)
- **Session Duration:** 30 days max, 30 min inactivity timeout
- **Token Refresh:** Auto-refresh before expiry

#### API Security

- **CSRF Protection:** NextAuth built-in CSRF tokens
- **Rate Limiting:** Implement with `@upstash/ratelimit`
  - Registration: 5 attempts/hour per IP
  - Login: 5 failed attempts → 15 min lockout
  - Password reset: 3 requests/hour per IP
- **Input Validation:** All inputs validated with Zod
- **SQL Injection:** Prisma parameterized queries (built-in protection)
- **XSS Prevention:** React auto-escaping + Content Security Policy

### Data Protection

#### Sensitive Data

- Passwords: bcryptjs hashed, never logged
- Reset tokens: SHA-256 hashed in database
- Session tokens: httpOnly, not accessible via JavaScript
- Email: Stored in plaintext (needed for communication)

#### Database Security

- **Connection:** SSL/TLS encrypted (enable in production)
- **Access Control:** Database user with minimal permissions
- **Backups:** Implement automated daily backups (using pg_dump or managed service)
- **Audit Logs:** Log all auth-related actions
- **Docker Security:** Don't expose PostgreSQL port publicly in production

#### Environment Variables

```env
# .env (never commit this file)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generated-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://yourdomain.com"
RESEND_API_KEY="re_..."
```

### Compliance & Privacy

#### GDPR Considerations

- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] Cookie consent (if using analytics)
- [ ] Data export capability
- [ ] Account deletion capability
- [ ] Clear data retention policy

#### Data Retention

- Active users: Indefinite
- Password reset tokens: 1 hour, then deleted
- Unused accounts: Archive after 2 years of inactivity
- Deleted accounts: 30-day soft delete, then permanent

---

## Testing Strategy

### Unit Tests

```typescript
// tests/auth/password.test.ts
describe('Password Hashing', () => {
  it('should hash password correctly', async () => {
    const password = 'Test123!';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(await verifyPassword(password, hash)).toBe(true);
  });
});

// tests/auth/validation.test.ts
describe('Registration Validation', () => {
  it('should reject weak passwords', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'weak',
    });
    expect(result.success).toBe(false);
  });
});
```

### Integration Tests

```typescript
// tests/auth/registration.test.ts
describe('Registration Flow', () => {
  it('should register new user', async () => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Test123!',
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it('should prevent duplicate email', async () => {
    // Register first user
    await registerUser({ email: 'test@example.com' });

    // Try to register again
    const response = await registerUser({ email: 'test@example.com' });
    expect(response.status).toBe(400);
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should complete registration flow', async ({ page }) => {
    await page.goto('/register');

    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="password"]', 'Test123!');
    await page.fill('[name="confirmPassword"]', 'Test123!');
    await page.check('[name="terms"]');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
  });

  test('should login existing user', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="password"]', 'Test123!');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=John Doe')).toBeVisible();
  });
});
```

### Security Tests

```typescript
// tests/security/auth.test.ts
describe('Security', () => {
  it('should prevent brute force attacks', async () => {
    // Attempt 6 failed logins
    for (let i = 0; i < 6; i++) {
      await attemptLogin({ email: 'test@example.com', password: 'wrong' });
    }

    // 6th attempt should be rate limited
    const response = await attemptLogin({
      email: 'test@example.com',
      password: 'wrong',
    });

    expect(response.status).toBe(429); // Too Many Requests
  });

  it('should invalidate expired reset tokens', async () => {
    const token = await createResetToken('user-id');

    // Simulate time passing (mock Date.now)
    jest.advanceTimersByTime(3600001); // 1 hour + 1ms

    await expect(verifyResetToken(token)).rejects.toThrow('Token expired');
  });
});
```

### Test Coverage Goals

- **Unit Tests:** 80%+ coverage
- **Integration Tests:** All API endpoints
- **E2E Tests:** Critical user flows
- **Security Tests:** All attack vectors

---

## Deployment Checklist

### Pre-Deployment

#### Environment Setup

- [ ] Create production database (options: Supabase, Railway, Neon, or self-hosted)
- [ ] Generate secure NEXTAUTH_SECRET (`openssl rand -base64 32`)
- [ ] Configure production environment variables
- [ ] Setup email service (Resend)
- [ ] Configure domain settings
- [ ] Ensure PostgreSQL is secured and not publicly accessible

#### Database

- [ ] Run production migrations
- [ ] Verify schema matches development
- [ ] Setup automated backups
- [ ] Configure connection pooling
- [ ] Test database connection

#### Security

- [ ] Enable HTTPS (Vercel default)
- [ ] Configure CSP headers
- [ ] Setup rate limiting
- [ ] Enable CORS restrictions
- [ ] Review all environment variables

### Deployment

#### Vercel Configuration

```json
// vercel.json
{
  "env": {
    "NEXTAUTH_URL": "https://yourdomain.com",
    "DATABASE_URL": "@database-url"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

#### Build & Deploy

- [ ] Run production build locally
- [ ] Fix any build errors
- [ ] Deploy to Vercel
- [ ] Verify deployment successful
- [ ] Check logs for errors

### Post-Deployment

#### Testing

- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test password reset
- [ ] Test protected routes
- [ ] Test team features
- [ ] Verify email sending works

#### Monitoring

- [ ] Setup error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Setup performance monitoring
- [ ] Create admin dashboard
- [ ] Setup log aggregation

#### Documentation

- [ ] Update README with auth setup
- [ ] Document API endpoints
- [ ] Create user guide
- [ ] Document admin procedures
- [ ] Create runbook for issues

---

## Maintenance & Support

### Regular Maintenance

#### Weekly

- Review error logs
- Check performance metrics
- Monitor authentication failures
- Review security logs

#### Monthly

- Update dependencies
- Review user feedback
- Analyze usage patterns
- Test backup restoration

#### Quarterly

- Security audit
- Performance optimization
- Feature review
- User satisfaction survey

### Common Issues & Solutions

#### Issue: Users can't login

**Causes:**

- Incorrect password
- Account not found
- Session expired
- Database connection issue

**Solutions:**

1. Check error logs
2. Verify database connection
3. Check rate limiting status
4. Review user account status

#### Issue: Password reset not working

**Causes:**

- Email not sending
- Token expired
- Token already used
- Invalid token

**Solutions:**

1. Check email service logs
2. Verify token generation
3. Check token expiry time
4. Review database records

#### Issue: Session keeps expiring

**Causes:**

- Cookie settings incorrect
- JWT secret changed
- Database session deleted
- Browser security settings

**Solutions:**

1. Verify cookie configuration
2. Check NEXTAUTH_SECRET
3. Review session duration
4. Test in different browser

---

## Appendix

### A. Dependencies to Install

```json
{
  "dependencies": {
    "next-auth": "^5.0.0",
    "@auth/prisma-adapter": "^2.0.0",
    "@prisma/client": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "resend": "^3.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "@types/bcryptjs": "^2.4.6"
  }
}
```

### B. Docker Configuration

Create a `docker-compose.yml` file in the project root:

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: ubhaya_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ubhaya_user
      POSTGRES_PASSWORD: ubhaya_password
      POSTGRES_DB: ubhaya_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ubhaya_user -d ubhaya_db']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
    driver: local
```

**Usage:**

```bash
# Start database
docker-compose up -d

# Check if it's running
docker-compose ps

# View logs
docker-compose logs -f postgres

# Stop database
docker-compose down

# Stop and remove all data (⚠️ destructive)
docker-compose down -v
```

**Optional: Add to `.gitignore`**

```
# Docker
docker-compose.override.yml
postgres_data/
```

### C. Environment Variables Template

```env
# .env.local
# Database (Docker PostgreSQL)
DATABASE_URL="postgresql://ubhaya_user:ubhaya_password@localhost:5432/ubhaya_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3006"
NEXTAUTH_SECRET="your-secret-generated-with-openssl-rand-base64-32"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxx"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Optional: Analytics, Monitoring, etc.
```

**Note:** For production, use a more secure password and change the database credentials.

### D. Useful Commands

```bash
# Docker Commands
docker-compose up -d              # Start PostgreSQL in background
docker-compose down               # Stop PostgreSQL
docker-compose logs postgres      # View PostgreSQL logs
docker-compose ps                 # Check container status

# Prisma/Database Commands
npx prisma init                   # Initialize Prisma
npx prisma migrate dev            # Run migrations in development
npx prisma migrate dev --name init # Run initial migration
npx prisma generate               # Generate Prisma Client
npx prisma studio                 # Open Prisma Studio GUI
npx prisma db push                # Push schema without migrations
npx prisma db seed                # Seed database

# Development
npm run dev                       # Start Next.js dev server
npm run build                     # Build for production
npm run start                     # Start production server

# Testing
npm run test                      # Run unit tests
npm run test:e2e                  # Run E2E tests
npm run test:coverage             # Run tests with coverage
```

### E. Reference Links

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Resend Documentation](https://resend.com/docs)
- [OWASP Authentication Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## Document History

| Version | Date       | Author      | Changes                                                                     |
| ------- | ---------- | ----------- | --------------------------------------------------------------------------- |
| 1.1     | 2025-11-11 | Claude Code | Updated for Docker PostgreSQL setup, added docker-compose.yml configuration |
| 1.0     | 2025-11-11 | Claude Code | Initial comprehensive plan                                                  |

---

**End of Document**
