# Facilities CRUD - Comprehensive Development Plan

**Project:** Ubhaya Supply Chain Management Platform
**Feature:** Facilities Management with CRUD Operations & Data Import
**Last Updated:** 2025-11-21

---

## Table of Contents

1. [Overview](#overview)
2. [Database Schema Design](#database-schema-design)
3. [API Endpoints Specification](#api-endpoints-specification)
4. [UI Components Structure](#ui-components-structure)
5. [Bulk Import Functionality](#bulk-import-functionality)
6. [Implementation Phases](#implementation-phases)
7. [Validation Rules](#validation-rules)
8. [Authorization & Permissions](#authorization--permissions)
9. [Testing Strategy](#testing-strategy)

---

## Overview

### Purpose
Create a complete facilities management system allowing users to:
- **Create** new facilities with detailed information
- **Read** and view all facilities with search/filter capabilities
- **Update** existing facility information
- **Delete** facilities (with proper authorization)
- **Import** bulk facility data from CSV/Excel files

### Key Features
- Full CRUD operations for facilities
- Bulk data import (CSV/Excel)
- Search and filter capabilities
- Geolocation support (coordinates, address)
- Facility categorization and tagging
- Capacity and operational status tracking
- Contact information management
- Image/document attachments
- Audit trail (created/updated timestamps)
- Team-based access control

---

## Database Schema Design

### Facility Model

```prisma
model Facility {
  id                String            @id @default(cuid())

  // Basic Information
  name              String
  code              String            @unique  // Unique facility code (e.g., "FAC-001")
  description       String?           @db.Text
  type              FacilityType
  status            FacilityStatus    @default(ACTIVE)

  // Location
  address           String?           @db.Text
  city              String?
  state             String?
  country           String            @default("Philippines")
  postalCode        String?
  latitude          Float?
  longitude         Float?

  // Capacity & Specifications
  totalArea         Float?            // in square meters
  storageCapacity   Float?            // in cubic meters or relevant unit
  maxCapacity       Int?              // maximum items/units
  currentOccupancy  Int?              @default(0)

  // Contact Information
  contactPerson     String?
  contactEmail      String?
  contactPhone      String?
  contactWhatsapp   String?

  // Operational Details
  operatingHours    String?           // e.g., "Mon-Fri 8AM-6PM"
  timezone          String?           @default("Asia/Manila")

  // Media & Documents
  images            String[]          // Array of image URLs
  documents         String[]          // Array of document URLs

  // Team Relationship
  teamId            String?
  team              Team?             @relation(fields: [teamId], references: [id], onDelete: SetNull)

  // Audit Fields
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  createdById       String
  createdBy         User              @relation("FacilityCreatedBy", fields: [createdById], references: [id])
  updatedById       String?
  updatedBy         User?             @relation("FacilityUpdatedBy", fields: [updatedById], references: [id])

  // Relations
  shipments         Shipment[]        @relation("ShipmentOrigin")
  shipmentsDestination Shipment[]     @relation("ShipmentDestination")

  @@index([teamId])
  @@index([type])
  @@index([status])
  @@index([code])
  @@map("facilities")
}

enum FacilityType {
  WAREHOUSE           // Storage facility
  DISTRIBUTION_CENTER // Distribution hub
  RETAIL_STORE        // Retail location
  MANUFACTURING       // Production facility
  PORT                // Shipping port
  AIRPORT             // Air cargo facility
  CUSTOMS             // Customs facility
  OFFICE              // Office location
  OTHER               // Other facility type
}

enum FacilityStatus {
  ACTIVE              // Currently operational
  INACTIVE            // Temporarily not in use
  MAINTENANCE         // Under maintenance
  PLANNED             // Planned but not yet operational
  DECOMMISSIONED      // Permanently closed
}
```

### Import History Model (Track bulk imports)

```prisma
model FacilityImport {
  id              String          @id @default(cuid())
  fileName        String
  fileSize        Int             // in bytes
  totalRows       Int
  successCount    Int             @default(0)
  failureCount    Int             @default(0)
  status          ImportStatus    @default(PROCESSING)
  errorLog        Json?           // Store errors per row

  // Relationships
  teamId          String?
  team            Team?           @relation(fields: [teamId], references: [id], onDelete: SetNull)
  userId          String
  user            User            @relation(fields: [userId], references: [id])

  // Timestamps
  createdAt       DateTime        @default(now())
  completedAt     DateTime?

  @@index([teamId])
  @@index([userId])
  @@index([status])
  @@map("facility_imports")
}

enum ImportStatus {
  PROCESSING
  COMPLETED
  FAILED
  PARTIAL
}
```

---

## API Endpoints Specification

### 1. Get All Facilities
**Endpoint:** `GET /api/facilities`
**Authorization:** Authenticated users
**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `search` - Search by name, code, or address
- `type` - Filter by facility type
- `status` - Filter by status
- `teamId` - Filter by team (optional, defaults to user's team)
- `sortBy` - Sort field (name, code, createdAt, updatedAt)
- `sortOrder` - asc or desc

**Response:**
```json
{
  "facilities": [
    {
      "id": "clx123...",
      "name": "Manila Warehouse 1",
      "code": "MNL-WH-001",
      "type": "WAREHOUSE",
      "status": "ACTIVE",
      "address": "123 Port Area, Manila",
      "city": "Manila",
      "country": "Philippines",
      "contactPerson": "Juan Dela Cruz",
      "contactEmail": "juan@example.com",
      "contactPhone": "+63 912 345 6789",
      "totalArea": 5000.0,
      "storageCapacity": 10000.0,
      "currentOccupancy": 7500,
      "team": {
        "id": "team123",
        "name": "Logistics Team"
      },
      "createdAt": "2025-11-21T10:00:00Z",
      "updatedAt": "2025-11-21T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### 2. Get Single Facility
**Endpoint:** `GET /api/facilities/[id]`
**Authorization:** Authenticated users (same team or admin)

**Response:**
```json
{
  "id": "clx123...",
  "name": "Manila Warehouse 1",
  "code": "MNL-WH-001",
  "description": "Main distribution warehouse for Metro Manila",
  "type": "WAREHOUSE",
  "status": "ACTIVE",
  "address": "123 Port Area, Manila",
  "city": "Manila",
  "state": "NCR",
  "country": "Philippines",
  "postalCode": "1000",
  "latitude": 14.5995,
  "longitude": 120.9842,
  "totalArea": 5000.0,
  "storageCapacity": 10000.0,
  "maxCapacity": 15000,
  "currentOccupancy": 7500,
  "contactPerson": "Juan Dela Cruz",
  "contactEmail": "juan@example.com",
  "contactPhone": "+63 912 345 6789",
  "contactWhatsapp": "+63 912 345 6789",
  "operatingHours": "Mon-Sat 7AM-7PM",
  "timezone": "Asia/Manila",
  "images": ["https://..."],
  "documents": ["https://..."],
  "teamId": "team123",
  "team": {
    "id": "team123",
    "name": "Logistics Team"
  },
  "createdAt": "2025-11-21T10:00:00Z",
  "updatedAt": "2025-11-21T10:00:00Z",
  "createdBy": {
    "id": "user123",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### 3. Create Facility
**Endpoint:** `POST /api/facilities`
**Authorization:** TEAM_LEADER or ADMIN
**Request Body:**
```json
{
  "name": "Cebu Distribution Center",
  "code": "CEB-DC-001",
  "description": "Main distribution hub for Visayas region",
  "type": "DISTRIBUTION_CENTER",
  "status": "ACTIVE",
  "address": "456 Business Park, Cebu City",
  "city": "Cebu City",
  "state": "Cebu",
  "country": "Philippines",
  "postalCode": "6000",
  "latitude": 10.3157,
  "longitude": 123.8854,
  "totalArea": 3000.0,
  "storageCapacity": 8000.0,
  "maxCapacity": 12000,
  "contactPerson": "Maria Santos",
  "contactEmail": "maria@example.com",
  "contactPhone": "+63 923 456 7890",
  "operatingHours": "Mon-Sat 8AM-6PM"
}
```

**Response:**
```json
{
  "message": "Facility created successfully",
  "facility": { /* full facility object */ }
}
```

---

### 4. Update Facility
**Endpoint:** `PATCH /api/facilities/[id]`
**Authorization:** TEAM_LEADER or ADMIN (same team)
**Request Body:** (Partial update, only include fields to update)
```json
{
  "status": "MAINTENANCE",
  "contactPhone": "+63 999 888 7777",
  "currentOccupancy": 8200
}
```

**Response:**
```json
{
  "message": "Facility updated successfully",
  "facility": { /* updated facility object */ }
}
```

---

### 5. Delete Facility
**Endpoint:** `DELETE /api/facilities/[id]`
**Authorization:** ADMIN only
**Response:**
```json
{
  "message": "Facility deleted successfully"
}
```

---

### 6. Bulk Import Facilities
**Endpoint:** `POST /api/facilities/import`
**Authorization:** TEAM_LEADER or ADMIN
**Content-Type:** `multipart/form-data`
**Request Body:**
- `file` - CSV or Excel file

**CSV Format:**
```csv
name,code,type,status,address,city,state,country,postalCode,latitude,longitude,totalArea,storageCapacity,maxCapacity,contactPerson,contactEmail,contactPhone,operatingHours
Manila Warehouse 1,MNL-WH-001,WAREHOUSE,ACTIVE,"123 Port Area, Manila",Manila,NCR,Philippines,1000,14.5995,120.9842,5000,10000,15000,Juan Dela Cruz,juan@example.com,+63 912 345 6789,Mon-Sat 7AM-7PM
```

**Response:**
```json
{
  "message": "Import completed",
  "importId": "imp123...",
  "summary": {
    "totalRows": 50,
    "successCount": 48,
    "failureCount": 2,
    "errors": [
      {
        "row": 5,
        "code": "MNL-WH-003",
        "error": "Duplicate facility code"
      },
      {
        "row": 12,
        "error": "Invalid facility type"
      }
    ]
  }
}
```

---

### 7. Get Import History
**Endpoint:** `GET /api/facilities/imports`
**Authorization:** Authenticated users
**Response:**
```json
{
  "imports": [
    {
      "id": "imp123...",
      "fileName": "facilities_import_2025.csv",
      "fileSize": 45678,
      "totalRows": 50,
      "successCount": 48,
      "failureCount": 2,
      "status": "COMPLETED",
      "createdAt": "2025-11-21T10:00:00Z",
      "completedAt": "2025-11-21T10:02:15Z",
      "user": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ]
}
```

---

### 8. Download Import Template
**Endpoint:** `GET /api/facilities/import/template`
**Authorization:** Authenticated users
**Response:** CSV file download with headers and sample data

---

## UI Components Structure

### Page: `/dashboard/facilities`

#### Component Hierarchy:
```
FacilitiesPage (Server Component)
├── FacilitiesHeader
│   ├── Search Input
│   ├── Filter Dropdowns (Type, Status)
│   └── Action Buttons (Create, Import)
├── FacilitiesTable
│   ├── Table Header (sortable columns)
│   ├── Table Body
│   │   └── FacilityRow (for each facility)
│   │       ├── Facility Info
│   │       ├── Status Badge
│   │       ├── Location Info
│   │       └── Actions Dropdown (View, Edit, Delete)
│   └── Table Pagination
└── Dialogs/Modals
    ├── CreateFacilityDialog
    ├── EditFacilityDialog
    ├── DeleteConfirmDialog
    └── ImportFacilitiesDialog
```

---

### Component Details

#### 1. FacilitiesPage
**File:** `src/app/dashboard/facilities/page.tsx`
```typescript
export default async function FacilitiesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; type?: string; status?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  // Fetch facilities with filters
  const facilities = await fetchFacilities(searchParams, session.user.teamId);

  return (
    <div className="space-y-6">
      <FacilitiesHeader />
      <FacilitiesTable facilities={facilities} />
    </div>
  );
}
```

---

#### 2. FacilitiesHeader
**File:** `src/components/facilities/facilities-header.tsx`
```typescript
'use client';

export function FacilitiesHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Facilities</h1>
        <p className="text-muted-foreground">Manage your warehouses, distribution centers, and facilities</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleImport}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Facility
        </Button>
      </div>
    </div>
  );
}
```

---

#### 3. FacilitiesTable
**File:** `src/components/facilities/facilities-table.tsx`

Features:
- Sortable columns (Name, Code, Type, Status, Location, Capacity)
- Row actions (View, Edit, Delete)
- Status badges with color coding
- Capacity progress bars
- Responsive design (cards on mobile, table on desktop)
- Empty state with CTA

---

#### 4. CreateFacilityDialog
**File:** `src/components/facilities/create-facility-dialog.tsx`

Form Fields:
- **Basic Info Tab:**
  - Name (required)
  - Code (required, unique)
  - Type (select)
  - Status (select)
  - Description (textarea)

- **Location Tab:**
  - Address (textarea)
  - City, State, Country
  - Postal Code
  - Latitude, Longitude (with map picker)

- **Capacity Tab:**
  - Total Area
  - Storage Capacity
  - Max Capacity

- **Contact Tab:**
  - Contact Person
  - Email, Phone, WhatsApp
  - Operating Hours

Form Validation:
- react-hook-form + Zod
- Real-time validation
- Submit with API call

---

#### 5. EditFacilityDialog
**File:** `src/components/facilities/edit-facility-dialog.tsx`

Same as CreateFacilityDialog but:
- Pre-filled with existing data
- PATCH request instead of POST
- "Update Facility" button

---

#### 6. ImportFacilitiesDialog
**File:** `src/components/facilities/import-facilities-dialog.tsx`

Features:
- File upload (CSV/Excel, drag-and-drop)
- Download template button
- File preview (first 5 rows)
- Import progress bar
- Error summary display
- Success/failure counts

UI Flow:
1. Upload file → Preview
2. Click "Import" → Processing
3. Show results → Summary with errors
4. Option to download error report

---

#### 7. FacilityDetailDialog
**File:** `src/components/facilities/facility-detail-dialog.tsx`

Display:
- All facility information in organized sections
- Map view (if coordinates available)
- Capacity visualization (progress bars/charts)
- Images gallery
- Documents list
- Audit information (created/updated by, dates)
- Quick actions (Edit, Delete)

---

## Bulk Import Functionality

### Import Process Flow

1. **Upload File**
   - Accept CSV or Excel files
   - Max file size: 10MB
   - Validate file format

2. **Parse & Validate**
   - Parse CSV/Excel rows
   - Validate each row against schema
   - Check for:
     - Required fields
     - Data types
     - Unique constraints (code)
     - Enum values (type, status)
     - Format validation (email, phone, coordinates)

3. **Batch Processing**
   - Process in batches of 50 rows
   - Use Prisma transactions
   - Continue on error (don't fail entire import)

4. **Error Handling**
   - Collect errors per row
   - Store in importLog JSON
   - Return detailed error report

5. **Results Summary**
   - Total rows processed
   - Success count
   - Failure count
   - Downloadable error report

### CSV Template Structure

```csv
name,code,type,status,description,address,city,state,country,postalCode,latitude,longitude,totalArea,storageCapacity,maxCapacity,contactPerson,contactEmail,contactPhone,contactWhatsapp,operatingHours
```

**Required Columns:** name, code, type
**Optional Columns:** All others

**Type Values:** WAREHOUSE, DISTRIBUTION_CENTER, RETAIL_STORE, MANUFACTURING, PORT, AIRPORT, CUSTOMS, OFFICE, OTHER

**Status Values:** ACTIVE, INACTIVE, MAINTENANCE, PLANNED, DECOMMISSIONED

---

## Implementation Phases

### Phase 1: Database & Schema Setup
**Duration:** 1-2 hours

**Tasks:**
1. Add Facility and FacilityImport models to Prisma schema
2. Update Team and User models with facility relations
3. Run database migration
4. Create seed data for testing

**Files:**
- `prisma/schema.prisma`
- `prisma/migrations/`

---

### Phase 2: API Endpoints
**Duration:** 3-4 hours

**Tasks:**
1. Create validation schemas (Zod)
   - `src/lib/validations/facility.ts`
2. Implement CRUD endpoints:
   - `src/app/api/facilities/route.ts` (GET list, POST create)
   - `src/app/api/facilities/[id]/route.ts` (GET single, PATCH update, DELETE)
3. Implement import endpoints:
   - `src/app/api/facilities/import/route.ts` (POST import)
   - `src/app/api/facilities/import/template/route.ts` (GET template)
   - `src/app/api/facilities/imports/route.ts` (GET history)
4. Add authorization checks
5. Add error handling

**Dependencies:**
- `csv-parse` or `papaparse` for CSV parsing
- `xlsx` for Excel parsing

---

### Phase 3: UI Components
**Duration:** 4-5 hours

**Tasks:**
1. Create facilities page
   - `src/app/dashboard/facilities/page.tsx`
2. Build table component
   - `src/components/facilities/facilities-table.tsx`
3. Build header with search/filters
   - `src/components/facilities/facilities-header.tsx`
4. Create dialogs:
   - `src/components/facilities/create-facility-dialog.tsx`
   - `src/components/facilities/edit-facility-dialog.tsx`
   - `src/components/facilities/facility-detail-dialog.tsx`
   - `src/components/facilities/delete-confirm-dialog.tsx`
5. Add to sidebar navigation

**UI Libraries:**
- shadcn/ui components (Table, Dialog, Select, etc.)
- react-hook-form + Zod validation
- Lucide icons

---

### Phase 4: Import Functionality
**Duration:** 3-4 hours

**Tasks:**
1. Create import dialog component
   - `src/components/facilities/import-facilities-dialog.tsx`
2. Implement file upload handling
3. Build CSV/Excel parser utility
   - `src/lib/import-utils.ts`
4. Create import results display
5. Add import history view
6. Generate downloadable template

**Features:**
- Drag-and-drop file upload
- File preview before import
- Progress indicator
- Error report generation

---

### Phase 5: Testing & Polish
**Duration:** 2-3 hours

**Tasks:**
1. Test all CRUD operations
2. Test bulk import with various scenarios:
   - Valid data
   - Invalid data
   - Duplicate codes
   - Large files (1000+ rows)
3. Test authorization (different roles)
4. Test search and filters
5. Test pagination
6. Responsive design testing
7. Error handling verification
8. Performance optimization

---

## Validation Rules

### Facility Validation Schema
**File:** `src/lib/validations/facility.ts`

```typescript
import { z } from 'zod';

export const facilitySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  code: z.string().min(3, 'Code must be at least 3 characters').max(50)
    .regex(/^[A-Z0-9-]+$/, 'Code must contain only uppercase letters, numbers, and hyphens'),
  description: z.string().max(1000).optional(),
  type: z.enum([
    'WAREHOUSE',
    'DISTRIBUTION_CENTER',
    'RETAIL_STORE',
    'MANUFACTURING',
    'PORT',
    'AIRPORT',
    'CUSTOMS',
    'OFFICE',
    'OTHER',
  ]),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'PLANNED', 'DECOMMISSIONED'])
    .default('ACTIVE'),

  // Location
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).default('Philippines'),
  postalCode: z.string().max(20).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),

  // Capacity
  totalArea: z.number().positive().optional(),
  storageCapacity: z.number().positive().optional(),
  maxCapacity: z.number().int().positive().optional(),
  currentOccupancy: z.number().int().min(0).optional(),

  // Contact
  contactPerson: z.string().max(100).optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().max(20).optional(),
  contactWhatsapp: z.string().max(20).optional(),

  // Operational
  operatingHours: z.string().max(200).optional(),
  timezone: z.string().default('Asia/Manila'),
});

export const updateFacilitySchema = facilitySchema.partial();

export const importFacilitySchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type),
      'File must be CSV or Excel format'
    ),
});
```

---

## Authorization & Permissions

### Permission Matrix

| Action | VIEWER | MEMBER | TEAM_LEADER | ADMIN |
|--------|--------|--------|-------------|-------|
| View Facilities | ✅ (own team) | ✅ (own team) | ✅ (own team) | ✅ (all) |
| Create Facility | ❌ | ❌ | ✅ | ✅ |
| Update Facility | ❌ | ❌ | ✅ (own team) | ✅ (all) |
| Delete Facility | ❌ | ❌ | ❌ | ✅ |
| Import Facilities | ❌ | ❌ | ✅ | ✅ |
| View Import History | ✅ (own imports) | ✅ (own imports) | ✅ (team imports) | ✅ (all) |

### Authorization Checks

**API Level:**
```typescript
// GET /api/facilities - View
if (!session?.user) return unauthorized;

// POST /api/facilities - Create
if (!canManageTeam(session.user.role)) return forbidden;

// PATCH /api/facilities/[id] - Update
if (!canManageTeam(session.user.role)) return forbidden;
if (facility.teamId !== session.user.teamId && !isAdmin(session.user.role)) {
  return forbidden;
}

// DELETE /api/facilities/[id] - Delete
if (!isAdmin(session.user.role)) return forbidden;
```

**UI Level:**
```typescript
// Hide/show buttons based on role
{canManageTeam(session.user.role) && (
  <Button onClick={handleCreate}>Add Facility</Button>
)}

// Disable actions for non-authorized users
{isAdmin(session.user.role) && (
  <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
)}
```

---

## Testing Strategy

### Unit Tests
- Validation schemas (Zod)
- Utility functions (CSV parser, data transformers)
- Authorization helpers

### Integration Tests
- API endpoint tests
  - CRUD operations
  - Import functionality
  - Error handling
  - Authorization checks

### E2E Tests (Playwright)
- Create facility flow
- Edit facility flow
- Delete facility flow
- Search and filter
- Bulk import flow
- Import error handling
- Role-based access control

**Test File:** `test/FACILITIES_TEST_PLAN.md` (to be created)

---

## Dependencies to Install

```bash
# CSV/Excel parsing
npm install papaparse
npm install @types/papaparse --save-dev
npm install xlsx

# File upload handling (if not already installed)
npm install react-dropzone

# Map integration (optional, for coordinate picker)
npm install react-leaflet leaflet
npm install @types/leaflet --save-dev
```

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── facilities/
│   │       ├── route.ts                 # GET list, POST create
│   │       ├── [id]/
│   │       │   └── route.ts             # GET single, PATCH update, DELETE
│   │       ├── import/
│   │       │   ├── route.ts             # POST import
│   │       │   └── template/
│   │       │       └── route.ts         # GET template
│   │       └── imports/
│   │           └── route.ts             # GET import history
│   └── dashboard/
│       └── facilities/
│           └── page.tsx                  # Main facilities page
├── components/
│   └── facilities/
│       ├── facilities-header.tsx
│       ├── facilities-table.tsx
│       ├── facility-row.tsx
│       ├── create-facility-dialog.tsx
│       ├── edit-facility-dialog.tsx
│       ├── facility-detail-dialog.tsx
│       ├── delete-confirm-dialog.tsx
│       ├── import-facilities-dialog.tsx
│       └── import-history-dialog.tsx
├── lib/
│   ├── validations/
│   │   └── facility.ts                   # Zod schemas
│   └── import-utils.ts                   # CSV/Excel parsing utilities
└── types/
    └── facility.ts                        # TypeScript types

prisma/
└── schema.prisma                          # Updated with Facility models

test/
└── FACILITIES_TEST_PLAN.md               # E2E test plan
```

---

## Migration Strategy

### Database Migration

```bash
# After updating schema.prisma
npx prisma migrate dev --name add_facility_models

# Generate Prisma client
npx prisma generate

# Seed sample facilities (optional)
npx prisma db seed
```

### Seed Data Example
**File:** `prisma/seed.ts`

```typescript
const sampleFacilities = [
  {
    name: 'Manila Central Warehouse',
    code: 'MNL-WH-001',
    type: 'WAREHOUSE',
    status: 'ACTIVE',
    city: 'Manila',
    country: 'Philippines',
  },
  // ... more facilities
];

for (const facility of sampleFacilities) {
  await prisma.facility.create({
    data: {
      ...facility,
      teamId: team.id,
      createdById: admin.id,
    },
  });
}
```

---

## Next Steps After Implementation

1. **Analytics Dashboard**
   - Total facilities by type
   - Capacity utilization charts
   - Geographic distribution map
   - Occupancy trends

2. **Advanced Features**
   - Facility assignments (assign users to facilities)
   - Equipment tracking per facility
   - Maintenance scheduling
   - Operational cost tracking

3. **Integration**
   - Link facilities to shipments (origin/destination)
   - Route optimization based on facility locations
   - Inventory management per facility

4. **Notifications**
   - Alert when facility reaches capacity
   - Maintenance reminders
   - Status change notifications

---

## Success Criteria

### MVP Requirements
- ✅ Full CRUD operations working
- ✅ Bulk import from CSV with error handling
- ✅ Search and filter functionality
- ✅ Role-based access control
- ✅ Responsive UI
- ✅ Form validation
- ✅ Success/error notifications

### Performance Targets
- Page load: < 2 seconds
- API response: < 500ms (list), < 200ms (single)
- Import speed: > 100 rows/second
- Table pagination: smooth scrolling with 1000+ records

### Quality Checks
- [ ] All TypeScript types defined
- [ ] All API endpoints documented
- [ ] All forms validated (client + server)
- [ ] Authorization checked on all routes
- [ ] Error handling comprehensive
- [ ] UI/UX reviewed
- [ ] Mobile responsive
- [ ] Accessibility (ARIA, keyboard navigation)

---

**End of Development Plan**
