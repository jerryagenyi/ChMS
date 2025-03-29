# Personal Learning Journey

## Project Structure Understanding

### Core Folders and Their Purposes

- [ ] `/src/components`

  - Purpose: Reusable UI components
  - Example: `QRCodeScanner`, `FamilyCheckInForm`
  - Learning Goal: Understand component composition and reusability

- [ ] `/src/pages`

  - Purpose: Next.js pages and API routes
  - Example: `/pages/api/events/[eventId]/register.ts`
  - Learning Goal: Grasp Next.js routing and API structure

- [ ] `/src/hooks`

  - Purpose: Custom React hooks for shared logic
  - Example: `useOrganizationTouchpoints`
  - Learning Goal: Learn about custom hooks and state management

- [ ] `/src/services`

  - Purpose: External service integrations
  - Example: Authentication, database services
  - Learning Goal: Understand service layer architecture

- [ ] `/src/store`

  - Purpose: State management
  - Example: Global state for user preferences
  - Learning Goal: Learn about state management patterns

- [ ] `/src/styles`

  - Purpose: Global styles and theme
  - Example: Chakra UI theme configuration
  - Learning Goal: Understand styling approaches

- [ ] `/src/types`

  - Purpose: TypeScript type definitions
  - Example: `CheckInData` interface
  - Learning Goal: Master TypeScript types

- [ ] `/src/utils`
  - Purpose: Utility functions
  - Example: Date formatting, validation
  - Learning Goal: Learn about code organization

## React Concepts with Real Examples

### Props Understanding

- [ ] Basic Props

  ```tsx
  // Example from QRCodeScanner
  interface QRCodeScannerProps {
    onScan: (data: string) => void;
    onError?: (error: Error) => void;
    retryCount?: number;
  }
  ```

- [ ] Props with Children

  ```tsx
  // Example from FamilyCheckInForm
  interface FamilyCheckInFormProps {
    familyId: string;
    onCheckIn: (data: CheckInData) => void;
    children?: React.ReactNode;
  }
  ```

- [ ] Props with Callbacks
  ```tsx
  // Example from EventRegistration
  interface EventRegistrationProps {
    eventId: string;
    onSuccess: () => void;
    onError: (error: Error) => void;
  }
  ```

### Routes Understanding

- [ ] Page Routes

  ```typescript
  // Example: /pages/events/[eventId].tsx
  export default function EventPage() {
    const { eventId } = useRouter().query;
    // Page content
  }
  ```

- [ ] API Routes

  ```typescript
  // Example: /pages/api/events/[eventId]/register.ts
  export default async function handler(req, res) {
    const { eventId } = req.query;
    // API logic
  }
  ```

- [ ] Dynamic Routes
  ```typescript
  // Example: /pages/members/[memberId]/attendance.tsx
  export default function MemberAttendance() {
    const { memberId } = useRouter().query;
    // Dynamic content
  }
  ```

### API Understanding

- [ ] RESTful Endpoints

  ```typescript
  // Example: Event Registration API
  POST / api / events / [eventId] / register;
  GET / api / events / [eventId];
  PUT / api / events / [eventId];
  DELETE / api / events / [eventId];
  ```

- [ ] API Response Types

  ```typescript
  // Example: Event Registration Response
  interface EventRegistrationResponse {
    success: boolean;
    data?: {
      registrationId: string;
      timestamp: Date;
    };
    error?: string;
  }
  ```

- [ ] Error Handling
  ```typescript
  // Example: API Error Handling
  try {
    const response = await fetch('/api/events/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Registration failed');
  } catch (error) {
    // Handle error
  }
  ```

## Learning Resources

### Documentation

- [ ] Next.js Documentation
- [ ] React Documentation
- [ ] TypeScript Documentation
- [ ] Chakra UI Documentation

### Practice Exercises

- [ ] Create a new component
- [ ] Add a new API route
- [ ] Implement form validation
- [ ] Add error handling
- [ ] Write unit tests

### Code Review Checklist

- [ ] TypeScript types
- [ ] Error handling
- [ ] Performance
- [ ] Accessibility
- [ ] Testing coverage

## Progress Tracking

### Weekly Goals

- [ ] Week 1: Project Structure
- [ ] Week 2: React Components
- [ ] Week 3: API Routes
- [ ] Week 4: State Management
- [ ] Week 5: Testing

### Monthly Reviews

- [ ] Month 1: Basic Concepts
- [ ] Month 2: Advanced Patterns
- [ ] Month 3: Best Practices
- [ ] Month 4: Performance Optimization
