# Services Architecture Tutorial

> **Difficulty Level**: Intermediate
> **Prerequisites**: Basic TypeScript, familiarity with API design
> **Version**: Next.js 13+, Prisma 4+

## Quick Reference

```typescript
// API Service
import { apiService } from '@/services/api';
const data = await apiService.users.getById(userId);

// Database Service
import { db } from '@/services/db';
const user = await db.user.findUnique({ where: { id: userId } });

// Auth Service
import { authService } from '@/services/auth';
const isAuthorized = await authService.hasPermission(userId, 'edit:users');

// Business Logic Service
import { userService } from '@/services/user';
const result = await userService.updateProfile(userId, profileData);
```

## Overview

This tutorial explains our services architecture and how it evolved from the old `lib` folder structure. The new architecture provides better separation of concerns and clearer organization of our application's functionality. Services are specialized modules that handle specific aspects of the application, such as API communication, database operations, or business logic.

## The Old `lib` Folder

The `lib` folder was a catch-all directory that contained various utilities and business logic. While it worked, it had some limitations:

```plaintext
src/lib/
├── __mocks__/          # Test mocks
├── prisma.ts           # Database client
├── organization.ts     # Organization logic
├── qr.ts              # QR code handling
├── validation/        # Form validation
├── logger.ts          # Logging utilities
├── auth/             # Authentication logic
├── errors.ts         # Error handling
├── attendance/       # Attendance logic
├── auth-options.ts   # Auth configuration
└── auth.ts          # Auth implementation
```

### Problems with the Old Structure:

1. Mixed concerns (utilities, business logic, and configuration)
2. Unclear dependencies between files
3. Hard to maintain as the application grew
4. Difficult to test individual components

## The New Services Architecture

### Ministry Management Services

The new ministry management structure replaces the old department/team system with a more flexible MinistryUnit approach:

```plaintext
src/services/ministry/
├── ministryUnit.service.ts    # Core ministry unit operations
├── ministryMember.service.ts  # Member assignment and management
└── __tests__/                # Service-specific tests
```

### Key Features

1. Hierarchical Structure

   - Support for nested units (departments containing teams)
   - Flexible categorization
   - Clear leadership roles

2. Member Management

   - Tracked membership status
   - Role-based assignments
   - Leadership positions

3. Organization Integration
   - Direct connection to organization
   - Proper relationship tracking
   - Enhanced querying capabilities

### 2. Service Types

#### API Service (`src/services/api/`)

Handles all HTTP communication with our backend:

```typescript
// Example: src/services/api/attendance.ts
export const attendanceApi = {
  checkIn: async (data: CheckInData) => {
    return post<Attendance>('/attendance/check-in', data);
  },
  getReport: async (params: ReportParams) => {
    return get<AttendanceReport>('/attendance/report', params);
  },
};
```

#### Database Service (`src/services/db/`)

Manages database operations:

```typescript
// Example: src/services/db/prisma.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const db = {
  attendance: {
    create: async (data: AttendanceCreate) => {
      return prisma.attendance.create({ data });
    },
    findMany: async (params: AttendanceFindMany) => {
      return prisma.attendance.findMany(params);
    },
  },
};
```

#### Auth Service (`src/services/auth/`)

Handles authentication and authorization:

```typescript
// Example: src/services/auth/index.ts
export const authService = {
  login: async (credentials: LoginCredentials) => {
    return signIn('credentials', credentials);
  },
  logout: async () => {
    return signOut();
  },
  getSession: async () => {
    return getSession();
  },
};
```

#### Attendance Service (`src/services/attendance/`)

Manages attendance-related business logic:

```typescript
// Example: src/services/attendance/index.ts
export const attendanceService = {
  generateQR: async (serviceId: string) => {
    return qrService.generate(serviceId);
  },
  validateCheckIn: async (data: CheckInData) => {
    return validationService.validateCheckIn(data);
  },
  processAttendance: async (data: AttendanceData) => {
    return db.attendance.create(data);
  },
};
```

#### Organization Service (`src/services/organization/`)

Handles organization-related operations:

```typescript
// Example: src/services/organization/index.ts
export const organizationService = {
  getCurrentOrg: async () => {
    return db.organization.findFirst();
  },
  updateOrg: async (data: OrganizationUpdate) => {
    return db.organization.update(data);
  },
};
```

## Benefits of the New Architecture

1. **Separation of Concerns**

   - Each service has a specific responsibility
   - Clear boundaries between different parts of the application
   - Easier to maintain and test

2. **Better Organization**

   - Related functionality is grouped together
   - Clear import paths
   - Easier to find and modify code

3. **Improved Testing**

   - Services can be tested in isolation
   - Easier to mock dependencies
   - Better test coverage

4. **Enhanced Maintainability**
   - Smaller, focused files
   - Clear dependencies
   - Easier to refactor

## Usage Examples

### 1. Using Multiple Services Together

```typescript
// In a component
const handleCheckIn = async (data: CheckInData) => {
  try {
    // Validate the check-in
    await attendanceService.validateCheckIn(data);

    // Process the attendance
    const attendance = await attendanceService.processAttendance(data);

    // Update UI
    toast.success('Successfully checked in!');
  } catch (error) {
    toast.error('Failed to check in');
  }
};
```

### 2. Service Composition

```typescript
// In attendance service
export const attendanceService = {
  async checkIn(data: CheckInData) {
    // Use multiple services together
    const org = await organizationService.getCurrentOrg();
    const validated = await validationService.validate(data);
    const attendance = await db.attendance.create({
      ...data,
      organizationId: org.id,
    });

    return attendance;
  },
};
```

## Best Practices

1. **Service Design**

   - Keep services focused and single-purpose
   - Use TypeScript for type safety
   - Document public methods
   - Handle errors consistently

2. **Dependencies**

   - Use dependency injection where possible
   - Avoid circular dependencies
   - Keep services independent

3. **Testing**

   - Write unit tests for each service
   - Mock external dependencies
   - Test error cases
   - Use integration tests for complex flows

4. **Error Handling**
   - Use custom error types
   - Provide meaningful error messages
   - Log errors appropriately
   - Handle edge cases

## Migration Guide

When moving from `lib` to services:

1. **Identify Service Boundaries**

   - Group related functionality
   - Determine dependencies
   - Plan the new structure

2. **Move Files**

   - Create new service directories
   - Move files to appropriate locations
   - Update import paths

3. **Refactor Code**

   - Split large files into smaller ones
   - Create service interfaces
   - Add proper error handling
   - Add TypeScript types

4. **Update Tests**
   - Move test files
   - Update test imports
   - Add new test cases
   - Verify coverage

## Troubleshooting

### Common Issues

| Issue                       | Solution                                              |
| --------------------------- | ----------------------------------------------------- |
| Circular dependencies       | Restructure services to avoid circular imports        |
| Service bloat               | Split large services into smaller, focused ones       |
| Inconsistent error handling | Implement standardized error handling across services |
| Difficulty testing          | Use dependency injection to make services testable    |

### Debugging Tips

```typescript
// Add logging to service methods
const result = await db.user.findMany();
console.log('DB Service result:', result);

// Track service performance
const start = performance.now();
const result = await service.method();
const duration = performance.now() - start;
console.log(`Service call took ${duration}ms`);
```

## Service Architecture Diagram

```mermaid
graph TD
    A[UI Components] --> B[API Services]
    A --> C[Business Logic Services]
    B --> D[External APIs]
    C --> E[Database Services]
    C --> F[Auth Services]
    E --> G[Database]
    F --> H[Auth Provider]
```

## Related Tutorials

- [API Design Patterns](./api-design.md)
- [Database Access Patterns](./database-access.md)
- [Authentication and Authorization](./auth-patterns.md)

## Next Steps

1. Learn about service patterns
2. Understand dependency injection
3. Explore testing strategies
4. Study error handling patterns

## Further Reading

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)
- [Dependency Injection](https://www.martinfowler.com/articles/injection.html)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

## Keywords

Services, architecture, API, database, business logic, separation of concerns, dependency injection, Prisma, Next.js, TypeScript
