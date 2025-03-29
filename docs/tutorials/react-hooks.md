# React Hooks Tutorial

## Overview

Hooks are React's way of letting you use state and other React features in functional components. This tutorial explains how we use hooks in our project and how to create custom hooks.

## Built-in Hooks We Use

### 1. useState

Used for managing local state in components.

```typescript
// Example from EventRegistration.tsx
const [isLoading, setIsLoading] = useState(false);
const [guestType, setGuestType] = useState<'MEMBER' | 'VISITOR'>('VISITOR');
```

### 2. useEffect

Used for side effects like data fetching, subscriptions, or DOM updates.

```typescript
// Example from EventRegistrationPage.tsx
useEffect(() => {
  if (error) {
    toast({
      title: 'Error loading event',
      description: error.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }
}, [error, toast]);
```

### 3. useForm

From react-hook-form, used for form handling.

```typescript
// Example from EventRegistration.tsx
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<RegistrationFormData>();
```

### 4. useToast

From Chakra UI, used for showing notifications.

```typescript
const toast = useToast();
toast({
  title: 'Success',
  status: 'success',
});
```

## Custom Hooks

### 1. useOrganizationTouchpoints

```typescript
// src/hooks/useOrganizationTouchpoints.ts
import useSWR from 'swr';

export function useOrganizationTouchpoints() {
  const { data, error, isLoading } = useSWR('/api/organizations/touchpoints');
  return { touchpoints: data, isError: error, isLoading };
}
```

### 2. useAuth

```typescript
// src/hooks/useAuth.ts
import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();
  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  };
}
```

### 3. useEvent

```typescript
// src/hooks/useEvent.ts
import useSWR from 'swr';

export function useEvent(eventId: string) {
  const { data, error, isLoading } = useSWR(eventId ? `/api/events/${eventId}` : null, fetcher);
  return { event: data, isError: error, isLoading };
}
```

## Hook Rules

1. **Only Call Hooks at the Top Level**

   ```typescript
   // ✅ Good
   function MyComponent() {
     const [count, setCount] = useState(0);
     useEffect(() => {}, []);
   }

   // ❌ Bad
   function MyComponent() {
     if (someCondition) {
       const [count, setCount] = useState(0);
     }
   }
   ```

2. **Only Call Hooks from React Functions**

   ```typescript
   // ✅ Good
   function MyComponent() {
     const [count, setCount] = useState(0);
   }

   // ❌ Bad
   function regularFunction() {
     const [count, setCount] = useState(0);
   }
   ```

## Common Hook Patterns

### 1. Data Fetching

```typescript
function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { data, isLoading, error };
}
```

### 2. Form Handling

```typescript
function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (onSubmit: (values: T) => void) => {
    // Validate form
    const newErrors = validateForm(values);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    } else {
      setErrors(newErrors);
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
}
```

### 3. Local Storage

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
```

## Testing Hooks

### 1. Testing Custom Hooks

```typescript
// src/hooks/__tests__/useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should update value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'));

    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
  });
});
```

### 2. Testing Components with Hooks

```typescript
// src/components/__tests__/EventRegistration.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react';
import { EventRegistration } from '../events/EventRegistration';

describe('EventRegistration', () => {
  it('handles form submission', async () => {
    const onSubmit = jest.fn();
    const { getByLabelText, getByRole } = render(
      <EventRegistration eventId="123" onSubmit={onSubmit} />
    );

    fireEvent.change(getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.click(getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
```

## Further Reading

1. **React Hooks Documentation**

   - [Official React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)
   - [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)
   - [Custom Hooks](https://reactjs.org/docs/hooks-custom.html)

2. **Testing Hooks**

   - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
   - [Testing Custom Hooks](https://react-hooks-testing-library.com/)

3. **Best Practices**
   - [React Hooks Best Practices](https://reactjs.org/docs/hooks-faq.html)
   - [Custom Hook Patterns](https://usehooks.com/)
