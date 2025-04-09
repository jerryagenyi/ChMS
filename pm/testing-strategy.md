# Testing Strategy

## Overview

This document outlines our testing approach for the Church Management System (ChMS), following a pragmatic, priority-based methodology.

## Testing Priorities

### P0 (Must Test - 90%+ coverage)

Critical features that directly impact core business operations:

- Authentication & Authorization

  - Login/Logout flows
  - Permission checks
  - Session management

- Attendance Management

  - Check-in process
  - QR code generation/validation
  - Attendance recording
  - Basic reporting

- Data Integrity

  - Database operations for critical entities
  - Data validation
  - Error handling for data operations

- Security Features
  - Password handling
  - Data access controls
  - API security measures

### P1 (Should Test)

Important features that support core functionality:

- Main UI Components

  - Form submissions
  - Data tables
  - Navigation elements
  - Error boundaries

- Common User Interactions

  - Search functionality
  - Filtering
  - Basic CRUD operations
  - List views

- Error Handling

  - API error responses
  - Form validation
  - Offline states
  - Network failures

- API Integration Points
  - External service connections
  - Data synchronization
  - Webhook handling

### P2 (Nice to Test)

Non-critical features that enhance user experience:

- UI Polish

  - Animations
  - Theme switching
  - Layout responsiveness
  - Loading states

- Edge Cases

  - Extreme data scenarios
  - Rare user paths
  - Performance edge cases

- Helper Utilities

  - Formatting functions
  - Helper methods
  - Utility components

- Enhancement Features
  - Export functionality
  - Print layouts
  - Optional integrations

## Testing Tools

### Primary Tools

- Vitest + React Testing Library: Unit and integration testing
- Cypress: E2E testing
- MSW (Mock Service Worker): API mocking
- React Icons: Component icon testing
- Chakra UI Testing Library: UI component testing

### Performance Testing Tools

- Lighthouse: Performance metrics
- React DevTools Profiler: Component performance
- Chrome DevTools: Network and runtime performance

## Style and Icon Standards

- All components must use Chakra UI v3 for styling
- All icons must use react-icons library
- No usage of Tailwind CSS or Chakra UI icons

## Critical Paths for Testing

### 1. Attendance Flow

- QR code generation → Scanning → Check-in → Recording → Basic reporting
- Test files: `src/__tests__/integration/attendance/*`

### 2. Authentication Flow

- Login → Session management → Protected routes → Logout
- Test files: `src/__tests__/integration/auth/*`

### 3. Member Management

- Create → Update → Search → Basic operations
- Test files: `src/__tests__/integration/members/*`

## Tests to Skip/Remove

1. **Skip Complex UI Tests**

   - Detailed styling tests
   - Pixel-perfect layout tests
   - Animation testing

2. **Skip Non-Critical Paths**

   - Administrative utilities
   - Report customization
   - Optional features

3. **Skip Redundant Tests**
   - Multiple similar component variations
   - Implementation details
   - Framework internals

## Testing Roadmap

### Phase 1: Core Functionality (Week 1-2)

- [ ] Authentication flows
- [ ] Basic attendance recording
- [ ] Critical data operations

### Phase 2: Main Features (Week 3-4)

- [ ] QR code functionality
- [ ] Member management
- [ ] Basic reporting

### Phase 3: Supporting Features (Week 5-6)

- [ ] Error handling
- [ ] Offline support
- [ ] Data validation

### Phase 4: Enhancement Features (Week 7-8)

- [ ] Export functionality
- [ ] Advanced reporting
- [ ] Performance optimization

## Test Implementation Guidelines

1. **Focus on Business Value**

   ```typescript
   // Good: Testing business logic
   test('should mark member as checked-in when QR code is valid', async () => {
     const result = await checkInMember(validQRCode);
     expect(result.status).toBe('CHECKED_IN');
   });

   // Skip: Implementation details
   test('should call QR validation utility', async () => {
     const spy = jest.spyOn(qrUtils, 'validate');
     await checkInMember(validQRCode);
     expect(spy).toHaveBeenCalled();
   });
   ```

2. **Prioritize Integration Tests**

   ```typescript
   // Good: Testing full flow
   test('complete check-in flow', async () => {
     const qrCode = await generateQRCode(memberData);
     const checkIn = await validateAndCheckIn(qrCode);
     const record = await getAttendanceRecord(checkIn.id);
     expect(record.status).toBe('PRESENT');
   });
   ```

3. **Minimal E2E Tests**
   ```typescript
   // Good: Critical user journey
   test('user can check in using QR code', async () => {
     await scanQRCode();
     await verifyMemberDetails();
     await confirmCheckIn();
     await verifyAttendanceRecord();
   });
   ```

## Maintenance Strategy

1. **Regular Review**

   - Review test coverage monthly
   - Remove obsolete tests
   - Update test priorities

2. **Performance Monitoring**

   - Keep test suite runtime under 5 minutes
   - Monitor test reliability
   - Track flaky tests

3. **Documentation**
   - Keep test documentation updated
   - Document test decisions
   - Maintain testing patterns

## Service Testing Guidelines

### 1. Mock External Dependencies

```typescript
// Example: Mocking Prisma
type MockPrismaClient = {
  entity: {
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };
};

vi.mock('@/lib/prisma', () => ({
  prisma: {
    entity: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
  } as MockPrismaClient,
}));

// Example: Mocking Image Processing
vi.mock('sharp', () => ({
  default: vi.fn(() => ({
    resize: vi.fn().mockReturnThis(),
    toFormat: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from('mock-data')),
  })),
}));
```

### 2. Test Structure Pattern

```typescript
describe('ServiceName', () => {
  let service: ServiceType;

  beforeEach(() => {
    service = new ServiceType();
    vi.clearAllMocks();
  });

  describe('methodName', () => {
    test('should handle successful operation', async () => {
      // Arrange: Set up mocks and test data
      const mockData = {
        /* ... */
      };
      (dependency.method as any).mockResolvedValue(mockData);

      // Act: Call the service method
      const result = await service.method(params);

      // Assert: Verify the results
      expect(dependency.method).toHaveBeenCalledWith(expectedParams);
      expect(result).toEqual(expectedResult);
    });

    test('should handle errors appropriately', async () => {
      // Arrange: Set up error scenario
      const error = new Error('Operation failed');
      (dependency.method as any).mockRejectedValue(error);

      // Act & Assert: Verify error handling
      await expect(service.method(params)).rejects.toThrow('User-friendly error message');
    });
  });
});
```

### 3. Error Handling Coverage

- Test both successful and error scenarios for each method
- Verify error messages are user-friendly
- Test different types of errors (validation, network, etc.)
- Ensure proper error propagation

### 4. Data Integrity

- Test CRUD operations thoroughly
- Verify data transformations
- Test edge cases with different data types
- Validate input/output formats

### 5. Performance Considerations

- Test with realistic data sizes
- Verify memory usage for large operations
- Test batch operations efficiently
- Monitor test execution time

### 6. Security Testing

- Test authorization checks
- Verify data access controls
- Test input validation
- Check for proper error masking
