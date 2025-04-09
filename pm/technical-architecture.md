# Technical Architecture - ChMS

> **Related Documents:**
>
> - [Product Requirements Document](./prd.md)
> - [User Stories](./user-stories.md)
> - [Security Policy](./security-policy.md)
> - [Deployment Manual](./deployment-manual.md)
> - [Development Standards](../docs/standards/development-standards.md)

## 1. Overview

This document outlines the high-level technical architecture for the ChMS application. It details the technology stack, system components, data flow, and key architectural decisions.

**Goals:** Scalability, maintainability, offline-first capability, low-bandwidth optimization, security, testability.

## 2. Technology Stack

- **Frontend Framework:** Next.js 15 (React 19+)
- **Language:** TypeScript 5+
- **UI Library:** Chakra UI (v3+)
- **State Management / Data Fetching:** SWR
- **Form Handling:** React Hook Form
- **Schema Validation:** Zod
- **Backend:** Next.js API Routes / Server Components / Server Actions
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js
- **Testing:** Vitest, React Testing Library, MSW (Mock Service Worker), Cypress / Playwright
- **CI/CD:** GitHub Actions
- **Containerization:** Docker (for development consistency)

## 3. System Components

_(Diagrams and detailed descriptions to be added)_

- **Web Application (Next.js):** Handles UI rendering (SSR, SSG, Client Components), routing, API requests, and serves static assets.
- **API Layer (Next.js API Routes/Actions):** Provides backend logic, interacts with the database via Prisma, handles authentication/authorization.
- **Database (PostgreSQL):** Stores application data (members, attendance, configuration, etc.). Managed via Prisma migrations.
- **Authentication Service (NextAuth.js):** Manages user sessions, login flows, and security tokens.
- **Data Caching Layer (SWR):** Manages client-side data fetching, caching, revalidation, and supports offline access patterns.
- **(Potentially) Background Job Processor:** For tasks like sending notifications or data processing (if needed).

## 4. Data Flow

_(Diagrams to be added)_

- **Read Operations:** Client Component requests data via SWR -> SWR checks cache/revalidates -> Hits Next.js API Route/Server Action -> Prisma queries PostgreSQL -> Data returned -> SWR updates UI.
- **Write Operations:** User interaction triggers form submission -> React Hook Form validates -> Data sent to Next.js API Route/Server Action -> Prisma performs mutation on PostgreSQL -> Response returned -> SWR potentially revalidates related data / optimistic update.
- **Offline Sync:** (Strategy TBD) SWR cache provides data offline. Mutations queued locally? Background sync when online?

## 5. Key Architectural Decisions

- **Monorepo vs. Polyrepo:** Currently a single repository structure.
- **Serverless Approach:** Leveraging Next.js API Routes/Server Actions for backend logic.
- **Offline Strategy:** Utilizing SWR's caching capabilities as a base. Specific synchronization mechanisms need detailed design (see ADRs).
- **UI Library Choice:** Chakra UI selected for its accessibility, component richness, and theming capabilities.
- **ORM Choice:** Prisma chosen for type safety and developer experience.

_(Link to relevant ADRs in `pm/adrs/`)_

## 6. Scalability & Performance Considerations

- Database indexing and query optimization.
- Efficient data fetching patterns with SWR.
- Code splitting via Next.js.
- Potential use of Server Components for reduced client-side JS.
- CDN for static assets.
- Load testing strategy (via Cypress/Playwright?).

## 7. Security Considerations

_(Details in [security-policy.md](./security-policy.md))_

- Authentication via NextAuth.js.
- Role-Based Access Control (RBAC) implemented in API layer.
- Input validation using Zod.
- Standard security headers, CSRF protection.
- Data encryption at rest and in transit.

## 8. Deployment Strategy

_(Details in [deployment-manual.md](./deployment-manual.md))_

- CI/CD via GitHub Actions.
- Deployment target (Vercel, Docker container on cloud provider, etc. - TBD).
- Environment management (dev, staging, prod).
- Database migration strategy.

## 9. Version History

### 1.0.0 - [Initial Date]

- Initial technical architecture document

### 1.1.0 - [Current Date]

- Added version history section
- Added cross-references to related documentation
