# Component Guide

## Overview

This guide provides an overview of all components in the ChMS system, their usage, and best practices.

## Core Components

### ErrorBoundary

- **Purpose**: Global error handling for React components
- **Usage**: Wrap top-level components or critical sections
- **Features**:
  - Graceful error handling
  - Fallback UI
  - Error reporting
- **Example**:
  ```tsx
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
  ```

### LoadingState

- **Purpose**: Consistent loading indicators
- **Usage**: Show during async operations
- **Features**:
  - Multiple sizes
  - Custom messages
  - Accessibility support
- **Example**:
  ```tsx
  <LoadingState size="md" message="Loading data..." />
  ```

### OfflineFallback

- **Purpose**: Handle offline scenarios
- **Usage**: Wrap components requiring network
- **Features**:
  - Offline detection
  - Retry mechanism
  - Custom fallback UI
- **Example**:
  ```tsx
  <OfflineFallback>
    <DataComponent />
  </OfflineFallback>
  ```

## Feature Components

### Authentication

- **Location**: `src/components/auth/`
- **Components**:
  - Login/Logout
  - Session management
  - OAuth integration

### Organization

- **Location**: `src/components/organization/`
- **Components**:
  - Organization management
  - Member management
  - Service management

### Attendance

- **Location**: `src/components/attendance/`
- **Components**:
  - Attendance tracking
  - QR code scanning
  - Reports

### Events

- **Location**: `src/components/events/`
- **Components**:
  - Event creation
  - Event management
  - Event registration

### Analytics

- **Location**: `src/components/analytics/`
- **Components**:
  - Data visualization
  - Reports
  - Dashboards

### Settings

- **Location**: `src/components/settings/`
- **Components**:
  - System configuration
  - User preferences
  - Organization settings

### Users

- **Location**: `src/components/users/`
- **Components**:
  - User management
  - Role management
  - Permissions

## Utility Components

### QRScanner

- **Purpose**: QR code scanning
- **Usage**: Attendance tracking
- **Features**:
  - Camera integration
  - Error handling
  - Success feedback

### withPermission

- **Purpose**: Permission-based component rendering
- **Usage**: Protect routes/features
- **Features**:
  - Role-based access
  - Fallback UI
  - Permission checking

## Component Patterns

### Common Props

- `className`: Custom styling
- `testId`: Testing identifiers
- `aria-*`: Accessibility attributes

### State Management

- Use React hooks for local state
- Context for shared state
- Redux for global state

### Error Handling

- Use ErrorBoundary for critical sections
- Implement fallback UIs
- Provide user feedback

### Loading States

- Show loading indicators
- Implement skeleton screens
- Handle error states

### Accessibility

- Use semantic HTML
- Implement ARIA attributes
- Ensure keyboard navigation
- Test with screen readers

## Best Practices

### Component Structure

1. Separate concerns
2. Keep components small
3. Use composition
4. Implement proper types
5. Add documentation

### Performance

1. Optimize re-renders
2. Use proper hooks
3. Implement memoization
4. Lazy load when needed
5. Monitor bundle size

### Testing

1. Write unit tests
2. Test edge cases
3. Test accessibility
4. Test performance
5. Test error states

## Resources

- [React Documentation](https://react.dev/)
- [Chakra UI Components](https://chakra-ui.com/docs/components)
- [Testing Library](https://testing-library.com/docs/)
- [Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
