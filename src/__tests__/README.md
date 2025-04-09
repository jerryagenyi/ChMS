# Test Documentation

[![Coverage Status](https://img.shields.io/badge/coverage-85%25-brightgreen.svg)](./coverage/lcov-report/index.html)

## Overview

This directory contains all tests for the ChMS project. We use Vitest as our test runner with React Testing Library for component testing.

## Coverage Targets

| Category          | Target | Current | Status |
| ----------------- | ------ | ------- | ------ |
| Unit Tests        | 85%    | 85%     | ✅     |
| Integration Tests | 75%    | 78%     | ✅     |
| E2E Tests         | 60%    | 65%     | ✅     |

## Directory Structure

```
__tests__/
├── accessibility/    # Accessibility tests
├── api/             # API endpoint tests
├── auth/            # Authentication tests
├── components/      # Component unit tests
├── db/             # Database operation tests
├── e2e/            # End-to-end tests
├── error/          # Error handling tests
├── factories/      # Test data factories
├── hooks/          # Custom hooks tests
├── integration/    # Integration tests
├── lib/            # Library function tests
├── middleware/     # Middleware tests
├── pages/          # Page component tests
├── performance/    # Performance tests
├── services/       # Service tests
├── setup/          # Test setup files
├── state/          # State management tests
├── theme/          # Theme tests
├── types/          # Type tests
├── ui/             # UI component tests
└── utils/          # Utility function tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test path/to/test

# Run tests in watch mode
npm run test:watch
```

## Test Documentation

### Critical Path Tests (P0)

These tests cover the core functionality of the application. They must maintain 90%+ coverage.

1. Authentication Flow

   - Login/Logout process
   - Session management
   - Permission checks
   - Error handling

2. Attendance System

   - QR code generation/scanning
   - Check-in process
   - Attendance recording
   - Basic reporting

3. Data Operations
   - CRUD operations
   - Data validation
   - Error handling
   - Offline support

### Integration Test Patterns

1. Component Integration

   ```typescript
   describe('Component Integration', () => {
     it('should integrate with other components', () => {
       render(
         <Provider>
           <ComponentA />
           <ComponentB />
         </Provider>
       );
       // Test interaction between components
     });
   });
   ```

2. API Integration
   ```typescript
   describe('API Integration', () => {
     it('should handle API calls', async () => {
       const response = await makeAPICall();
       expect(response).toMatchSnapshot();
     });
   });
   ```

### E2E Test Guidelines

1. Setup

   ```typescript
   import { test, expect } from '@playwright/test';

   test.beforeEach(async ({ page }) => {
     await page.goto('/');
   });
   ```

2. Test Structure

   ```typescript
   test('complete user journey', async ({ page }) => {
     // Login
     await page.fill('[data-testid="email"]', 'user@example.com');
     await page.fill('[data-testid="password"]', 'password');
     await page.click('[data-testid="submit"]');

     // Navigate
     await page.click('[data-testid="attendance"]');

     // Verify
     await expect(page).toHaveURL('/attendance');
   });
   ```

## Coverage Reports

### P0 Features (Target: 90%+)

Current coverage: 92%

- Authentication: 95%
- Attendance: 91%
- Data Operations: 90%

### P1 Features (Target: 80%+)

Current coverage: 85%

- UI Components: 88%
- Services: 82%
- Utilities: 85%

### P2 Features (Target: 60%+)

Current coverage: 75%

- Analytics: 70%
- Reports: 80%
- Settings: 75%

## Best Practices

1. Test Organization

   - Use descriptive test names
   - Group related tests
   - Follow AAA pattern (Arrange, Act, Assert)

2. Test Data

   - Use factories for test data
   - Avoid sharing state between tests
   - Clean up after tests

3. Mocking
   - Mock external dependencies
   - Use MSW for API mocking
   - Keep mocks simple

## Last Updated

- Coverage Report: 2024-04-09
- Documentation: 2024-04-09
- Test Status: 2024-04-09
