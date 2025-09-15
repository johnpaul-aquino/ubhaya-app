# CLAUDE.md — Project Constitution

This file defines how Claude should interact with and support this project.  
It encodes conventions, workflows, and rules that MUST be followed.

---

## Project Overview
A **Next.js headless website boilerplate** optimized for:
- **Color-Palette-Expert** → accessible, scalable color systems.
- **SEO Architect** → high-performance SEO, structured metadata.
- **NextJS-Headless-Architect** → modular, CMS-agnostic headless architecture.
- **UI-UX with Magic UI v4** → leverage [Magic UI](https://magicui.design) for advanced animated UI components, modern design patterns, and React 19 compatibility.
- **Dynamic Media** → leverage **Unsplash MCP** for royalty-free images directly in development and prototyping.

---

## Tech Stack
- Framework: **Next.js (latest)** with TypeScript.
- Styling: **TailwindCSS v4** + **shadcn/ui** + **Magic UI v4**.
- CMS: Headless (Sanity / Contentful / Strapi, interchangeable).
- SEO Tools: Next.js `<Head>`, Open Graph, sitemap, robots.txt, JSON-LD.
- Design & DX: **Magic UI v4** for animated components, modern UI patterns, and React 19 compatibility.
- Media Assets: **Unsplash MCP** for dynamic images during development or demo content.
- Testing: Jest / React Testing Library.
- Tooling: ESLint, Prettier, Husky, Commitlint.

---

## Directory Structure
- `/src/app` → Next.js app routes.
- `/src/components` → Reusable UI components (shadcn/ui + Magic UI v4).
- `/src/lib` → Utilities and helpers.
- `/src/styles` → Global styles, theme, typography.
- `/src/hooks` → React hooks.
- `/src/tests` → Unit/integration tests.
- `/public/assets` → Static images (complementing Unsplash MCP for dynamic ones).

---

## Commands
- `npm run dev` — Start development server.
- `npm run build` — Build for production.
- `npm run lint` — Lint and format check.
- `npm run test` — Run tests.
- `npm run type-check` — Run TypeScript checks.
- `npm run prepare` — Setup Husky hooks.
- `npx shadcn@latest add @magicui/<component>` — Add Magic UI components.
- `npx unsplash-mcp fetch <query>` — Fetch placeholder/demo images from Unsplash MCP.

---

## Code Style & Conventions
- MUST use **TypeScript** with explicit types for complex data.
- MUST use **ES Modules** (`import/export`).
- MUST use **Tailwind v4 classes** and CSS custom properties for consistency.
- SHOULD keep components small, composable, and accessible (ARIA compliance).
- SHOULD use **PascalCase** for components, **camelCase** for functions/variables.
- SHOULD document exported functions/components with JSDoc or TS doc comments.
- DO NOT hardcode colors or fonts; use CSS custom properties and design tokens.
- DO NOT commit Unsplash MCP temporary images to production (use only for dev/demo).

---

## SEO Rules
- MUST define unique `<title>` and `<meta description>` for every page.
- MUST implement **Open Graph** and **Twitter Card** tags.
- MUST generate **sitemap.xml** and **robots.txt**.
- MUST include **structured data (JSON-LD)** for rich snippets.
- SHOULD optimize performance: lazy load images, preload fonts, use Next.js Image.

---

## UI/UX Guidelines
- Use **Magic UI v4** for:
  - Animated UI components and micro-interactions.
  - Modern design patterns with React 19 compatibility.
  - Beautiful visual effects and transitions.
- Use **Unsplash MCP** to fetch placeholder/demo images for prototypes and design mocks.
- Ensure **dark mode** with persistent theme toggle.
- Follow **WCAG AA+ accessibility** standards.
- Provide **clear CTAs** in hero sections and forms.  

---

## UI Typography
- Typography MUST be defined as **CSS custom properties** for consistency and theming.
- Tailwind v4's CSS-based configuration MUST define `font-family`, `font-size`, and `line-height` scales.
- Headings (`h1`–`h6`) MUST follow consistent scale and spacing using CSS custom properties.
- Body text SHOULD default to a **readable sans-serif** family with fallback stacks.
- Font weights SHOULD be limited to a consistent set (e.g., `400`, `500`, `700`) for performance.
- Text contrast MUST meet **WCAG AA+** requirements in both light and dark modes.
- Use **shadcn/ui typography components** (e.g., `TypographyH1`, `TypographyP`) where available.

---

## Testing Strategy
- MUST include unit tests for logic utilities.
- SHOULD add integration tests for page flows.
- MUST test accessibility (aXe, jest-axe).
- Test filenames: `*.test.tsx` or `*.spec.tsx`.

---

## Git Workflow
- Branches:  
  - `feature/<name>`  
  - `bugfix/<name>`  
  - `chore/<name>`  
- Commits follow **Conventional Commits** (`feat:`, `fix:`, `chore:`, etc.).
- Every PR MUST include:  
  - Summary of changes.  
  - Screenshots (if UI change).  
  - Linked issue/task.  

---

## Warnings & Gotchas
- DO NOT commit `.env` files or secrets.
- DO NOT skip linting, formatting, or type checks.
- Avoid large, monolithic components — break into smaller pieces.
- Always check color contrast ratios before committing design changes.
- Use **Magic UI v4 components** responsibly - ensure they work well with existing design system.
- Unsplash MCP assets are for **development/demo only**, replace with production-approved assets before deployment.

---

## Process Reminders
- Always consult this file before coding.
- When adding new dependencies, update this file if relevant.
- If unsure about rules, ask for clarification instead of guessing.
- Update this file as the project evolves.
