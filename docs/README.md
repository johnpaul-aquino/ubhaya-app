# Ubhaya - Supply Chain Management Platform

A comprehensive supply chain management platform designed for emerging markets, integrating facility management, shipping operations, and team collaboration features.

## 🎯 Project Overview

Ubhaya helps businesses manage:
- **Facilities**: Search and manage supply chain facilities from OpenSupplyHub.org
- **Shipments**: Track incoming and outgoing shipments
- **Contacts**: Manage personal and team contacts with WhatsApp integration
- **Documents**: Store and share documents with team members
- **Shipping**: Calculate shipping costs between locations

## 📁 Repository Structure

```
ubhaya/
├── mockup/                         # Interactive mockup/prototype pages
│   ├── index.html                  # Dashboard mockup
│   ├── facilities.html             # Facility search & management
│   ├── shipments.html              # Shipment tracking
│   ├── contacts.html               # Contact management
│   ├── team.html                   # Team management with modals
│   ├── calculator.html             # Shipping calculator (functional)
│   ├── documents.html              # Document management
│   ├── login.html                  # Login page
│   └── register.html               # Registration page
├── assets/                         # Shared CSS and JavaScript
│   ├── style.css                   # Main stylesheet
│   ├── dashboard.js                # Shared utilities
│   └── ...
├── plans/                          # Project documentation
│   ├── project_plan.html           # Original project plan with Gantt chart
│   ├── project_plan_alternative.html # Alternative project plan
│   └── ubhaya-overview.html        # Platform overview document
├── docs/                           # Documentation files
│   ├── README.md                   # Documentation index
│   ├── mvp_development_guide.md    # Step-by-step MVP development guide
│   ├── simplified_feature_specs.md # Simplified feature specifications
│   ├── tests/                      # Testing documentation
│   │   └── test_mermaid.html       # Mermaid diagram test
│   └── ...
├── .docs/                          # Official project documentation
│   ├── OFFICIAL_DOCUMENTATION.md   # Complete platform documentation
│   ├── API_REFERENCE.md           # API endpoints and examples
│   ├── DEPLOYMENT_CHECKLIST.md    # Production deployment guide
│   └── ...
├── .image-docs/                    # UI mockups and data files
│   ├── facilities.csv              # Sample data from OpenSupplyHub.org
│   └── *.png                       # Feature mockup images
├── guides/                         # Additional guides and tutorials
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
└── README.md                       # Main project README
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase account)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/ubhaya.git
cd ubhaya

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Setup database
npx prisma migrate dev
npx prisma generate

# Install shadcn/ui
npx shadcn-ui@latest init

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Documentation

### For Developers
- **[MVP Development Guide](./mvp_development_guide.md)** - Step-by-step guide to build the MVP
- **[API Reference](./.docs/API_REFERENCE.md)** - Complete API documentation
- **[Official Documentation](./.docs/OFFICIAL_DOCUMENTATION.md)** - Comprehensive platform documentation

### For Project Managers
- **[Simplified Feature Specs](./simplified_feature_specs.md)** - Clear feature specifications
- **[Project Overview](./.docs/OFFICIAL_DOCUMENTATION.md#project-overview)** - Vision and goals

### For DevOps
- **[Deployment Checklist](./.docs/DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
- **[System Architecture](./.docs/OFFICIAL_DOCUMENTATION.md#system-architecture)** - Technical architecture

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI**: shadcn/ui with Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel + Supabase

## 🎨 Features

### Core Features (MVP)
- ✅ User authentication and registration
- ✅ Facility search with filters
- ✅ Contact management (personal & team)
- ✅ Shipment tracking (incoming/outgoing)
- ✅ Basic shipping calculator
- ✅ Document management

### Team Collaboration
- Share contacts with team members
- Role-based permissions (Admin, Team Leader, Member, Viewer)
- Team document sharing
- Collaborative shipment tracking

## 📊 Data Source

The platform integrates with [OpenSupplyHub.org](https://opensupplyhub.org) data, providing access to:
- 50,000+ facility records
- Global supply chain information
- Manufacturing facility details
- Compliance and certification data

Sample data is available in `.image-docs/facilities.csv`

## 🚢 Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ubhaya)

### Manual Deployment

See [Deployment Checklist](./.docs/DEPLOYMENT_CHECKLIST.md) for detailed instructions.

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type checking
npm run type-check
```

## 📈 Project Status

**Current Version**: 1.0.0 (MVP)
**Status**: In Development
**Target Launch**: Q1 2025

### Development Phases
- [x] Project setup and documentation
- [ ] Phase 1: Authentication & Basic Features (Month 1-2)
- [ ] Phase 2: Core Features (Month 3-4)
- [ ] Phase 3: Enhancement & Polish (Month 5-6)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 📞 Support

- **Documentation**: See [.docs](./.docs) folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/ubhaya/issues)
- **Email**: support@ubhaya.com

## 👥 Team

- **Client**: Viola
- **Development Team**: TBD
- **Project Manager**: TBD

---

*Built with ❤️ for emerging markets supply chain management*