# Admin Backend Plan - Ubhaya Supply Chain

This document outlines what admin features exist, what's missing, and what needs to be implemented.

---

## Current State Overview

### Organizational Hierarchy

```
Organization (Multi-tenant container)
    └── Team (Work group)
        └── TeamMember (User assignment)
            └── User (Individual account)
```

### 7 Main Features (Sidebar)
| Feature | Status | Admin Capabilities |
|---------|--------|-------------------|
| Facilities | Partial | Read-only, no admin management |
| Contacts | Complete | CRUD by users, no admin override |
| Documents | Complete | CRUD by users, no admin override |
| Team | Complete | Self-service team management |
| Organization | Complete | Create, manage members, roles |
| Shipment Calc | Stub | No implementation |
| Profile | Complete | User profile management |

### User Roles (Global System)
- `ADMIN` - Full system access
- `TEAM_LEADER` - Manage teams and resources
- `MEMBER` - Standard access
- `VIEWER` - Read-only access

### Organization Roles (Per-Organization)
- `OWNER` - Full control, can delete organization
- `ADMIN` - Manage members, teams, settings
- `MEMBER` - Standard access to organization resources
- `GUEST` - Read-only, limited access

---

## What EXISTS (Already Implemented)

### Authentication & Users
- [x] User registration & login (NextAuth.js v5)
- [x] Profile management (avatar, password, personal info)
- [x] Password reset flow
- [x] Session management (JWT, 30-day expiry)
- [x] User roles in database (ADMIN, TEAM_LEADER, MEMBER, VIEWER)

### Organization Management (NEW)
- [x] Create organization (user becomes OWNER)
- [x] Organization dashboard with stats (members, teams, slug, role)
- [x] Invite members by email with role selection
- [x] Update member organization roles (OWNER/ADMIN only)
- [x] Remove members from organization
- [x] Leave organization (non-owners)
- [x] Organization roles: OWNER, ADMIN, MEMBER, GUEST
- [x] Authorization utilities for org permissions
- [x] Session includes organizationId and orgRole

**Organization API Routes:**
```
GET    /api/organization                         - List user's organizations
POST   /api/organization                         - Create new organization
GET    /api/organization/[id]                    - Get organization details
PATCH  /api/organization/[id]                    - Update organization
DELETE /api/organization/[id]                    - Delete organization (owner only)
GET    /api/organization/[id]/members            - List organization members
POST   /api/organization/[id]/members            - Invite member
PATCH  /api/organization/[id]/members/[userId]   - Update member role
DELETE /api/organization/[id]/members/[userId]   - Remove member
```

**Organization Components:**
- `src/components/organization/org-page-content.tsx` - Main page
- `src/components/organization/create-org-form.tsx` - Create form
- `src/components/organization/org-member-list.tsx` - Member management
- `src/components/organization/invite-org-member.tsx` - Invite form

### Team Management (Self-Service)
- [x] Create team (user becomes OWNER)
- [x] Invite members by email
- [x] Remove members (leaders/owners only)
- [x] Update member team roles
- [x] Leave team
- [x] Delete team (owner only)
- [x] Multi-team support per user
- [x] Teams belong to an organization (organizationId foreign key)

### Contacts Management
- [x] Full CRUD operations
- [x] Contact notes with pinning
- [x] Team contacts vs personal contacts
- [x] Search and filter
- [x] Activity logging

### Documents Management
- [x] Full CRUD operations
- [x] File upload to S3 (up to 50MB)
- [x] Document types (NOTE, FILE, MEETING_NOTE, TEMPLATE)
- [x] Visibility levels (PRIVATE, TEAM, SHARED)
- [x] Comments with threading
- [x] @mentions with notifications
- [x] Link documents to contacts/facilities

### Facilities
- [x] Read-only database (4,850+ facilities)
- [x] Search and filter
- [x] Pagination

### Activity & Audit
- [x] Comprehensive activity logging (20+ action types)
- [x] Team-scoped activity feeds
- [x] User action tracking

---

## What's MISSING (Needs Implementation)

### 1. Admin Dashboard & Pages

**Priority: HIGH**

| Page | Purpose | Status |
|------|---------|--------|
| `/dashboard/admin` | Admin overview dashboard | NOT EXISTS |
| `/dashboard/admin/users` | User management | NOT EXISTS |
| `/dashboard/admin/teams` | Team oversight | NOT EXISTS |
| `/dashboard/admin/facilities` | Facility data import | NOT EXISTS |
| `/dashboard/admin/activity` | System-wide activity log | NOT EXISTS |
| `/dashboard/admin/settings` | System settings | NOT EXISTS |

### 2. User Management (Admin)

**Priority: HIGH**

Currently, admins cannot:
- [ ] View all users in the system
- [ ] Change user global roles (ADMIN, TEAM_LEADER, etc.)
- [ ] Deactivate/suspend users
- [ ] Reset user passwords
- [ ] View user activity history
- [ ] Impersonate users for support
- [ ] Bulk user operations

**API Routes Needed:**
```
GET    /api/admin/users              - List all users with filters
GET    /api/admin/users/[id]         - Get user details
PATCH  /api/admin/users/[id]         - Update user (role, status)
DELETE /api/admin/users/[id]         - Deactivate user
POST   /api/admin/users/[id]/reset-password - Admin password reset
GET    /api/admin/users/[id]/activity - User activity history
```

### 3. Organization Management (Admin)

**Priority: HIGH**

Currently, admins cannot:
- [ ] View all organizations in the system
- [ ] Create organizations for users
- [ ] Update any organization settings
- [ ] Add/remove members from any organization
- [ ] Transfer organization ownership
- [ ] Adjust organization limits (maxTeams, maxMembers)
- [ ] Deactivate/delete organizations
- [ ] View organization analytics

**API Routes Needed:**
```
GET    /api/admin/organizations                    - List all organizations
POST   /api/admin/organizations                    - Create organization (assign owner)
GET    /api/admin/organizations/[id]               - Get organization details
PATCH  /api/admin/organizations/[id]               - Update organization settings
DELETE /api/admin/organizations/[id]               - Deactivate/delete organization
POST   /api/admin/organizations/[id]/transfer      - Transfer ownership
GET    /api/admin/organizations/[id]/members       - List all members
POST   /api/admin/organizations/[id]/members       - Admin add member
PATCH  /api/admin/organizations/[id]/members/[userId] - Admin update member role
DELETE /api/admin/organizations/[id]/members/[userId] - Admin remove member
GET    /api/admin/organizations/stats              - Organization statistics
```

**Admin Organization Page Features:**
- List all organizations with search/filter
- Create new organization (select owner from users)
- Edit organization details (name, description, limits)
- Manage organization members (add, remove, change roles)
- Transfer ownership to another member
- View organization stats (members, teams, resources)
- Deactivate/reactivate organizations

### 4. Team Oversight (Admin)

**Priority: MEDIUM**

Currently, admins cannot:
- [ ] View all teams in the system
- [ ] Add/remove members from any team
- [ ] Transfer team ownership
- [ ] Adjust team capacity limits
- [ ] Deactivate teams
- [ ] View team analytics

**API Routes Needed:**
```
GET    /api/admin/teams              - List all teams
GET    /api/admin/teams/[id]         - Get team details
PATCH  /api/admin/teams/[id]         - Update team settings
DELETE /api/admin/teams/[id]         - Deactivate team
POST   /api/admin/teams/[id]/transfer - Transfer ownership
POST   /api/admin/teams/[id]/members  - Admin add member
DELETE /api/admin/teams/[id]/members/[userId] - Admin remove member
```

### 4. Facilities Data Import

**Priority: HIGH**

Currently:
- Facilities are static JSON files
- No way to add/update/delete facilities
- No import mechanism

**What's Needed:**
- [ ] Facility CRUD operations
- [ ] CSV/Excel import functionality
- [ ] Bulk import with validation
- [ ] Import history/logs
- [ ] Data validation rules

**API Routes Needed:**
```
POST   /api/admin/facilities         - Create facility
PATCH  /api/admin/facilities/[id]    - Update facility
DELETE /api/admin/facilities/[id]    - Delete facility
POST   /api/admin/facilities/import  - Bulk import from CSV
GET    /api/admin/facilities/import/history - Import logs
POST   /api/admin/facilities/export  - Export to CSV
```

**Database Change Required:**
- Move facilities from JSON to Prisma/PostgreSQL
- Create `Facility` model in schema

### 5. Data Import/Export

**Priority: MEDIUM**

Missing for all entities:
- [ ] Export contacts to CSV
- [ ] Import contacts from CSV
- [ ] Export documents metadata
- [ ] Export team data
- [ ] Backup/restore functionality

**API Routes Needed:**
```
POST   /api/admin/export/contacts    - Export contacts
POST   /api/admin/import/contacts    - Import contacts
POST   /api/admin/export/documents   - Export documents
POST   /api/admin/export/teams       - Export teams
```

### 6. Shipment Calculator

**Priority: LOW** (stub exists, unclear if needed)

- [ ] Define calculation logic
- [ ] Create API routes
- [ ] Build calculator UI
- [ ] Integrate with facilities data

### 7. System Settings

**Priority: LOW**

- [ ] Application configuration
- [ ] Feature flags
- [ ] Email templates
- [ ] Notification settings
- [ ] API rate limits

### 8. Analytics & Reports

**Priority: LOW**

- [ ] User growth metrics
- [ ] Team activity metrics
- [ ] Document usage stats
- [ ] Contact engagement
- [ ] System health monitoring

---

## Implementation Phases

### Phase 1: Core Admin Infrastructure (HIGH PRIORITY)

**Goal:** Enable admin user and organization management

1. **Admin Middleware & Guards**
   - Create admin route protection
   - Add admin check to authorization.ts
   - Implement admin-only API middleware

2. **Admin Dashboard**
   - Page: `/dashboard/admin`
   - Overview cards: Total users, organizations, teams, documents, contacts
   - Recent activity feed
   - Quick actions

3. **User Management**
   - API: `/api/admin/users/*`
   - Page: `/dashboard/admin/users`
   - Features: List, search, role change, deactivate

4. **Organization Management (Admin)**
   - API: `/api/admin/organizations/*`
   - Page: `/dashboard/admin/organizations`
   - Features: List all orgs, create org (assign owner), edit settings, manage members
   - Create organization dialog with owner selection
   - Organization detail page with member management

### Phase 2: Facilities Import (HIGH PRIORITY)

**Goal:** Allow admin to manage facilities data

1. **Database Migration**
   - Create Facility model in Prisma
   - Migrate existing JSON data to PostgreSQL
   - Update facilities API to use database

2. **Facility CRUD**
   - API: `/api/admin/facilities/*`
   - Page: `/dashboard/admin/facilities`
   - Features: Add, edit, delete facilities

3. **Bulk Import**
   - CSV import parser
   - Validation rules
   - Import progress UI
   - Error reporting

### Phase 3: Team Oversight (MEDIUM PRIORITY)

**Goal:** Admin control over all teams

1. **Team Management API**
   - API: `/api/admin/teams/*`
   - Admin overrides for team operations

2. **Team Admin Page**
   - Page: `/dashboard/admin/teams`
   - Features: View all teams, member management, ownership transfer

### Phase 4: Import/Export (MEDIUM PRIORITY)

**Goal:** Data portability

1. **Export Functions**
   - Contacts export (CSV)
   - Documents metadata export
   - Team data export

2. **Import Functions**
   - Contacts import with validation
   - Duplicate detection
   - Import preview

### Phase 5: Analytics & Extras (LOW PRIORITY)

1. **Analytics Dashboard**
2. **System Settings**
3. **Audit Log Viewer**
4. **Shipment Calculator (if needed)**

---

## Database Changes Required

### Already Implemented Models

```prisma
// Organization layer (IMPLEMENTED)

model Organization {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  avatar      String?
  ownerId     String
  owner       User     @relation("OrganizationOwner", fields: [ownerId], references: [id])
  maxTeams    Int      @default(5)
  maxMembers  Int      @default(50)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members     OrganizationMember[]
  teams       Team[]
  contacts    Contact[]    @relation("OrganizationContacts")
  documents   Document[]   @relation("OrganizationDocuments")
  activities  Activity[]   @relation("OrganizationActivities")

  @@index([slug])
  @@index([ownerId])
  @@map("organizations")
}

model OrganizationMember {
  id             String       @id @default(cuid())
  userId         String
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  orgRole        OrgRole      @default(MEMBER)
  joinedAt       DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@unique([userId, organizationId])
  @@index([userId])
  @@index([organizationId])
  @@map("organization_members")
}

enum OrgRole {
  OWNER
  ADMIN
  MEMBER
  GUEST
}

// Updated models with organizationId:
// - Team: organizationId String (required for new teams)
// - Contact: organizationId String?, isOrgContact Boolean
// - Document: organizationId String?
// - Activity: organizationId String?
// - DocumentVisibility: Added ORGANIZATION value
```

### New Models (Still Needed)

```prisma
// Add to schema.prisma

model Facility {
  id          String   @id @default(cuid())
  name        String
  address     String?
  city        String?
  state       String?
  country     String
  countryCode String
  postalCode  String?
  sector      String?
  type        String?
  latitude    Float?
  longitude   Float?
  phone       String?
  email       String?
  website     String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdById String?
  createdBy   User?    @relation(fields: [createdById], references: [id])

  documentLinks DocumentLink[]

  @@index([countryCode])
  @@index([sector])
  @@index([name])
}

model ImportLog {
  id          String   @id @default(cuid())
  type        String   // "FACILITY", "CONTACT", etc.
  filename    String
  totalRows   Int
  successRows Int
  failedRows  Int
  errors      Json?    // Array of error details
  status      String   // "PENDING", "PROCESSING", "COMPLETED", "FAILED"
  importedById String
  importedBy  User     @relation(fields: [importedById], references: [id])
  createdAt   DateTime @default(now())
  completedAt DateTime?
}

model SystemSetting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     Json
  updatedAt DateTime @updatedAt
  updatedBy String?
}
```

---

## File Structure

### Already Implemented (Organization Layer)

```
src/
├── app/
│   ├── dashboard/
│   │   └── organization/
│   │       └── page.tsx                         # Organization management page
│   └── api/
│       └── organization/
│           ├── route.ts                         # GET list, POST create
│           └── [organizationId]/
│               ├── route.ts                     # GET, PATCH, DELETE
│               └── members/
│                   ├── route.ts                 # GET list, POST invite
│                   └── [userId]/route.ts        # PATCH role, DELETE remove
├── components/
│   └── organization/
│       ├── index.ts                             # Exports
│       ├── org-page-content.tsx                 # Main page component
│       ├── create-org-form.tsx                  # Create organization form
│       ├── org-member-list.tsx                  # Member list with actions
│       └── invite-org-member.tsx                # Invite form
├── lib/
│   ├── authorization.ts                         # Updated with org role functions
│   └── validations/
│       └── organization.ts                      # Zod schemas for org
└── types/
    ├── dashboard.ts                             # Updated with Organization types
    └── next-auth.d.ts                           # Updated with orgRole in session
```

### New Files Needed (Admin Features)

```
src/
├── app/
│   └── dashboard/
│       └── admin/
│           ├── page.tsx                    # Admin overview
│           ├── layout.tsx                  # Admin layout with guard
│           ├── users/
│           │   ├── page.tsx               # User list
│           │   └── [id]/page.tsx          # User detail
│           ├── organizations/
│           │   ├── page.tsx               # Organization list
│           │   ├── new/page.tsx           # Create organization
│           │   └── [id]/
│           │       ├── page.tsx           # Organization detail
│           │       └── members/page.tsx   # Member management
│           ├── teams/
│           │   ├── page.tsx               # Team list
│           │   └── [id]/page.tsx          # Team detail
│           ├── facilities/
│           │   ├── page.tsx               # Facility list
│           │   ├── import/page.tsx        # Import UI
│           │   └── [id]/page.tsx          # Facility detail
│           └── activity/
│               └── page.tsx               # System activity log
│
│   └── api/
│       └── admin/
│           ├── users/
│           │   ├── route.ts               # GET list, POST create
│           │   └── [id]/
│           │       ├── route.ts           # GET, PATCH, DELETE
│           │       └── activity/route.ts  # GET user activity
│           ├── organizations/
│           │   ├── route.ts               # GET list, POST create
│           │   ├── stats/route.ts         # GET organization statistics
│           │   └── [id]/
│           │       ├── route.ts           # GET, PATCH, DELETE
│           │       ├── transfer/route.ts  # POST transfer ownership
│           │       └── members/
│           │           ├── route.ts       # GET, POST members
│           │           └── [userId]/route.ts  # PATCH, DELETE member
│           ├── teams/
│           │   ├── route.ts               # GET list
│           │   └── [id]/
│           │       ├── route.ts           # GET, PATCH, DELETE
│           │       ├── transfer/route.ts  # POST transfer ownership
│           │       └── members/
│           │           └── [userId]/route.ts
│           ├── facilities/
│           │   ├── route.ts               # GET, POST
│           │   ├── [id]/route.ts          # GET, PATCH, DELETE
│           │   ├── import/route.ts        # POST bulk import
│           │   └── export/route.ts        # POST export
│           ├── export/
│           │   ├── contacts/route.ts
│           │   └── documents/route.ts
│           └── stats/route.ts             # Dashboard stats
│
├── components/
│   └── admin/
│       ├── admin-layout.tsx
│       ├── admin-sidebar.tsx
│       ├── user-table.tsx
│       ├── user-role-select.tsx
│       ├── organization-table.tsx         # List all organizations
│       ├── create-org-admin-form.tsx      # Create org with owner selection
│       ├── org-detail-admin.tsx           # Admin view of organization
│       ├── org-member-admin-list.tsx      # Manage any org's members
│       ├── team-table.tsx
│       ├── facility-table.tsx
│       ├── facility-import-dialog.tsx
│       ├── csv-import-preview.tsx
│       └── stat-cards.tsx
│
└── lib/
    ├── admin-guard.ts                     # Admin middleware
    └── validations/
        └── admin.ts                       # Admin-specific schemas
```

---

## Sidebar Changes

### Already Implemented

Current sidebar items (in `src/components/dashboard/sidebar.tsx`):
```tsx
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: MapPin, label: 'Facilities', href: '/dashboard/facilities' },
  { icon: Users, label: 'Contacts', href: '/dashboard/contacts' },
  { icon: FileText, label: 'Documents', href: '/dashboard/documents' },
  { icon: Users2, label: 'Team', href: '/dashboard/team' },
  { icon: Building2, label: 'Organization', href: '/dashboard/organization' },  // NEW
  { icon: Calculator, label: 'Shipment Calc', href: '/dashboard/shipment-calculator' },
];
```

### Still Needed

Add "Admin" section visible only to ADMIN role users:

```tsx
// In sidebar.tsx - add conditional admin section

const adminItems = [
  { icon: Shield, label: 'Admin', href: '/dashboard/admin' },
  { icon: Users, label: 'Users', href: '/dashboard/admin/users' },
  { icon: Building2, label: 'Organizations', href: '/dashboard/admin/organizations' },
  { icon: Layers, label: 'Teams', href: '/dashboard/admin/teams' },
  { icon: Database, label: 'Facilities', href: '/dashboard/admin/facilities' },
  { icon: Activity, label: 'Activity', href: '/dashboard/admin/activity' },
];

// Show only if user.role === 'ADMIN'
```

---

## Summary Checklist

### Completed
- [x] Organization layer (multi-tenant structure)
- [x] Organization CRUD operations
- [x] Organization member management
- [x] Organization roles (OWNER, ADMIN, MEMBER, GUEST)
- [x] Organization page in dashboard
- [x] Session includes organization context

### Immediate Needs (Phase 1-2)
- [ ] Admin dashboard page
- [ ] Admin route protection (middleware)
- [ ] User management (list, role change, deactivate)
- [ ] Organization admin management:
  - [ ] List all organizations
  - [ ] Create organization (assign owner)
  - [ ] Edit organization settings (name, limits)
  - [ ] Manage organization members (add, remove, change roles)
  - [ ] Transfer organization ownership
  - [ ] Deactivate/delete organizations
- [ ] Facility database migration
- [ ] Facility CRUD + CSV import

### Future Needs (Phase 3-5)
- [ ] Team admin oversight
- [ ] Contact/document export
- [ ] Contact import
- [ ] Analytics dashboard
- [ ] System settings
- [ ] Shipment calculator (if needed)
- [ ] Organization analytics

---

## Notes

1. **Security**: All admin routes MUST check `user.role === 'ADMIN'`
2. **Organization Security**: Organization routes check orgRole for OWNER/ADMIN permissions
3. **Audit Trail**: All admin actions should be logged to Activity
4. **UI Consistency**: Use existing dashboard components (Card, Table, Dialog)
5. **Testing**: Add tests for admin authorization logic
6. **Multi-tenancy**: Resources can be scoped to Organization via `organizationId`
7. **Authorization Functions**: Use `canManageOrg()`, `isOrgOwner()`, `isOrgAdmin()` from `lib/authorization.ts`
