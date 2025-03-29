# TypeScript Types Tutorial

## Basic Types

```typescript
// Primitive Types
let name: string = 'John';
let age: number = 30;
let isActive: boolean = true;
let id: symbol = Symbol('id');

// Special Types
let notDefined: undefined = undefined;
let empty: null = null;
let any: any = 'anything'; // Avoid using 'any' unless absolutely necessary
let unknown: unknown = 'unknown'; // Safer alternative to 'any'

// Arrays
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ['a', 'b', 'c'];

// Tuples (fixed-length arrays)
let tuple: [string, number] = ['age', 30];
```

## Object Types

```typescript
// Interface (preferred for object types)
interface User {
  id: string;
  name: string;
  email: string;
  age?: number; // Optional property
  readonly createdAt: Date; // Read-only property
}

// Type alias (alternative to interface)
type UserType = {
  id: string;
  name: string;
  email: string;
  age?: number;
  readonly createdAt: Date;
};

// Using the types
const user: User = {
  id: '1',
  name: 'John',
  email: 'john@example.com',
  createdAt: new Date(),
};
```

## Function Types

```typescript
// Function type
type GreetFunction = (name: string) => string;

// Function with type annotations
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow function with type annotations
const greetArrow: GreetFunction = (name: string): string => {
  return `Hello, ${name}!`;
};
```

## Union and Intersection Types

```typescript
// Union type (can be either type)
type StringOrNumber = string | number;
let value: StringOrNumber = 'hello';
value = 42; // Also valid

// Intersection type (combines multiple types)
interface HasName {
  name: string;
}

interface HasAge {
  age: number;
}

type Person = HasName & HasAge;
const person: Person = {
  name: 'John',
  age: 30,
};
```

## Generic Types

```typescript
// Generic interface
interface Box<T> {
  value: T;
}

// Using generics
const stringBox: Box<string> = { value: 'hello' };
const numberBox: Box<number> = { value: 42 };

// Generic function
function identity<T>(arg: T): T {
  return arg;
}

// Using generic function
const result1 = identity<string>('hello');
const result2 = identity<number>(42);
```

## Utility Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Partial (makes all properties optional)
type PartialUser = Partial<User>;

// Pick (select specific properties)
type UserCredentials = Pick<User, 'email' | 'name'>;

// Omit (exclude specific properties)
type UserWithoutAge = Omit<User, 'age'>;

// Record (map keys to values)
type UserMap = Record<string, User>;

// Required (makes all properties required)
type RequiredUser = Required<Partial<User>>;
```

## Type Guards

```typescript
// Type guard function
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Using type guard
function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string here
    console.log(value.toUpperCase());
  }
}
```

## Best Practices

1. **Prefer Interfaces for Objects**

   ```typescript
   // Good
   interface User {
     name: string;
     age: number;
   }

   // Avoid
   type User = {
     name: string;
     age: number;
   };
   ```

2. **Use Type Aliases for Unions/Intersections**

   ```typescript
   // Good
   type Status = 'active' | 'inactive' | 'pending';

   // Avoid
   interface Status {
     value: 'active' | 'inactive' | 'pending';
   }
   ```

3. **Avoid `any` Type**

   ```typescript
   // Bad
   function process(data: any) {
     return data;
   }

   // Good
   function process<T>(data: T): T {
     return data;
   }
   ```

4. **Use Readonly When Appropriate**

   ```typescript
   interface Config {
     readonly apiKey: string;
     readonly baseUrl: string;
   }
   ```

5. **Use Optional Properties Sparingly**
   ```typescript
   // Good
   interface User {
     name: string;
     email: string;
     age?: number; // Only if truly optional
   }
   ```

## Common Patterns

1. **API Response Types**

   ```typescript
   interface ApiResponse<T> {
     data: T;
     status: number;
     message: string;
   }

   interface User {
     id: string;
     name: string;
   }

   type UserResponse = ApiResponse<User>;
   ```

2. **Error Handling**

   ```typescript
   interface ApiError {
     code: string;
     message: string;
     details?: unknown;
   }

   type Result<T> = T | ApiError;
   ```

3. **Component Props**
   ```typescript
   interface ButtonProps {
     label: string;
     onClick: () => void;
     variant?: 'primary' | 'secondary';
     disabled?: boolean;
   }
   ```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
