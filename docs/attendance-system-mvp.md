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
  SUPER_ADMIN
  ADMIN
  MANAGER
  STAFF
  VIEWER
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

### Phase 1: Core Check-in System (Completed)

- [x] Basic Project Setup

  - [x] Next.js initialization
  - [x] TypeScript configuration
  - [x] ESLint + Prettier
  - [x] Chakra UI integration
  - [x] Authentication setup
  - [x] PostgreSQL setup
  - [x] Basic seed data
  - [x] Vercel deployment

- [x] Service QR System
  - [x] QR generation
  - [x] Display components
  - [x] Animation system
  - [x] Manual input system
  - [x] Recent check-ins display

### Phase 2: Mobile Authentication (In Progress)

- [x] Mobile PWA Foundation
  - [x] Service worker
  - [x] Offline caching
  - [x] SSO Implementation
  - [ ] Session management

### Phase 3-6: Enhanced Features (In Progress)

- [x] Admin dashboard
- [x] Organization setup
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

## Success Metrics (Updated Targets)

### Technical

- Page load time < 1.5s (Updated from 2s)
- API response time < 150ms (Updated from 200ms)
- Test coverage > 85% (Updated from 80%)
- Zero critical bugs
- 99.95% uptime (Updated from 99.9%)

### User Experience

- < 3 clicks for check-in
- < 5s for report generation
- Zero data loss
- Intuitive interface
- Mobile responsiveness

## Pages and Features

### 1. Service Check-in Dashboard (/check-in)

- Live QR code display (rotating codes for security)
- Manual check-in form (fallback option)
- Recent check-ins list (real-time updates)
- Quick stats (today's attendance)
- Service selector (switch between active services)
- Offline mode indicator
- Family check-in support

### 2. Attendance Overview (/attendance)

- Attendance metrics dashboard
- Service attendance comparison
- Trend analysis
- Member attendance patterns
- Export functionality
- Date range filtering
- Location filtering

### 3. Service Management (/services)

- Service schedule management
- Service type configuration
- Location assignment
- Time slot management
- Recurring service setup
- Capacity planning
- Service categories

### 4. Check-in Station Setup (/check-in/setup)

- Device registration
- QR scanner configuration
- Printer setup
- Offline mode settings
- Station location assignment
- Access control settings
- Network status monitoring

### 5. Attendance Reports (/reports)

- Customizable report builder
- Preset report templates
- Statistical analysis
- Attendance trends
- Member participation
- Service comparison
- Export options (PDF, CSV, Excel)

### 6. Member Attendance Profile (/members/[id]/attendance)

- Individual attendance history
- Attendance streak tracking
- Service participation summary
- Absence patterns
- Notes and comments
- Communication preferences
- Family attendance linking

### 7. Mobile Check-in (/m/check-in)

- QR code scanner
- Location verification
- Quick check-in flow
- Offline capability
- Family check-in
- Recent check-in confirmation
- Error handling

### 8. Admin Dashboard (/admin/attendance)

- System health monitoring
- User activity logs
- Configuration settings
- Data management
- Access control
- Audit trails
- Backup/restore options

### 9. Analytics Dashboard (/analytics/attendance)

- Advanced metrics
- Custom reports
- Growth trends
- Retention analysis
- Service performance
- Location insights
- Predictive analytics

### 10. Settings (/settings/attendance)

- Check-in rules
- Notification preferences
- Report configurations
- Integration settings
- Data retention policies
- Privacy settings
- System preferences

## User Flows

### 1. Regular Member Check-in Flow

```mermaid
graph TD
    A[Member Arrives] --> B{Has QR Code?}
    B -->|Yes| C[Scan QR Code]
    B -->|No| D[Manual Check-in]
    C --> E{Valid Code?}
    E -->|Yes| F[Select Service]
    E -->|No| D
    D --> F
    F --> G[Confirm Check-in]
    G --> H[Success Screen]
    H --> I[Add Family Members?]
    I -->|Yes| J[Select Family]
    I -->|No| K[Done]
    J --> G
```

### 2. Admin Service Management Flow

```mermaid
graph TD
    A[Admin Dashboard] --> B[Service Management]
    B --> C{Action Type}
    C -->|Create| D[New Service Form]
    C -->|Edit| E[Edit Service]
    C -->|Delete| F[Delete Confirmation]
    D --> G[Set Schedule]
    G --> H[Set Location]
    H --> I[Set Capacity]
    I --> J[Preview]
    J --> K[Save Service]
    E --> G
    F --> L[Check Dependencies]
    L -->|Has Attendees| M[Archive Instead]
    L -->|No Attendees| N[Delete Service]
```

### 3. Check-in Station Setup Flow

```mermaid
graph TD
    A[Setup Station] --> B[Register Device]
    B --> C[Select Location]
    C --> D[Configure Hardware]
    D --> E{Printer Required?}
    E -->|Yes| F[Setup Printer]
    E -->|No| G[Configure Display]
    F --> H[Test Setup]
    G --> H
    H -->|Success| I[Ready for Check-in]
    H -->|Failed| J[Troubleshoot]
    J --> H
```

### 4. Attendance Report Generation Flow

```mermaid
graph TD
    A[Reports Dashboard] --> B{Report Type}
    B -->|Custom| C[Select Metrics]
    B -->|Template| D[Choose Template]
    C --> E[Set Date Range]
    D --> E
    E --> F[Select Services]
    F --> G[Apply Filters]
    G --> H[Preview Report]
    H --> I{Export?}
    I -->|Yes| J[Choose Format]
    I -->|No| K[View Online]
    J --> L[Download]
```

### 5. Family Check-in Flow

```mermaid
graph TD
    A[Family Check-in] --> B[Scan Primary Member]
    B --> C[Show Family List]
    C --> D[Select Members]
    D --> E[Bulk Service Select]
    E --> F[Confirm Selections]
    F --> G[Process Check-ins]
    G --> H[Print Labels?]
    H -->|Yes| I[Print Badges]
    H -->|No| J[Show Success]
```

### 6. Offline Mode Operation Flow

```mermaid
graph TD
    A[Start Check-in] --> B{Internet Available?}
    B -->|Yes| C[Normal Operation]
    B -->|No| D[Offline Mode]
    D --> E[Local Storage]
    E --> F[Queue Operations]
    F --> G{Internet Restored?}
    G -->|Yes| H[Sync Data]
    G -->|No| I[Continue Offline]
    H --> J[Resolve Conflicts]
    J --> K[Update Status]
```

### 7. Analytics Dashboard Flow

```mermaid
graph TD
    A[Analytics Home] --> B[Select Time Period]
    B --> C{View Type}
    C -->|Overview| D[Show Key Metrics]
    C -->|Detailed| E[Load Full Data]
    C -->|Trends| F[Calculate Trends]
    D --> G[Generate Insights]
    E --> G
    F --> G
    G --> H[Display Visualizations]
    H --> I[Interactive Filters]
    I --> J[Export Options]
```

### 8. Mobile Check-in Flow

```mermaid
graph TD
    A[Open Mobile App] --> B[Location Check]
    B --> C{Within Geofence?}
    C -->|Yes| D[Show Scanner]
    C -->|No| E[Show Error]
    D --> F[Scan Code]
    F --> G{Valid Code?}
    G -->|Yes| H[Quick Check-in]
    G -->|No| I[Show Error]
    H --> J[Success]
    J --> K[Add More?]
    K -->|Yes| D
    K -->|No| L[Done]
```
