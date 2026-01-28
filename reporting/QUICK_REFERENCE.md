# Ubhaya Platform - Quick Reference Guide

**Last Updated:** November 17, 2025

---

## Quick Start

### 1. Start Development Environment

```bash
# Navigate to project
cd /Users/paul/Desktop/projects/viola/ubhaya/ubhaya-app

# Start PostgreSQL database
docker-compose up -d

# Start development server
npm run dev

# Access application
open http://localhost:3006
```

###2. Test Accounts

| Email | Password | Role | Access Level |
|-------|----------|------|--------------|
| test.user@example.com | TestPass123! | MEMBER | Standard dashboard access |
| login.test@example.com | LoginPass123! | MEMBER | Standard dashboard access |

**Note:** Team page requires TEAM_LEADER or ADMIN role.

---

## Common Commands

### Development
```bash
npm run dev              # Start dev server (port 3006)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks
```

### Database
```bash
docker-compose up -d     # Start PostgreSQL
docker-compose down      # Stop PostgreSQL
npx prisma studio        # Open Prisma Studio GUI
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma Client
```

### Testing
```bash
npx playwright test      # Run all tests
npx playwright test --headed  # Run with browser visible
npx playwright show-report   # View test report
```

---

## Project URLs

| Service | URL | Status |
|---------|-----|--------|
| Development Server | http://localhost:3006 | ✅ Running |
| Login Page | http://localhost:3006/login | ✅ Working |
| Registration | http://localhost:3006/register | ✅ Working |
| Dashboard | http://localhost:3006/dashboard | ✅ Protected |
| Prisma Studio | http://localhost:5555 | Available (when running) |
| PostgreSQL | localhost:5433 | ✅ Running |

---

## Key File Locations

| Resource | Path |
|----------|------|
| Auth Configuration | `/src/lib/auth.ts` |
| Database Schema | `/prisma/schema.prisma` |
| Middleware | `/src/middleware.ts` |
| Environment Variables | `/.env` (from `.env.example`) |
| Documentation | `/docs/` |
| Test Results | `/docs/auth/test-results.md` |
| Reporting | `/reporting/` |

---

## Technology Stack Summary

- **Framework:** Next.js 16.0.1 with Turbopack
- **Runtime:** React 19.2.0
- **Language:** TypeScript 5.7.3
- **Styling:** Tailwind CSS v4 + shadcn/ui + Magic UI v4
- **Database:** PostgreSQL 16 (Docker)
- **ORM:** Prisma 6.19.0
- **Authentication:** NextAuth v5.0.0-beta.30
- **Testing:** Playwright 1.56.1 + Jest 29
- **Email:** Resend 6.4.2

---

## Environment Variables

Required variables (see `.env.example`):

```env
# Database
DATABASE_URL="postgresql://ubhaya_user:ubhaya_password@localhost:5433/ubhaya_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3006"
NEXTAUTH_SECRET="your-secret-here-generate-with-openssl"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3006"
NEXT_PUBLIC_SITE_NAME="Ubhaya Supply Chain Management"
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## Project Structure

```
ubhaya-app/
├── src/
│   ├── app/                    # Next.js pages (15 pages)
│   │   ├── (auth)/            # Auth pages: login, register, etc.
│   │   ├── dashboard/         # Dashboard pages (6 pages)
│   │   └── api/               # API routes (16 endpoints)
│   ├── components/            # React components (85+)
│   │   ├── ui/               # shadcn/ui components (25+)
│   │   ├── auth/             # Auth components (7)
│   │   ├── dashboard/        # Dashboard components (12)
│   │   └── ...
│   ├── lib/                   # Utilities, configs
│   └── types/                 # TypeScript types
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Migration files
├── docs/                      # Documentation (15+ files)
├── tests/                     # Playwright tests
├── reporting/                 # Client reports
└── public/                    # Static assets
```

---

## Database Schema

**9 Tables:**
1. **users** - User accounts with auth
2. **teams** - Team/group management
3. **sessions** - User sessions (NextAuth)
4. **accounts** - OAuth providers (NextAuth)
5. **verification_tokens** - Email verification
6. **password_resets** - Password reset tokens
7. **contacts** - User/Team contacts
8. **shipments** - Shipment tracking
9. **_prisma_migrations** - Migration history

**User Roles:** ADMIN, TEAM_LEADER, MEMBER, VIEWER

---

## API Endpoints (16 Total)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handler
- `POST /api/auth/reset-password` - Password reset

### User
- `GET/PUT /api/user/profile` - Profile management
- `PUT /api/user/change-password` - Password change

### Team
- `POST /api/team/create` - Create team
- `POST /api/team/invite` - Invite member
- `GET /api/team` - Get team
- `PUT /api/team/settings` - Update team
- `DELETE /api/team/leave` - Leave team
- `DELETE /api/team/member/[userId]` - Remove member

### Content
- Blog and CMS endpoints

---

## Dashboard Pages

| Page | URL | Description | Access |
|------|-----|-------------|--------|
| Dashboard Home | `/dashboard` | KPIs, shipments, contacts | All users |
| Contacts | `/dashboard/contacts` | Contact management | All users |
| Facilities | `/dashboard/facilities` | Facility search (50K+) | All users |
| Shipments | `/dashboard/shipments` | Shipment tracking | All users |
| Team | `/dashboard/team` | Team management | TEAM_LEADER+ |
| Analytics | `/dashboard/analytics` | Metrics dashboard | All users |

---

## Authentication Flow

### Registration
1. User visits `/register`
2. Fills form (7 fields) with password strength indicator
3. Client-side validation (Zod)
4. Server-side validation + duplicate check
5. Password hashed with bcrypt (12 rounds)
6. User created in database
7. Auto-login after registration
8. Redirect to dashboard

### Login
1. User visits `/login`
2. Enters email + password
3. NextAuth validates credentials
4. Password verified with bcrypt.compare()
5. JWT session created (30 days)
6. httpOnly cookie set
7. Redirect to dashboard

### Password Reset
1. User visits `/forgot-password`
2. Enters email
3. Reset token generated (15-30 min expiry)
4. Email sent with reset link (Resend)
5. User clicks link → `/reset-password?token=...`
6. Enters new password
7. Token validated, password updated
8. Redirect to login

---

## Testing

### Run API Tests
```bash
# Using curl (21 tests)
cd /Users/paul/Desktop/projects/viola/ubhaya/ubhaya-app
# See docs/auth/test-results.md for all test commands
```

### Run Browser Tests
```bash
# Start dev server first
npm run dev

# Run Playwright tests
npx playwright test

# Run with UI
npx playwright test --ui

# View report
npx playwright show-report
```

### Test Results
- **API:** 21/21 passing (100%)
- **UI:** Core flows functional
- **Security:** Verified (bcrypt, JWT, validation)

---

## Troubleshooting

### Server Won't Start
```bash
# Check if port 3006 is in use
lsof -ti:3006

# Kill process if needed
lsof -ti:3006 | xargs kill

# Remove stale lock file
rm -rf .next/dev/lock

# Restart
PORT=3006 npm run dev
```

### Database Connection Error
```bash
# Check Docker is running
docker ps

# Start PostgreSQL
docker-compose up -d

# Check connection
npx prisma studio
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## Security Checklist

✅ Passwords hashed with bcrypt (12 rounds)
✅ JWT tokens are httpOnly
✅ Input validation with Zod
✅ SQL injection protection (Prisma)
✅ CSRF protection (NextAuth)
✅ Protected routes (middleware)
✅ Role-based access control
✅ Generic error messages

⚠️ Rate limiting (ready, not enabled)
⚠️ Account lockout (ready, not enabled)
⚠️ Email verification (ready, not enforced)

---

## Performance Tips

1. **Optimize Images:** Use Next.js Image component
2. **Enable Caching:** Configure HTTP caching headers
3. **Use CDN:** Deploy static assets to CDN
4. **Database Indexing:** Add indexes for frequent queries
5. **Code Splitting:** Leverage Next.js automatic splitting
6. **Monitor Performance:** Use Vercel Analytics or similar

---

## Deployment Checklist

### Pre-Deployment
- [ ] Run `npm run build` successfully
- [ ] Run `npm run lint` with no errors
- [ ] Run `npm run type-check` with no errors
- [ ] Run all tests
- [ ] Update environment variables for production
- [ ] Generate strong NEXTAUTH_SECRET
- [ ] Configure production database
- [ ] Set up email provider (Resend)

### Production Environment
- [ ] Deploy to Vercel/AWS/other
- [ ] Set up PostgreSQL (AWS RDS, Supabase, etc.)
- [ ] Configure domain and SSL
- [ ] Set up monitoring (Sentry)
- [ ] Configure backups
- [ ] Set up CI/CD pipeline

---

## Support Resources

### Documentation
- **Project Docs:** `/docs/`
- **Auth Docs:** `/docs/auth/`
- **Reporting:** `/reporting/`
- **README:** `/README.md`
- **CLAUDE.md:** Project constitution

### External Resources
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth Docs:** https://next-auth.js.org
- **shadcn/ui:** https://ui.shadcn.com
- **Magic UI:** https://magicui.design
- **Tailwind CSS:** https://tailwindcss.com

---

## Contact Information

**Project:** Ubhaya Supply Chain Management Platform
**Status:** Production Ready (Phase 4 Complete)
**Technology:** Next.js 16 + React 19 + PostgreSQL 16
**Documentation:** 10,000+ lines across 15+ files

---

**Last Updated:** November 17, 2025
**Version:** 1.0.0
**Next Phase:** Phase 5 - Production Hardening
