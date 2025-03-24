# Attendance App Development Tracker

## Initial Schema Design (Draft)

```prisma
// Basic schema - to be expanded based on requirements
model Organization {
  id          String    @id @default(cuid())
  name        String
  locations   Location[]
  services    Service[]
  members     Member[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Location {
  id          String    @id @default(cuid())
  name        String
  orgId       String
  org         Organization @relation(fields: [orgId], references: [id])
  services    Service[]
}

model Service {
  id          String    @id @default(cuid())
  name        String
  locationId  String
  location    Location  @relation(fields: [locationId], references: [id])
  checkIns    CheckIn[]
  startTime   DateTime
  endTime     DateTime
  qrCode      String?   // Current service QR code
}

model Member {
  id          String    @id @default(cuid())
  name        String
  email       String?   @unique
  orgId       String
  org         Organization @relation(fields: [orgId], references: [id])
  checkIns    CheckIn[]
  role        Role      @default(MEMBER)
}

model CheckIn {
  id          String    @id @default(cuid())
  memberId    String
  member      Member    @relation(fields: [memberId], references: [id])
  serviceId   String
  service     Service   @relation(fields: [serviceId], references: [id])
  timestamp   DateTime  @default(now())
  method      CheckInMethod
}

enum Role {
  ADMIN
  MEMBER
}

enum CheckInMethod {
  QR_SCAN
  MANUAL
}
```

## Phase 1: Core Check-in System (Week 1-3)

- [ ] Basic Project Setup

  - [ ] Next.js project initialization
    - [ ] TypeScript configuration
    - [ ] ESLint + Prettier setup
    - [ ] Tailwind CSS integration
  - [ ] PostgreSQL basic setup
    - [ ] Prisma ORM setup
    - [ ] Initial schema migration
    - [ ] Basic seed data
  - [ ] Basic deployment pipeline
    - [ ] Vercel/Railway configuration
    - [ ] Environment management

- [ ] Service QR System

  - [ ] Service QR Code Generation

    - [ ] Dynamic QR generation using qrcode.js
    - [ ] Service-specific encoding (service_id + timestamp + location)
    - [ ] Error correction level L (faster scanning)
    - [ ] Size optimization for reliable scanning

  - [ ] Display Components

    - [ ] Responsive QR display container
    - [ ] CSS Grid layout for optimal positioning
    - [ ] Dark/Light mode support

  - [ ] Animation System (using Framer Motion)

    - [ ] QR Code States:

      - [ ] Initial mount: Fade in (300ms ease-in)
      - [ ] Pre-scan: Subtle pulse animation
      - [ ] Post-scan: Fade out (200ms ease-out)

    - [ ] Success Animation:

      - [ ] Checkmark: Scale + fade (400ms spring)
      - [ ] Name text: Slide up + fade (300ms ease-out)
      - [ ] Duration: 1.5s total animation cycle
      - [ ] Auto-reset for next check-in

    - [ ] State Management:
      - [ ] React Context for animation states
      - [ ] Debounce check-in triggers (500ms)
      - [ ] Prevent multiple simultaneous animations

  - [ ] Manual Input System

    - [ ] Search Input:
      - [ ] Debounced autocomplete (200ms)
      - [ ] Fuzzy search implementation
      - [ ] Keyboard navigation support
      - [ ] Clear button + keyboard shortcuts
    - [ ] Results Display:
      - [ ] Virtual list for performance
      - [ ] Highlight matching text
      - [ ] Click/Enter to select

  - [ ] Recent Check-ins Display
    - [ ] Real-time updates using SWR
    - [ ] Animated list transitions
    - [ ] Limited to last 5 check-ins
    - [ ] Auto-scroll with smooth animation

- [ ] Testing & Iteration
  - [ ] Animation Testing
    - [ ] Frame rate monitoring
    - [ ] Animation timing adjustments
    - [ ] Cross-browser compatibility
  - [ ] User Flow Testing
    - [ ] Lighthouse performance metrics
    - [ ] A11y compliance checks
  - [ ] Load Testing
    - [ ] Concurrent check-in handling
    - [ ] Database query optimization

## Phase 2: Mobile Authentication (Week 4-5)

- [ ] Mobile PWA Foundation

  - [ ] PWA Configuration

    - [ ] Service worker setup
    - [ ] Offline caching strategy
    - [ ] App manifest optimization

  - [ ] SSO Implementation

    - [ ] NextAuth.js Integration:
      - [ ] Email/Password authentication
      - [ ] Google OAuth provider
      - [ ] Custom session handling
      - [ ] Role-based authentication
    - [ ] JWT token management
    - [ ] Secure storage (httpOnly cookies)
    - [ ] Auto-renewal mechanism

  - [ ] Session Management
    - [ ] Token refresh strategy
    - [ ] Secure state persistence
    - [ ] Multi-tab synchronization
    - [ ] Logout handling

- [ ] Mobile Check-in Flow

  - [ ] QR Scanner Implementation

    - [ ] zxing-js integration
    - [ ] Camera permission handling
    - [ ] Scan area overlay design
    - [ ] Haptic feedback on scan

  - [ ] Mobile UI Components
    - [ ] Bottom sheet navigation
    - [ ] Gesture-based interactions
    - [ ] Native-like animations
    - [ ] Offline status indicator

## Phase 3: Admin Essentials (Week 6-7)

- [ ] Basic Admin Dashboard

  - [ ] Service management
  - [ ] Location management
  - [ ] Basic attendance reports
  - [ ] Admin authentication

- [ ] Testing & Iteration
  - [ ] Admin workflow testing
  - [ ] Security testing
  - [ ] Performance review

## Phase 4: Organization Setup (Week 8)

- [ ] Organization Management

  - [ ] Church profile setup
  - [ ] Basic branding options
  - [ ] Service scheduling

- [ ] Testing & Integration
  - [ ] End-to-end testing
  - [ ] Multi-service testing
  - [ ] UI/UX refinements

## Phase 5: Enhanced Features (Week 9-10)

- [ ] Feature Enhancement

  - [ ] Advanced reporting
  - [ ] Service analytics
  - [ ] Attendance trends

- [ ] Mobile Enhancements
  - [ ] Enhanced offline support
  - [ ] Check-in history
  - [ ] Personal attendance stats

## Phase 6: Polish & Launch (Week 11-12)

- [ ] Final Integration

  - [ ] Complete end-to-end testing
  - [ ] Performance optimization
  - [ ] Security hardening

- [ ] Launch Preparation
  - [ ] Documentation
  - [ ] Backup systems
  - [ ] Monitoring setup

## Current Status

- Phase: Core Check-in System
- Progress: 0%
- Next Milestone: Basic Project Setup
- Blockers: None

## Technical Standards

- Authentication:

  - OAuth 2.0 + PKCE
  - JWT with short expiry
  - Refresh token rotation

- Performance Targets:

  - First contentful paint < 1.5s
  - Time to interactive < 2s
  - Animation frame rate > 55fps

- Security:

  - OWASP compliance
  - Rate limiting
  - CSRF protection
  - XSS prevention

- Accessibility:
  - WCAG 2.1 Level AA
  - Keyboard navigation
  - Screen reader support
  - High contrast support

## Deployment Strategy

1. **Development Environment**:

   ```bash
   # Local Development
   ├── .env.local          # Local environment variables
   ├── docker-compose.yml  # Local PostgreSQL + Redis
   └── package.json        # Development scripts
   ```

2. **Staging Environment** (Vercel Preview):

   - Automatic preview deployments
   - Separate staging database
   - E2E testing environment
   - Feature flag testing

3. **Production Environment** (Vercel):

   - Zero-downtime deployments
   - Automatic SSL/TLS
   - Edge caching
   - Performance monitoring

4. **Database Management**:

   ```bash
   # Database Migrations
   ├── prisma/
   │   ├── migrations/     # Version controlled migrations
   │   └── schema.prisma   # Schema definition
   ```

   - Railway for PostgreSQL hosting
   - Automated backups
   - Point-in-time recovery

5. **CI/CD Pipeline**:

   ```yaml
   # GitHub Actions workflow
   name: CI/CD
   on: [push, pull_request]

   jobs:
     test:
       - run: npm test
       - run: npm run lint

     deploy:
       needs: test
       if: github.ref == 'refs/heads/main'
       - uses: vercel/actions/deploy
   ```

6. **Monitoring & Logging**:
   - Vercel Analytics
   - Error tracking (Sentry)
   - Performance monitoring
   - Usage analytics

## Feature Flags

1. **Implementation** (using `config.ts`):

```typescript
// config/features.ts
export const features = {
  AUTH: {
    GOOGLE_SSO: true,
    EMAIL_MAGIC_LINK: true,
    APPLE_SSO: false, // Coming soon
  },
  CHECK_IN: {
    QR_SCANNING: true,
    MANUAL_ENTRY: true,
    GEOFENCING: false, // Future feature
    FACIAL_RECOGNITION: false,
  },
  NOTIFICATIONS: {
    EMAIL: true,
    PUSH: false, // Phase 2
    SMS: false, // Future feature
  },
  ANALYTICS: {
    BASIC_REPORTS: true,
    TRENDS: false, // Phase 5
    EXPORTS: false, // Phase 5
  },
  ADMIN: {
    BASIC_DASHBOARD: true,
    ADVANCED_REPORTS: false,
    BULK_OPERATIONS: false,
  },
};

// Usage in components
import { features } from "@/config/features";

const MyComponent = () => {
  if (features.CHECK_IN.GEOFENCING) {
    // Render geofencing feature
  }
  return; // ... regular component
};
```

2. **Feature Flag Management**:

   - Environment-based flags
   - Role-based flags
   - A/B testing capability

   ```typescript
   // utils/features.ts
   export const isFeatureEnabled = (
     feature: string,
     user?: User,
     org?: Organization
   ) => {
     // Check environment
     if (process.env.NODE_ENV === "development") {
       return true;
     }

     // Check user role
     if (user?.role === "ADMIN") {
       return true;
     }

     // Check organization tier
     if (org?.tier === "PREMIUM") {
       return true;
     }

     return features[feature] ?? false;
   };
   ```

3. **Gradual Rollout Strategy**:

   ```typescript
   // Phase 1: Core Features
   - QR_SCANNING: 100% enabled
   - MANUAL_ENTRY: 100% enabled
   - BASIC_REPORTS: 100% enabled

   // Phase 2: Enhanced Features
   - PUSH_NOTIFICATIONS: 20% rollout
   - GEOFENCING: Beta testers only
   - ADVANCED_REPORTS: Admin users only
   ```

## Notes

- Centralized QR code per service/location
- Focus on smooth, intuitive animations
- Mobile-first authentication approach
- Regular testing and feedback incorporated throughout
- Performance and accessibility as core features
- Start monolithic, prepare for microservices
- Use feature flags for gradual rollout
- Keep services loosely coupled for future separation

## Potential Microservices Architecture

(For future scaling - not needed for MVP)

1. **Core Services**:

   - Authentication Service

     - User management
     - Session handling
     - Role management

   - Check-in Service

     - QR code generation
     - Check-in processing
     - Real-time updates

   - Analytics Service
     - Attendance tracking
     - Report generation
     - Data aggregation

2. **Supporting Services**:

   - Notification Service

     - Email notifications
     - Push notifications

   - Export Service
     - Report generation
     - Data exports

3. **Communication**:
   - Message Queue (e.g., Redis)
   - API Gateway
   - Service Discovery

## NextAuth.js Implementation Details

```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Add custom session data
      session.user.orgId = user.orgId;
      session.user.role = user.role;
      return session;
    },
    async jwt({ token, user }) {
      // Add custom token data
      if (user) {
        token.role = user.role;
        token.orgId = user.orgId;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
```
