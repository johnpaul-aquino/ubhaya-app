# Ubhaya MVP - Quick Start Development Guide (Next.js + shadcn/ui + PostgreSQL)

## Project Setup (Week 1)

### 1. Initialize Next.js Project with TypeScript
```bash
npx create-next-app@latest ubhaya --typescript --tailwind --app
cd ubhaya

# Project structure will be:
ubhaya/
├── src/
│   ├── app/           # Next.js 14 App Router
│   │   ├── (auth)/    # Auth group routes
│   │   ├── (dashboard)/ # Protected routes
│   │   ├── api/       # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/    # React components
│   │   ├── ui/        # shadcn/ui components
│   │   └── features/  # Feature components
│   ├── lib/          # Utilities & configs
│   └── types/        # TypeScript types
├── prisma/
│   └── schema.prisma
├── public/
└── .env.local
```

### 2. Install shadcn/ui and Dependencies

**Setup shadcn/ui:**
```bash
npx shadcn-ui@latest init

# Install essential dependencies
npm install @prisma/client prisma
npm install next-auth @auth/prisma-adapter
npm install bcryptjs @types/bcryptjs
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react date-fns

# Install shadcn components
npx shadcn-ui@latest add button card dialog form input label
npx shadcn-ui@latest add select table tabs toast badge
npx shadcn-ui@latest add dropdown-menu sheet switch textarea
```

### 3. Database Setup with Prisma

**Initialize Prisma:**
```bash
npx prisma init
```

**Configure Prisma Schema (prisma/schema.prisma):**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String    @id @default(cuid())
  email          String    @unique
  passwordHash   String
  firstName      String
  lastName       String
  whatsappNumber String?
  teamId         String?
  team           Team?     @relation(fields: [teamId], references: [id])
  role           String    @default("member")
  createdAt      DateTime  @default(now())

  contacts       Contact[]
  shipments      Shipment[]
}

model Team {
  id        String   @id @default(cuid())
  name      String
  users     User[]
  contacts  Contact[]
  createdAt DateTime @default(now())
}

model Contact {
  id             String   @id @default(cuid())
  name           String
  whatsappNumber String?
  email          String?
  company        String?
  isTeamContact  Boolean  @default(false)
  userId         String
  user           User     @relation(fields: [userId], references: [id])
  teamId         String?
  team           Team?    @relation(fields: [teamId], references: [id])
  createdAt      DateTime @default(now())
}

model Facility {
  id          String   @id @default(cuid())
  osId        String?
  name        String
  address     String?
  countryCode String?
  sector      String?
  latitude    Float?
  longitude   Float?
  createdAt   DateTime @default(now())
}

model Shipment {
  id             String   @id @default(cuid())
  trackingNumber String   @unique
  type           String   // 'incoming' or 'outgoing'
  sourcePincode  String
  destPincode    String
  status         String   @default("pending")
  priority       String   @default("normal")
  departureDate  DateTime?
  arrivalDate    DateTime?
  userId         String
  user           User     @relation(fields: [userId], references: [id])
  createdAt      DateTime @default(now())
}
```

**Run Migrations:**
```bash
# Set DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@localhost:5432/ubhaya"

# Generate and apply migration
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Environment Configuration

**.env.local:**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ubhaya"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-secret-with-openssl-rand-base64-32"

# Optional: Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

---

## Core Features Implementation

### Feature 1: NextAuth Setup

**Configure NextAuth (src/lib/auth.ts):**
```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !await bcrypt.compare(credentials.password, user.passwordHash)) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/login"
  }
};
```

**API Route (src/app/api/auth/[...nextauth]/route.ts):**
```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Login Page (src/app/(auth)/login/page.tsx):**
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Ubhaya</CardTitle>
          <CardDescription className="text-center">
            Login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

```

### Feature 2: Facility Search

**Facility Search Component (src/components/facilities/facility-search.tsx):**
```tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Facility {
  id: string;
  name: string;
  address: string;
  countryCode: string;
  sector: string;
}

export function FacilitySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [facilities, setFacilities] = useState<Facility[]>([]);

  const handleSearch = async () => {
    const params = new URLSearchParams({
      q: searchTerm,
      ...(country && { country }),
      ...(category && { category }),
    });

    const response = await fetch(`/api/facilities?${params}`);
    const data = await response.json();
    setFacilities(data);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search the Facility"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger>
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="BD">Bangladesh</SelectItem>
            <SelectItem value="IN">India</SelectItem>
            <SelectItem value="BR">Brazil</SelectItem>
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
            <SelectItem value="Textiles">Textiles</SelectItem>
            <SelectItem value="Food">Food</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} className="col-span-1 md:col-span-2">
          Search
        </Button>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map((facility) => (
          <Card key={facility.id}>
            <CardHeader>
              <CardTitle className="text-lg">{facility.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {facility.address}
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">{facility.countryCode}</Badge>
                <Badge variant="outline">{facility.sector}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Feature 3: Contact Management with Teams

**Contacts Page with Team Sharing:**
```jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Tabs, Tab, List, ListItem,
  ListItemText, IconButton, Button,
  Dialog, TextField, Switch,
  FormControlLabel, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function ContactsPage() {
  const [tab, setTab] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    whatsapp_number: '',
    email: '',
    company: '',
    is_team_contact: false
  });

  useEffect(() => {
    fetchContacts();
  }, [tab]);

  const fetchContacts = async () => {
    const endpoint = tab === 0 ? '/api/contacts/personal' : '/api/contacts/team';
    const response = await axios.get(endpoint);
    setContacts(response.data);
  };

  const handleAddContact = async () => {
    try {
      await axios.post('/api/contacts', newContact);
      setOpenDialog(false);
      fetchContacts();
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };

  const openWhatsApp = (number) => {
    window.open(`https://wa.me/${number}`, '_blank');
  };

  return (
    <Box>
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="My Contacts" />
        <Tab label="Team Contacts" />
      </Tabs>

      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => setOpenDialog(true)}
        sx={{ my: 2 }}
      >
        Add Contact
      </Button>

      <List>
        {contacts.map((contact) => (
          <ListItem
            key={contact.id}
            secondaryAction={
              <IconButton onClick={() => openWhatsApp(contact.whatsapp_number)}>
                <WhatsAppIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={contact.name}
              secondary={
                <>
                  {contact.company && <Chip label={contact.company} size="small" />}
                  {contact.is_team_contact && <Chip label="Team" size="small" color="primary" />}
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      {/* Add Contact Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <Box sx={{ p: 3, minWidth: 400 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({...newContact, name: e.target.value})}
          />
          <TextField
            fullWidth
            margin="normal"
            label="WhatsApp Number"
            value={newContact.whatsapp_number}
            onChange={(e) => setNewContact({...newContact, whatsapp_number: e.target.value})}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={newContact.email}
            onChange={(e) => setNewContact({...newContact, email: e.target.value})}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Company"
            value={newContact.company}
            onChange={(e) => setNewContact({...newContact, company: e.target.value})}
          />
          <FormControlLabel
            control={
              <Switch
                checked={newContact.is_team_contact}
                onChange={(e) => setNewContact({...newContact, is_team_contact: e.target.checked})}
              />
            }
            label="Share with team"
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleAddContact}
            sx={{ mt: 2 }}
          >
            Add Contact
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}

export default ContactsPage;
```

---

## Deployment (Simplified)

### 1. Local Development
```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### 2. Database Options

**Option A: Supabase (Recommended for MVP)**
1. Create free account at supabase.com
2. Create new project
3. Copy connection string to .env.local
4. Supabase provides:
   - PostgreSQL database
   - Real-time subscriptions (optional)
   - Auth helpers (optional)
   - Storage for files

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create database
createdb ubhaya

# Update .env.local
DATABASE_URL="postgresql://localhost:5432/ubhaya"
```

### 3. Production Deployment (Vercel)

**Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and add environment variables in Vercel dashboard:
# - DATABASE_URL (from Supabase/Neon)
# - NEXTAUTH_URL (your-domain.vercel.app)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
```

### 4. API Routes Structure

Next.js API routes replace the need for a separate backend:

```
src/app/api/
├── auth/
│   └── [...nextauth]/route.ts  # NextAuth endpoints
├── facilities/
│   ├── route.ts                 # GET, POST /api/facilities
│   └── [id]/route.ts           # GET, PUT, DELETE /api/facilities/[id]
├── contacts/
│   ├── route.ts                 # GET, POST /api/contacts
│   └── [id]/route.ts           # GET, PUT, DELETE /api/contacts/[id]
└── shipments/
    ├── route.ts                 # GET, POST /api/shipments
    └── [id]/route.ts           # GET, PUT, DELETE /api/shipments/[id]
```

---

## Testing Checklist

### Week 1-2: Foundation
- [ ] User can register
- [ ] User can login
- [ ] JWT token is stored
- [ ] Protected routes work

### Week 3-4: Facilities
- [ ] Import facilities from CSV
- [ ] Search facilities by name
- [ ] Filter by country
- [ ] Filter by category

### Week 5-6: Contacts
- [ ] Add personal contact
- [ ] Add team contact
- [ ] View contact list
- [ ] WhatsApp link works

### Week 7-8: Shipments
- [ ] Create shipment
- [ ] View incoming shipments
- [ ] View outgoing shipments
- [ ] Update shipment status

---

## Common Issues & Solutions

### Issue 1: Prisma Connection Errors
```typescript
// lib/prisma.ts - Singleton pattern for Next.js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Issue 2: NextAuth Session Not Working
```typescript
// Wrap your app with SessionProvider
// app/layout.tsx
import { SessionProvider } from "next-auth/react"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
```

### Issue 3: Protecting Routes
```typescript
// middleware.ts in root directory
import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

// Protect specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/facilities/:path*", "/contacts/:path*"],
}
```

### Issue 4: API Route Example
```typescript
// app/api/facilities/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const facilities = await prisma.facility.findMany();
  return NextResponse.json(facilities);
}

---

## Resources & Documentation

- **Next.js 14**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com/docs
- **Prisma**: https://www.prisma.io/docs
- **NextAuth.js**: https://next-auth.js.org/getting-started/introduction
- **Tailwind CSS**: https://tailwindcss.com/docs
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs

---

## Support & Next Steps

### Why This Stack?
1. **Next.js**: Full-stack in one framework, no need for separate backend
2. **shadcn/ui**: Beautiful components you own and can customize
3. **Prisma**: Type-safe database access with great DX
4. **Vercel**: Zero-config deployments with automatic scaling

### Development Priorities
1. **Setup Prisma and database first** - Foundation for everything
2. **Implement NextAuth** - Authentication gates all features
3. **Build UI with shadcn components** - Consistent, professional look
4. **Use TypeScript** - Catch errors early, better IDE support
5. **Deploy to Vercel early** - Get real-world testing fast

### MVP Timeline
- **Week 1-2**: Setup, auth, database schema
- **Week 3-4**: Facilities search, basic CRUD
- **Week 5-6**: Contacts with team sharing
- **Week 7-8**: Shipment tracking, testing

Remember: **Next.js + shadcn/ui = Rapid Development**. You get production-ready features out of the box:
- Server-side rendering for SEO
- API routes without extra setup
- Image optimization
- Built-in security best practices
- Automatic code splitting

Focus on business logic, not infrastructure!