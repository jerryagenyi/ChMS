# Testing Standards

## Overview

This document defines our testing standards and best practices, with specific considerations for our tech stack including Chakra UI v3.

> **Related Documents:**
>
> - [Testing Strategy](../../pm/testing-strategy.md) - Overall testing approach and priorities
> - [Test Checklist](../../pm/test-checklist.md) - Checklist for test coverage
> - [Testing Strategy Tutorial](../tutorials/testing-strategy.md) - Tutorial on implementing tests

## Coverage Requirements

### Overall Requirements

- P0 Features: 90%+
- P1 Features: 80%+
- P2 Features: 60%+

### Specific Test Types

- Unit Tests: 85%
- Integration Tests: 75%
- E2E Tests: 60%

### Component-Specific Requirements

- Critical Paths: 100%
- Components: 85%+
- Utilities: 90%+
- API Services: 85%+

## Definition of Done (DoD) Guidelines

### All Tests Must

- Pass consistently without flakiness
- Include proper documentation with clear descriptions
- Follow naming convention: `*.test.ts` or `*.spec.ts`
- Avoid unnecessary dependencies
- Handle cleanup properly
- Use appropriate testing tools:
  - Vitest and React Testing Library for unit/integration tests
  - Cypress for E2E testing
  - MSW for API mocking

### Styling and Icon Standards

- All components must use Chakra UI v3 for styling
  - No Tailwind CSS classes or configurations
  - No inline styles unless absolutely necessary
- All icons must use react-icons library
  - No Chakra UI icons
  - Consistent icon naming conventions

## Component Testing Standards

### UI Component Tests

- Use React Testing Library with Chakra UI v3 providers
- Test component rendering, interactions, and accessibility
- Include dark mode testing where relevant

```typescript
// Example of proper Chakra UI v3 component test setup
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('Button Component', () => {
  it('renders with correct Chakra UI styles', () => {
    renderWithChakra(<Button colorScheme="brand">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
```

### Theme Testing

- Test theme token applications
- Verify responsive design breakpoints
- Validate color scheme transitions
- Test accessibility contrast ratios

## Test Categories

### 1. Unit Tests

- Individual component logic
- Utility functions
- Custom hooks
- State management
- Data transformations

### 2. Integration Tests

- Component interactions
- API integration
- State management flow
- Theme inheritance
- Layout composition

### 3. E2E Tests

- Critical user flows
- Form submissions
- Navigation paths
- Authentication flows
- Offline functionality

## Testing Tools

### Frontend Testing Stack

- Vitest for unit/integration tests
- React Testing Library
- MSW for API mocking
- Playwright for E2E
- Lighthouse for performance
- Axe for accessibility

### Required Test Utilities

```typescript
// src/test-utils/index.ts
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/theme';

export const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper });
};
```

## Code Quality Requirements

### Testing Standards

- TypeScript strict mode enabled
- ESLint testing plugins configured
- Proper type assertions
- Meaningful test descriptions
- Isolated test cases
- Proper cleanup

### Coverage Requirements

- Overall coverage: 80%+
- Critical paths: 100%
- Components: 85%+
- Utilities: 90%+
- API services: 85%+

## Performance Testing

### Load Time Metrics

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Total Blocking Time: < 300ms

### Runtime Performance

- Frame rate: 60fps
- Input latency: < 100ms
- Memory leaks: None
- Bundle size limits enforced

## Accessibility Testing

### Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast validation
- Focus management

### Tools

- Axe-core for automated checks
- Manual screen reader testing
- Keyboard navigation testing
- Color contrast analyzers

## Test Infrastructure Requirements

### Basic Setup

- Test configuration
- Mock system
- Test helpers
- Test data factories
- Custom matchers
- Coverage reporting

### CI/CD Requirements

- CI/CD integration
- Automated test runs
- Performance monitoring
- Security scanning
- Accessibility checking

## Test Documentation Requirements

### Test Cases

- Document test purpose
- Document test steps
- Document expected results
- Document test data
- Document assumptions
- Document dependencies
- Document cleanup

### Test Reports

- Coverage reports
- Performance metrics
- Security findings
- Accessibility results
- Test execution logs
- Error reports
- Improvement suggestions

## Resources

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/guides/overview/why-cypress)
- [MSW Documentation](https://mswjs.io/docs/)
- [Testing Best Practices](https://testing-library.com/docs/guiding-principles)
- [Performance Testing Guide](https://web.dev/performance-testing/)

## Service Testing Standards

### Service Test Structure

1. **File Organization**

```typescript
// src/__tests__/services/[service-name]/[service-name].test.ts

import { vi } from 'vitest';
import { ServiceName } from '@/services/[service-name]';
// Import dependencies and types

describe('ServiceName', () => {
  let service: ServiceName;

  beforeEach(() => {
    service = new ServiceName();
    vi.clearAllMocks();
  });

  // Group tests by method
  describe('methodName', () => {
    // Individual test cases
  });
});
```

2. **Mock Patterns**

```typescript
// External Service Mocks
type MockExternalClient = {
  method: ReturnType<typeof vi.fn>;
};

vi.mock('external-package', () => ({
  ExternalClient: vi.fn(() => ({
    method: vi.fn(),
  })),
}));

// Database Mocks
type MockPrismaClient = {
  model: {
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };
};

vi.mock('@/lib/prisma', () => ({
  prisma: {
    model: {
      create: vi.fn(),
      // ... other methods
    },
  } as MockPrismaClient,
}));
```

3. **Test Case Structure**

```typescript
test('should describe expected behavior', async () => {
  // Arrange: Set up test data and mocks
  const mockData = {
    /* ... */
  };
  (dependency.method as any).mockResolvedValue(mockData);

  // Act: Execute the service method
  const result = await service.method(params);

  // Assert: Verify the results
  expect(dependency.method).toHaveBeenCalledWith(expectedParams);
  expect(result).toEqual(expectedResult);
});
```

### Coverage Requirements

1. **Method Coverage**

   - Happy path (successful execution)
   - Error scenarios
   - Edge cases
   - Input validation
   - Authorization checks

2. **Error Handling**

   - External service errors
   - Database errors
   - Validation errors
   - Network errors
   - Authorization errors

3. **Data Operations**
   - Create operations
   - Read operations
   - Update operations
   - Delete operations
   - Batch operations
   - Data transformations

### Best Practices

1. **Mock Management**

   - Clear mocks in beforeEach
   - Type mock implementations
   - Use consistent mock patterns
   - Mock at module level

2. **Test Isolation**

   - Independent test cases
   - No shared state
   - Reset mocks between tests
   - Clear test data

3. **Error Testing**

   - Test specific error messages
   - Verify error types
   - Check error propagation
   - Test recovery scenarios

4. **Performance**
   - Fast test execution
   - Efficient mock setup
   - Minimal test duplication
   - Clear test descriptions
