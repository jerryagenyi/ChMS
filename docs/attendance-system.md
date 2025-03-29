# Attendance System Specification

## Overview

The attendance tracking system is a core component of ChMS Africa, designed to handle both service and class attendance with support for family check-ins.

## Technical Implementation

### Schema Design

```prisma
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

## Core Features

### 1. Service Attendance

- QR code-based check-in
- Manual entry option
- Offline capability
- Location verification
- Family check-in support (future)

### 2. Class Attendance

- Multiple class types support
- Session management
- Attendance tracking
- Student enrollment tracking

### 3. Family Management

- Family registration
- Child linking
- Family unit tracking
- Future: Single scan for multiple members

## Implementation Phases

### Phase 1: Core Check-in System (Week 1-3)

- [x] Basic Project Setup

  - [x] Next.js initialization
  - [x] TypeScript configuration
  - [x] ESLint + Prettier
  - [x] Chakra UI integration
  - [x] Authentication setup
  - [x] PostgreSQL setup
  - [ ] Basic seed data
  - [ ] Vercel deployment

- [ ] Service QR System
  - [ ] QR generation
  - [ ] Display components
  - [ ] Animation system
  - [ ] Manual input system
  - [ ] Recent check-ins display

### Phase 2: Mobile Authentication (Week 4-5)

- [ ] Mobile PWA Foundation
  - [ ] Service worker
  - [ ] Offline caching
  - [ ] SSO Implementation
  - [ ] Session management

### Phase 3-6: Enhanced Features (Week 6-12)

- [ ] Admin dashboard
- [ ] Organization setup
- [ ] Advanced features
- [ ] Polish & launch

## Technical Standards

### Performance Targets

- First contentful paint < 1.5s
- Time to interactive < 2s
- Animation frame rate > 55fps

### Security

- OWASP compliance
- Rate limiting
- CSRF protection
- XSS prevention

### Accessibility

- WCAG 2.1 Level AA
- Keyboard navigation
- Screen reader support
- High contrast support

## Monitoring & Logging

### Performance Monitoring

```typescript
// Implementation in lib/monitoring.ts
export const performanceMonitor = {
  start: (label: string) => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      logger.info({ type: 'performance', label, duration });
      return duration;
    };
  },
};
```

### Error Tracking

```typescript
export const trackError = (error: Error, context: Record<string, any> = {}) => {
  logger.error({
    error: {
      message: error.message,
      stack: error.stack,
      ...context,
    },
  });
  Sentry.captureException(error, { extra: context });
};
```

### Usage Analytics

```typescript
export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  logger.info({
    type: 'event',
    event: eventName,
    ...properties,
  });
};
```

## Feature Flags

```typescript
export const features = {
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
};
```

## Success Metrics

### Technical

- Page load time < 2s
- API response time < 200ms
- Test coverage > 80%
- Zero critical bugs
- 99.9% uptime

### User Experience

- < 3 clicks for check-in
- < 5s for report generation
- Zero data loss
- Intuitive interface
- Mobile responsiveness
