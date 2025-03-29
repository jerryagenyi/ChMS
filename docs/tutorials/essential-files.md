# Essential Files Tutorial

## Overview

This tutorial explains the core files that form the foundation of our ChMS application. These files handle state management, styling, API communication, and common utilities.

## 1. State Management (`src/store/index.ts`)

We use Zustand for state management - it's a lightweight, simple state management solution.

```typescript
// Example usage:
const isOffline = useAppStore(state => state.isOffline);
const setIsOffline = useAppStore(state => state.setIsOffline);
```

### Key Concepts:

- **Store**: A central place to manage application state
- **Actions**: Functions that modify state
- **Selectors**: Functions that select specific pieces of state
- **Persistence**: State that survives page refreshes

## 2. Theme Configuration (`src/theme/index.ts`)

Our theme file configures Chakra UI's appearance.

```typescript
// Example usage:
<Button colorScheme="brand">Click me</Button>
<Text color="brand.500">Coloured text</Text>
```

### Key Concepts:

- **Color Scheme**: Predefined color palette
- **Typography**: Font settings
- **Component Variants**: Predefined component styles
- **Dark Mode**: Color mode configuration

## 3. API Client (`src/services/api.ts`)

A centralized way to handle API requests.

```typescript
// Example usage:
const data = await get<Member>('/members/123');
const newMember = await post<Member>('/members', memberData);
```

### Key Concepts:

- **HTTP Methods**: GET, POST, PUT, DELETE
- **Error Handling**: Consistent error management
- **Type Safety**: Generic types for responses
- **Base URL**: Centralized API endpoint

## 4. Constants (`src/config/constants.ts`)

Application-wide constants and configuration.

```typescript
// Example usage:
import { ROUTES, ERROR_MESSAGES } from '@/config/constants';

router.push(ROUTES.DASHBOARD);
toast.error(ERROR_MESSAGES.NETWORK_ERROR);
```

### Key Concepts:

- **Routes**: Application navigation paths
- **Messages**: User-facing messages
- **Storage Keys**: Local storage identifiers
- **Environment Variables**: Configuration values

## 5. Utilities (`src/utils/index.ts`)

Common helper functions used throughout the app.

```typescript
// Example usage:
const formattedDate = formatDate(new Date());
const debouncedSearch = debounce(handleSearch, 300);
```

### Key Concepts:

- **Date Formatting**: Consistent date display
- **Debouncing**: Performance optimization
- **Network Status**: Online/offline detection
- **Type Safety**: TypeScript utilities

## Best Practices

1. **State Management**

   - Keep stores small and focused
   - Use selectors for performance
   - Implement persistence where needed
   - Handle offline state

2. **Theme**

   - Use semantic color names
   - Maintain consistent spacing
   - Support dark mode
   - Document custom variants

3. **API Client**

   - Handle errors consistently
   - Use TypeScript for type safety
   - Implement retry logic
   - Cache responses when appropriate

4. **Constants**

   - Use TypeScript's `as const`
   - Group related constants
   - Document usage
   - Keep environment variables secure

5. **Utilities**
   - Keep functions pure
   - Add TypeScript types
   - Write unit tests
   - Document edge cases

## Common Patterns

1. **State Updates**

```typescript
// Good
setIsOffline(true);

// Bad
set({ isOffline: true });
```

2. **API Calls**

```typescript
// Good
try {
  const data = await get<Member>('/members/123');
} catch (error) {
  if (error instanceof ApiError) {
    // Handle API error
  }
}

// Bad
fetch('/api/members/123').then(res => res.json());
```

3. **Theme Usage**

```typescript
// Good
<Box bg="brand.50" p={4}>

// Bad
<Box style={{ backgroundColor: '#f0f9ff', padding: '16px' }}>
```

## Next Steps

1. Learn about custom hooks
2. Understand error boundaries
3. Explore performance optimization
4. Study testing strategies

## Further Reading

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Chakra UI Theme](https://chakra-ui.com/docs/theming/theme)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/generics.html)
- [React Best Practices](https://reactjs.org/docs/best-practices.html)
