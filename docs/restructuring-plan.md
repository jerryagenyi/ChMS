# Codebase Restructuring Plan

## Overview

This plan outlines the steps needed to align our codebase with the technical specifications and best practices.

## Phase 1: Directory Structure Cleanup

### 1.1 Database Schema Restructuring [IN PROGRESS]

- [x] Replace Department/Team models with new MinistryUnit structure

  - [x] Add MinistryUnitType enum
  - [x] Add MinistryCategory enum
  - [x] Add LeadershipRole enum
  - [x] Add MemberRole enum
  - [x] Add MembershipStatus enum
  - [x] Create MinistryUnit model
  - [x] Create MinistryUnitLeader model
  - [x] Create MinistryUnitMember model
  - [x] Update Organization model relations
  - [x] Update Member model relations

- [ ] Create new schema-related files:
  - [ ] `src/lib/validation/schemas/ministryUnit.schema.ts`
  - [ ] `src/lib/validation/schemas/ministryMember.schema.ts`
  - [ ] `src/services/ministry/ministryUnit.service.ts`
  - [ ] `src/services/ministry/ministryMember.service.ts`

### 1.2 Consolidate Test Directories

- [ ] Create new `src/__tests__` directory
- [ ] Move tests from `src/test` to `src/__tests__`
- [ ] Move tests from `src/tests` to `src/__tests__`
- [ ] Delete old test directories
- [ ] Update import paths in all test files
- [ ] Verify test configuration in `vitest.config.ts`

### 1.3 Create Missing Core Directories

- [ ] Create `src/services/` for external integrations
  - [ ] Add `ministry/` subdirectory for new ministry unit services
- [ ] Create `src/store/` for state management
- [ ] Create `src/utils/` for utility functions
- [ ] Create `src/config/` for configurations
- [ ] Create `src/theme/` for Chakra UI theme

### 1.4 Reorganize Existing Directories

- [ ] Move utility functions from `lib` to `utils`
- [ ] Move API-related code to `services/api`
- [ ] Move database-related code to `services/db`
- [ ] Move authentication code to `services/auth`

## Phase 2: Component Structure Standardization

### 2.1 Create Ministry Management Components [NEW]

- [ ] Create base component structure:
  ```
  src/components/Ministry/
  ├── UnitList/
  │   ├── index.ts
  │   ├── UnitList.tsx
  │   ├── UnitList.test.tsx
  │   └── types.ts
  ├── UnitForm/
  │   ├── index.ts
  │   ├── UnitForm.tsx
  │   ├── UnitForm.test.tsx
  │   └── types.ts
  └── MemberAssignment/
      ├── index.ts
      ├── MemberAssignment.tsx
      ├── MemberAssignment.test.tsx
      └── types.ts
  ```

### 2.2 Update Existing Components

- [x] QRCodeGenerator
- [x] QRDisplay
- [x] QRScanner
- [x] CheckInButton
- [x] CheckInForm
- [x] AttendanceList
- [x] AttendanceStats
- [x] AttendanceChart
  - [x] Added multiple chart types (line, bar, area, composed)
  - [x] Added interactive features (zoom, pan, brush)
  - [x] Added animated tooltips
  - [x] Added chart legend
  - [x] Added responsive design
  - [x] Added error handling
  - [x] Added loading states
  - [x] Added refresh functionality
- [x] AttendanceReport
- [x] ServiceSelector
- [x] PageLayout
- [ ] Layout Components
  - [x] PageTransition
    - [x] Add page transition animations
    - [x] Add loading states
    - [x] Add error boundaries
  - [x] PageLayout
    - [x] Add responsive container
    - [x] Add header and footer slots
    - [x] Add sidebar support
  - [x] ContentLayout
    - [x] Add content width constraints
    - [x] Add padding and spacing
    - [x] Add breadcrumb support
  - [x] SectionLayout
    - [x] Add section spacing
    - [x] Add background variants
    - [x] Add border options

### 2.3 Create Missing Core Components

- [x] ErrorBoundary
  - [x] Create component
  - [x] Add tests
  - [x] Add documentation
- [x] LoadingState
  - [x] Create component
  - [x] Add tests
  - [x] Add documentation
- [x] OfflineFallback
  - [x] Create component
  - [x] Add tests
  - [x] Add documentation

## Phase 3: API Routes Organization

### 3.1 Restructure API Routes

- [x] Create attendance routes:
  ```
  src/app/api/attendance/
  ├── check-in/
  │   └── route.ts
  ├── reports/
  │   └── route.ts
  └── stats/
      └── route.ts
  ```
- [x] Create member routes:
  ```
  src/app/api/members/
  ├── register/
  │   └── route.ts
  └── [id]/
      └── route.ts
  ```
- [x] Create service routes:
  ```
  src/app/api/services/
  ├── route.ts
  └── [id]/
      └── route.ts
  ```

### 3.2 Add API Documentation

- [x] Create API documentation for each route
- [x] Add request/response type definitions
- [x] Add error handling documentation
- [x] Add authentication requirements

### 3.3 Service Routes

- [x] Create base service route
  - [x] Add GET handler for fetching services
  - [x] Add POST handler for creating services
  - [x] Add validation with Zod
  - [x] Add error handling
  - [x] Add overlap checking
  - [x] Add recurrence pattern support
- [x] Create service detail route
  - [x] Add GET handler for fetching service details
  - [x] Add PUT handler for updating service details
  - [x] Add DELETE handler for deleting services
  - [x] Add validation with Zod
  - [x] Add error handling
  - [x] Add overlap checking
  - [x] Add recurrence pattern support

### 3.1 Attendance Routes

- [x] Create base attendance route
  - [x] Add GET handler for fetching attendance
  - [x] Add POST handler for creating attendance
  - [x] Add validation with Zod
  - [x] Add error handling
- [x] Create bulk attendance route
  - [x] Add POST handler for bulk creation
  - [x] Add transaction support
  - [x] Add validation with Zod
  - [x] Add error handling
- [x] Create attendance report route
  - [x] Add POST handler for generating reports
  - [x] Add date range filtering
  - [x] Add grouping options
  - [x] Add validation with Zod
  - [x] Add error handling

### 3.2 Member Routes

- [x] Create base member route
  - [x] Add GET handler for fetching members
  - [x] Add POST handler for creating members
  - [x] Add validation with Zod
  - [x] Add error handling
- [x] Create member registration route
  - [x] Add POST handler for registering members
  - [x] Add validation with Zod
  - [x] Add error handling
- [x] Create member detail route
  - [x] Add GET handler for fetching member details
  - [x] Add PUT handler for updating member details
  - [x] Add DELETE handler for deleting members
  - [x] Add validation with Zod
  - [x] Add error handling

### 3.4 Data Sharing API Routes [NEW]

- [ ] Create data sharing routes:

  ```
  src/app/api/share/
  ├── export/
  │   ├── attendance/
  │   │   └── route.ts
  │   ├── services/
  │   │   └── route.ts
  │   └── members/
  │       └── route.ts
  ├── import/
  │   ├── attendance/
  │   │   └── route.ts
  │   ├── services/
  │   │   └── route.ts
  │   └── members/
  │       └── route.ts
  └── integrations/
      ├── webhooks/
      │   └── route.ts
      └── api-keys/
          └── route.ts
  ```

- [ ] Implement data sharing features:
  - [ ] Add API key generation and management
  - [ ] Add rate limiting and quota system
  - [ ] Add data format validation
  - [ ] Add data transformation utilities
  - [ ] Add webhook support
  - [ ] Add integration logging
  - [ ] Add security headers and CORS

## Phase 4: State Management Setup

### 4.1 Configure State Management

- [x] Set up Zustand store structure
  - [x] Create main store configuration
  - [x] Add persistence layer
  - [x] Add offline support
- [x] Create attendance store
  - [x] Add attendance records management
  - [x] Add statistics tracking
  - [x] Add filtering capabilities
- [x] Create member store
  - [x] Add member records management
  - [x] Add search functionality
  - [x] Add filtering capabilities
- [x] Create service store
  - [x] Add service records management
  - [x] Add recurrence pattern support
  - [x] Add filtering capabilities

### 4.2 Add Store Documentation

- [x] Document store structure
  - [x] Add store overview
  - [x] Add state shape documentation
  - [x] Add action documentation
- [x] Add usage examples
  - [x] Add basic usage examples
  - [x] Add advanced usage examples
  - [x] Add error handling examples
- [x] Add type definitions
  - [x] Add store types
  - [x] Add action types
  - [x] Add selector types
- [x] Add testing guidelines
  - [x] Add unit testing guidelines
  - [x] Add integration testing guidelines
  - [x] Add mock data examples

## Phase 5: Styling and Theme

### 5.1 Set Up Theme Configuration

- [x] Set up Chakra UI theme configuration
  - [x] Define color palette
  - [x] Configure typography
  - [x] Set up spacing and sizing
  - [x] Define component variants
- [x] Create theme provider
  - [x] Implement ChakraProvider wrapper
  - [x] Add theme configuration
- [x] Implement layout components
  - [x] Create responsive header
  - [x] Create navigation sidebar
  - [x] Implement main layout wrapper
- [x] Add global styles
  - [x] Configure font loading
  - [x] Set up dark mode support
  - [x] Define responsive breakpoints

### 5.2 Add Component Styling

- [x] Create base components
  - [x] Add Button variants
  - [x] Add Card styles
  - [x] Add Form components
  - [x] Add Table styles
- [x] Add responsive design
  - [x] Add mobile-first layouts
  - [x] Add breakpoint utilities
  - [x] Add container queries
- [x] Add animations
  - [x] Add page transitions
  - [x] Add hover effects
  - [x] Add loading states
- [x] Add accessibility features
  - [x] Add focus styles
  - [x] Add keyboard navigation
  - [x] Add ARIA attributes

## Phase 6: Testing Infrastructure

### 6.1 Set Up Test Utilities

- [ ] Create test helpers
  - [ ] Add render utilities
  - [ ] Add mock providers
  - [ ] Add test hooks
- [ ] Add mock data
  - [ ] Add attendance mocks
  - [ ] Add member mocks
  - [ ] Add service mocks
- [ ] Add test fixtures
  - [ ] Add common test data
  - [ ] Add test scenarios
  - [ ] Add edge cases
- [ ] Add custom matchers
  - [ ] Add component matchers
  - [ ] Add state matchers
  - [ ] Add API matchers
- [ ] Add test hooks
  - [ ] Add router hooks
  - [ ] Add store hooks
  - [ ] Add API hooks

### 6.2 Add Test Documentation

- [ ] Document testing patterns
  - [ ] Add component testing guide
  - [ ] Add store testing guide
  - [ ] Add API testing guide
- [ ] Add example tests
  - [ ] Add component examples
  - [ ] Add store examples
  - [ ] Add API examples
- [ ] Add coverage requirements
  - [ ] Set coverage thresholds
  - [ ] Add coverage reporting
  - [ ] Add coverage badges
- [ ] Add CI/CD integration
  - [ ] Add test workflow
  - [ ] Add coverage workflow
  - [ ] Add reporting workflow

## Phase 7: Documentation

### 7.1 Update Technical Documentation

- [ ] Update technical specifications
- [ ] Add architecture diagrams
- [ ] Add component documentation
- [ ] Add API documentation
- [ ] Add testing documentation

### 7.2 Add Development Guides

- [ ] Add setup guide
- [ ] Add contribution guide
- [ ] Add code style guide
- [ ] Add testing guide
- [ ] Add deployment guide

## Phase 8: Quality Assurance

### 8.1 Add Code Quality Tools

- [ ] Configure ESLint
- [ ] Configure Prettier
- [ ] Add TypeScript strict mode
- [ ] Add pre-commit hooks
- [ ] Add CI/CD checks

### 8.2 Performance Optimization

- [ ] Add performance monitoring
- [ ] Optimize bundle size
- [ ] Add code splitting
- [ ] Add lazy loading
- [ ] Add caching strategy

## Implementation Order

1. Complete Phase 1.1 (Database Schema Restructuring) [CURRENT]
2. Implement Phase 1.2-1.4 (Directory Structure)
3. Move to Phase 2 (Component Structure)
4. Continue with remaining phases...

## Success Criteria

1. New MinistryUnit structure implemented and tested
2. All directories follow the new structure
3. All components follow the standard pattern
4. All API routes are properly organized
5. State management is properly configured
6. Theme and styling are consistent
7. Test coverage meets requirements
8. Documentation is complete and up-to-date
9. Code quality checks pass

## Notes

- Schema changes are being made early in development, minimizing impact
- No data migration needed as database is new
- Components and services will be built around new schema
- Regular commits should be made with clear messages
- Each major change should be reviewed before merging

Would you like to proceed with any specific phase or task?
