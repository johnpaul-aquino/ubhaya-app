# Ubhaya Platform - Simplified Feature Specifications
*Version 1.0 - MVP Focus*

## Overview
Ubhaya is a supply chain management platform that helps businesses manage facilities, track shipments, and collaborate with team members. This document outlines the core features as shown in the client mockups, simplified for practical development.

---

## 1. User Authentication

### 1.1 Registration Page
**Fields Required:**
- First Name
- Last Name
- Email
- WhatsApp Number (with country code selector)
- Address/Team Credentials
- Password (with confirmation)

**Basic Functionality:**
- Email verification
- WhatsApp number validation
- Password strength indicator (minimum 8 characters)
- Terms acceptance checkbox

### 1.2 Login Page
**Fields:**
- UserID or Email
- Password
- "Remember me" checkbox

**Features:**
- Forgot password (email reset)
- Show/hide password toggle
- Link to registration page
- Session timeout after 30 minutes of inactivity

**Development Priority:** HIGH - Required for all other features

---

## 2. Facility Search

### 2.1 Search Interface
**Main Search Bar:**
- Free text search for facility names
- Auto-complete suggestions
- Search history (last 5 searches)

### 2.2 Filters
**Three Dropdown Filters:**
1. **Location Filter**
   - "Near me" (uses browser geolocation)
   - Country selection
   - City selection (based on country)

2. **Country Filter**
   - All countries from facilities database
   - Most used countries at top

3. **Category Filter**
   - Manufacturing
   - Textiles
   - Food Processing
   - Plastics
   - Pharmaceuticals
   - Other

### 2.3 Search Results
**Display Format:**
- Facility name
- Address
- Country
- Category/Sector
- Distance (if "near me" selected)
- Contact button

**Pagination:**
- 20 results per page
- Load more button

**Development Priority:** HIGH - Core feature

---

## 3. Shipping Calculator

### 3.1 Input Fields
- **Source Pincode** (text input with validation)
- **Destination Pincode** (text input with validation)
- **Package Weight** (number input in kg)

### 3.2 Calculate Function
**Process:**
1. Validate pincodes (6 digits for India)
2. Check if route exists in database
3. Calculate base rate + weight charges
4. Display results

### 3.3 Results Display
**Show:**
- Estimated cost in local currency
- Estimated delivery time (days)
- Available carriers (if multiple)
- Save quote option

**Development Priority:** MEDIUM - Can be basic initially

---

## 4. Shipment Tracking

### 4.1 Incoming Shipments Tab
**List View Columns:**
- Shipment Number (e.g., FIG-123)
- Route (From → To)
- Status (On Time / Delayed)
- Priority (High / Normal / Low)
- Expected Arrival Date

**Filters:**
- All Shipments
- Arriving Today
- Delayed Shipments

**Search:**
- Search by shipment number
- Search by origin/destination

**Sorting:**
- By arrival date (default)
- By priority
- By status

### 4.2 Outgoing Shipments Tab
**Same structure as Incoming with:**
- Departure Date instead of Arrival
- "Departing Today" filter
- Sort by departure date

### 4.3 Shipment Details Page
**Information Shown:**
- Full tracking number
- Origin & destination details
- Current status with timeline
- Carrier information
- Package details
- Documents attached
- Contact person

**Development Priority:** HIGH - Essential for operations

---

## 5. Contact Management with Team Features

### 5.1 Contact Categories
**Two Main Groups:**

**"My Contacts"** (Personal)
- Contacts added by the user
- Private to the user
- Full edit/delete permissions

**"Team Contacts"** (Shared)
- Visible to all team members
- Added by any team member
- Edit permissions based on role
- Shows who added the contact

### 5.2 WhatsApp Integration
**Features:**
- **Import from WhatsApp**
  - Upload WhatsApp chat export
  - Extract phone numbers and names
  - Bulk import with duplicate checking

- **Add WhatsApp Contact**
  - Name
  - WhatsApp number
  - Company (optional)
  - Tags

- **Quick Actions**
  - Send WhatsApp message (opens WhatsApp Web)
  - Copy number
  - Add to task

### 5.3 Contact Fields
**Basic Information:**
- Name (required)
- Phone number
- WhatsApp number
- Email
- Company/Organization
- Position/Role

**Additional Fields:**
- Tags (for categorization)
- Notes
- Last contacted date
- Added by (for team contacts)

### 5.4 ToDo Task Integration
**Task Assignment:**
- Toggle to mark contact for follow-up
- Creates task in user's todo list
- Due date setting
- Task notes

### 5.5 Search & Filter
- Search by name, phone, email, or company
- Filter by tags
- Filter by "My" vs "Team" contacts
- Recently contacted

**Development Priority:** HIGH - Key differentiator

---

## 6. Team/Group Features

### 6.1 Team Structure
**Hierarchy:**
```
Organization
  └── Teams/Departments
        └── Team Members (Users)
```

### 6.2 Team Management
**Admin Functions:**
- Create teams
- Add/remove members
- Set team leaders
- Define sharing permissions

**Team Member Roles:**
- **Admin**: Full access, can manage teams
- **Team Leader**: Manage team contacts and documents
- **Member**: View and use shared resources
- **Viewer**: Read-only access

### 6.3 Data Sharing Rules
**What Can Be Shared:**
1. **Contacts**
   - Share specific contacts with team
   - Bulk share contact groups
   - Auto-share based on tags

2. **Documents**
   - Share files with specific teams
   - Folder-level sharing
   - Read/write permissions

3. **Shipment Information**
   - View team's shipments
   - Collaborative tracking
   - Shared notes on shipments

4. **Facilities**
   - Bookmark facilities for team
   - Share facility notes
   - Collaborate on supplier evaluation

### 6.4 Team Dashboard
**Shows:**
- Team members online
- Recent team activity
- Shared contacts count
- Active shipments
- Team notifications

**Development Priority:** MEDIUM - Phase 2 feature

---

## 7. Document Management

### 7.1 Notes Feature
**Simple Note Taking:**
- Title field
- Rich text editor (bold, italic, bullets)
- Auto-save every 30 seconds
- Timestamp automatically added
- Link to contacts or shipments

**Organization:**
- Personal notes (private)
- Team notes (shared)
- Search notes by content
- Tag system

### 7.2 File Conversion
**Convert to PDF:**
- Upload file button
- Supported formats: DOC, DOCX, TXT, Images
- Progress indicator
- Download converted file
- Save to documents

### 7.3 File Browser
**Features:**
- List view of all documents
- File type icons
- Upload date
- File size
- Owner (for team files)

**Actions:**
- View (in-browser for PDFs, images)
- Download
- Share with team
- Delete (own files only)
- Rename

**Organization:**
- Personal folder
- Team folders (by team)
- Create subfolders
- Move files between folders

**Search & Filter:**
- Search by filename
- Filter by file type
- Filter by date range
- Filter by owner (team files)

**Development Priority:** MEDIUM - Can start basic

---

## 8. Technical Requirements (Simplified)

### 8.1 Tech Stack
- **Framework**: Next.js 14 (App Router) - Full-stack React framework
- **UI Components**: shadcn/ui - Modern, customizable component library
- **Styling**: Tailwind CSS - Utility-first CSS framework
- **Database**: PostgreSQL - Robust relational database
- **ORM**: Prisma - Type-safe database toolkit
- **Authentication**: NextAuth.js - Built for Next.js
- **Deployment**: Vercel (Frontend) + Supabase/Neon (Database)

### 8.2 Architecture Benefits
- **Next.js**: Server-side rendering, API routes, file-based routing
- **shadcn/ui**: Copy-paste components, full control over code
- **Prisma**: Type safety, migrations, great DX
- **Built-in Features**: Image optimization, font optimization, SEO

### 8.3 Database Tables Needed
```sql
-- Simplified Prisma schema
User
Team
Contact (with teamId for sharing)
Facility
Shipment
Document
Note
Session (NextAuth)
Account (NextAuth)
```

### 8.4 Third-Party Services
- **WhatsApp**: Use WhatsApp Web URL scheme initially
- **Email**: Resend or SendGrid (Next.js compatible)
- **PDF Generation**: React-PDF or Puppeteer
- **Maps**: Google Maps or Mapbox
- **File Storage**: Uploadthing or AWS S3
- **Database Hosting**: Supabase (recommended) or Neon

---

## 9. MVP Development Roadmap

### Phase 1: Foundation (Month 1-2)
**Week 1-2:**
- Database setup
- User registration/login
- JWT authentication
- Basic UI framework

**Week 3-4:**
- Facility search (basic)
- Facility data import from CSV
- Search filters

**Week 5-6:**
- Contact management (personal only)
- WhatsApp number storage
- Basic CRUD operations

**Week 7-8:**
- Testing and bug fixes
- Basic deployment setup

### Phase 2: Core Features (Month 3-4)
**Week 9-10:**
- Shipment tracking (incoming/outgoing)
- Status management
- Search and filters

**Week 11-12:**
- Team creation
- Team contacts (shared)
- Role management

**Week 13-14:**
- Shipping calculator
- Rate management
- Basic calculations

**Week 15-16:**
- Integration testing
- Performance optimization

### Phase 3: Enhanced Features (Month 5-6)
**Week 17-18:**
- Document management
- File upload/download
- PDF conversion

**Week 19-20:**
- Notes feature
- WhatsApp integration
- Contact import

**Week 21-22:**
- Team document sharing
- Shared shipment tracking
- Activity feed

**Week 23-24:**
- Final testing
- Production deployment
- Documentation

---

## 10. Key Development Principles

### Keep It Simple
1. **Start with basic CRUD** operations
2. **Use proven libraries** (don't reinvent)
3. **Progressive enhancement** (basic first, enhance later)
4. **Mobile-responsive** from day one

### Focus on User Experience
1. **Fast page loads** (<2 seconds)
2. **Clear error messages**
3. **Intuitive navigation**
4. **Consistent design patterns**

### Data Security
1. **Encrypt passwords** (bcrypt)
2. **HTTPS everywhere**
3. **Input validation** on all forms
4. **SQL injection prevention**
5. **Rate limiting** on APIs

### Team Collaboration
1. **Clear data ownership** (personal vs team)
2. **Activity logs** for shared data
3. **Notification system** for team updates
4. **Conflict resolution** for concurrent edits

---

## 11. Success Metrics

### User Engagement
- User registration rate
- Daily active users
- Features used per session
- Team collaboration frequency

### Performance
- Page load time
- Search response time
- Error rate
- Uptime percentage

### Business Impact
- Number of facilities added
- Shipments tracked
- Contacts managed
- Documents processed

---

## 12. Future Enhancements (Post-MVP)

### Nice to Have
1. Mobile app (React Native)
2. Real-time notifications
3. Advanced analytics dashboard
4. API for third-party integrations
5. Bulk operations
6. Automated reports
7. Multi-language support
8. Offline mode
9. WhatsApp Business API integration
10. Barcode/QR code scanning

---

## Conclusion

This simplified specification focuses on delivering a functional MVP that matches the client's mockups. The platform can be built incrementally, starting with basic features and adding complexity as needed. The team/group sharing functionality is integrated throughout, allowing businesses to collaborate effectively while maintaining data privacy.

**Total Development Time Estimate**: 6 months for complete MVP with a team of:
- 2 Backend developers
- 2 Frontend developers
- 1 UI/UX designer
- 1 Project manager
- 1 QA tester

**Minimum Viable Product** can be delivered in 3 months with core features (auth, facility search, contacts, basic tracking).