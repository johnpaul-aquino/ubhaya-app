# Test Accounts Documentation

This document contains all test account credentials for local development and testing.

---

## Quick Reference

| Email | Password | Role | Best For |
|-------|----------|------|----------|
| `admin@ubhaya.com` | `Password123!` | **ADMIN** | Admin panel testing |
| `test.user@example.com` | `Password123!` | TEAM_LEADER | Team/Org owner features |
| `login.test@example.com` | `Password123!` | MEMBER | Member-level features |
| `testuser456@example.com` | `Password123!` | ADMIN | Secondary admin testing |

---

## Admin Account (Primary)

**Recommended for admin panel testing**

| Field | Value |
|-------|-------|
| Email | `admin@ubhaya.com` |
| Password | `Password123!` |
| First Name | Admin |
| Last Name | User |
| System Role | **ADMIN** |
| Organization | Ubhaya Logistics (Owner) |
| Team | Supply Chain Team (Owner) |

### Access Level
- Full system admin access
- Admin panel at `/dashboard/admin`
- Can manage all users, organizations, teams
- Can view activity logs
- Can import facilities
- Owner of "Ubhaya Logistics" organization
- Owner of "Supply Chain Team"

### Login URL
```
http://localhost:3006/login
```

---

## Team Leader Account

**For testing team management features**

| Field | Value |
|-------|-------|
| Email | `test.user@example.com` |
| Password | `Password123!` |
| First Name | Test |
| Last Name | User |
| System Role | TEAM_LEADER |
| Organizations | Test Organization (Owner), Ubhaya Logistics (Member) |
| Team | Engineering Team (Owner) |

### Access Level
- Can manage own team
- Can create/edit team resources
- Owner of "Test Organization"
- Owner of "Engineering Team"
- Member of "Ubhaya Logistics"

---

## Member Account

**For testing standard member features**

| Field | Value |
|-------|-------|
| Email | `login.test@example.com` |
| Password | `Password123!` |
| First Name | Login |
| Last Name | Test |
| System Role | MEMBER |
| Organization | None |
| Team | Supply Chain Team (Member) |

### Access Level
- Standard member permissions
- Can view shared resources
- Member of "Supply Chain Team"

---

## Secondary Admin Account

**For testing multi-admin scenarios**

| Field | Value |
|-------|-------|
| Email | `testuser456@example.com` |
| Password | `Password123!` |
| First Name | Test |
| Last Name | User |
| System Role | ADMIN |
| Organization | None |
| Team | None |

### Access Level
- Full system admin access
- Not assigned to any organization or team

---

## Organizations

| Name | Slug | Owner |
|------|------|-------|
| Ubhaya Logistics | `ubhaya-logistics` | admin@ubhaya.com |
| Test Organization | `test-organization` | test.user@example.com |

---

## Teams

| Name | Slug | Owner |
|------|------|-------|
| Supply Chain Team | `supply-chain-team` | admin@ubhaya.com |
| Engineering Team | `engineering-team` | test.user@example.com |

---

## Database Connection

### Docker Container
```bash
# Container name
ubhaya_postgres

# Connection info
Host: localhost
Port: 5433
Database: ubhaya_db
User: ubhaya_user
Password: ubhaya_password
```

### Connect via Docker
```bash
# Interactive psql shell
docker exec -it ubhaya_postgres psql -U ubhaya_user -d ubhaya_db

# Run single query
docker exec ubhaya_postgres psql -U ubhaya_user -d ubhaya_db -c "SELECT * FROM users;"
```

### Connection String
```
postgresql://ubhaya_user:ubhaya_password@localhost:5433/ubhaya_db
```

---

## Quick Database Queries

### List all users
```bash
docker exec ubhaya_postgres psql -U ubhaya_user -d ubhaya_db -c 'SELECT id, email, "firstName", "lastName", role FROM users;'
```

### Check organization memberships
```bash
docker exec ubhaya_postgres psql -U ubhaya_user -d ubhaya_db -c 'SELECT u.email, o.name as org_name, om."orgRole" FROM users u LEFT JOIN organization_members om ON u.id = om."userId" LEFT JOIN organizations o ON om."organizationId" = o.id;'
```

### Check team memberships
```bash
docker exec ubhaya_postgres psql -U ubhaya_user -d ubhaya_db -c 'SELECT u.email, t.name as team_name, tm."teamRole" FROM users u LEFT JOIN team_members tm ON u.id = tm."userId" LEFT JOIN teams t ON tm."teamId" = t.id;'
```

### Make a user admin
```bash
docker exec ubhaya_postgres psql -U ubhaya_user -d ubhaya_db -c "UPDATE users SET role = 'ADMIN' WHERE email = 'your.email@example.com';"
```

### Create new admin user
```bash
# First register via UI, then:
docker exec ubhaya_postgres psql -U ubhaya_user -d ubhaya_db -c "UPDATE users SET role = 'ADMIN' WHERE email = 'new.admin@example.com';"
```

---

## Prisma Studio (GUI)

```bash
# Start Prisma Studio
npx prisma studio

# Opens at http://localhost:5555
```

---

## Starting Local Environment

### 1. Start Docker database
```bash
docker-compose up -d
```

### 2. Start development server
```bash
npm run dev
# Runs on http://localhost:3006
```

### 3. Access admin panel
1. Go to http://localhost:3006/login
2. Login with `admin@ubhaya.com` / `Password123!`
3. Navigate to http://localhost:3006/dashboard/admin

---

## Frontend URLs

| Page | URL |
|------|-----|
| Login | http://localhost:3006/login |
| Register | http://localhost:3006/register |
| Dashboard | http://localhost:3006/dashboard |
| Profile | http://localhost:3006/dashboard/profile |
| Team | http://localhost:3006/dashboard/team |
| Contacts | http://localhost:3006/dashboard/contacts |
| Documents | http://localhost:3006/dashboard/documents |
| Facilities | http://localhost:3006/dashboard/facilities |

### Admin Panel (Admin role only)

| Page | URL |
|------|-----|
| Admin Overview | http://localhost:3006/dashboard/admin |
| Users Management | http://localhost:3006/dashboard/admin/users |
| Organizations | http://localhost:3006/dashboard/admin/organizations |
| Teams | http://localhost:3006/dashboard/admin/teams |
| Facilities | http://localhost:3006/dashboard/admin/facilities |
| Activity Log | http://localhost:3006/dashboard/admin/activity |

---

## Backend API Endpoints

### Authentication
```
POST /api/auth/register    # Register new user
POST /api/auth/signin      # Login (NextAuth)
POST /api/auth/signout     # Logout (NextAuth)
GET  /api/auth/session     # Get current session
```

### User
```
GET  /api/user/profile     # Get user profile
PUT  /api/user/profile     # Update profile
POST /api/user/avatar      # Upload avatar
```

### Team
```
GET  /api/team             # Get user's team
POST /api/team/create      # Create team
POST /api/team/invite      # Invite member
POST /api/team/leave       # Leave team
DELETE /api/team/member/:id # Remove member
```

### Documents
```
GET  /api/documents        # List documents
POST /api/documents        # Create document/upload file
GET  /api/documents/:id    # Get document
PUT  /api/documents/:id    # Update document
DELETE /api/documents/:id  # Delete document
```

### Contacts
```
GET  /api/contacts         # List contacts
POST /api/contacts         # Create contact
GET  /api/contacts/:id     # Get contact
PUT  /api/contacts/:id     # Update contact
DELETE /api/contacts/:id   # Delete contact
```

### Facilities
```
GET  /api/facilities       # List facilities
GET  /api/facilities/:id   # Get facility
```

### Admin (ADMIN role only)
```
GET  /api/admin/users      # List all users
PUT  /api/admin/users/:id  # Update user (role, status)
GET  /api/admin/organizations  # List organizations
POST /api/admin/organizations  # Create organization
GET  /api/admin/teams      # List all teams
GET  /api/admin/activity   # Get activity log
POST /api/admin/facilities/import  # Import facilities CSV
```

---

## User Roles

| Role | System Access | Admin Panel |
|------|---------------|-------------|
| ADMIN | Full access | Yes |
| TEAM_LEADER | Team management | No |
| MEMBER | Standard access | No |
| VIEWER | Read-only | No |

---

## Organization Roles (OrgRole)

| Role | Description |
|------|-------------|
| OWNER | Full control, can delete organization |
| ADMIN | Manage members, teams, settings |
| MEMBER | Standard access |
| GUEST | Read-only, limited access |

---

## Team Roles (TeamRole)

| Role | Description |
|------|-------------|
| OWNER | Team owner - full control |
| LEADER | Team leader - manage members |
| MEMBER | Standard member |
| VIEWER | Read-only access |

---

## Troubleshooting

### Can't login with test credentials?
1. Verify database is running: `docker ps`
2. Check if user exists: Run the "List all users" query above
3. Verify password hash format (should start with `$2b$`)

### Need to reset password?
```bash
# Generate new bcrypt hash for "Password123!" using Node.js
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Password123!', 12).then(hash => console.log(hash));"

# Update in database
docker exec ubhaya_postgres psql -U ubhaya_user -d ubhaya_db -c "UPDATE users SET \"passwordHash\" = 'YOUR_HASH_HERE' WHERE email = 'admin@ubhaya.com';"
```

### Database connection refused?
```bash
# Restart Docker container
docker-compose down
docker-compose up -d
```

---

*Last Updated: January 2026*
