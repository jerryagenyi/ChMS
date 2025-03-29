# Component Documentation Template

## Overview

This template provides a standardised way to document components in our ChMS project. Each component should follow this structure to ensure consistency and maintainability.

## Template Structure

````markdown
# Component Name

## Description

Brief description of what the component does and its purpose.

## Usage

```tsx
// Basic usage example
<ComponentName prop1="value" prop2={123} />

// Complex usage example
<ComponentName
  prop1="value"
  prop2={123}
  children={<OtherComponent />}
/>
```
````

## Props

| Prop  | Type   | Default | Required | Description          |
| ----- | ------ | ------- | -------- | -------------------- |
| prop1 | string | -       | Yes      | Description of prop1 |
| prop2 | number | 0       | No       | Description of prop2 |

## Examples

### Basic Example

```tsx
<ComponentName prop1="value" />
```

### With Children

```tsx
<ComponentName>
  <ChildComponent />
</ComponentName>
```

### With Different Variants

```tsx
<ComponentName variant="primary" />
<ComponentName variant="secondary" />
```

## Accessibility

- ARIA attributes used
- Keyboard navigation support
- Screen reader considerations

## Best Practices

- When to use this component
- Common pitfalls to avoid
- Performance considerations

## Related Components

- Links to related components
- When to use each

## Changelog

| Version | Changes         |
| ------- | --------------- |
| 1.0.0   | Initial release |

````

## Real Examples from Our Project

### 1. QRCodeScanner Component

```markdown
# QRCodeScanner

## Description
A reusable QR code scanner component that uses the device's camera to scan QR codes for attendance tracking.

## Usage
```tsx
import { QRCodeScanner } from '@/components/QRCodeScanner';

// Basic usage
<QRCodeScanner onScan={handleScan} />

// With error handling
<QRCodeScanner
  onScan={handleScan}
  onError={handleError}
  retryCount={3}
/>
````

## Props

| Prop       | Type                   | Default | Required | Description                      |
| ---------- | ---------------------- | ------- | -------- | -------------------------------- |
| onScan     | (data: string) => void | -       | Yes      | Callback when QR code is scanned |
| onError    | (error: Error) => void | -       | No       | Error handling callback          |
| retryCount | number                 | 3       | No       | Number of retry attempts         |

## Examples

### Basic Scanner

```tsx
<QRCodeScanner onScan={data => console.log(data)} />
```

### With Error Boundary

```tsx
<ErrorBoundary>
  <QRCodeScanner onScan={handleScan} onError={handleError} />
</ErrorBoundary>
```

## Accessibility

- Uses `aria-label` for camera access
- Provides visual feedback for scanning status
- Supports keyboard navigation for retry

## Best Practices

- Always wrap in error boundary
- Handle camera permissions gracefully
- Provide fallback for devices without camera

## Related Components

- QRCodeGenerator
- AttendanceForm

````

### 2. FamilyCheckInForm Component

```markdown
# FamilyCheckInForm

## Description
A form component for checking in multiple family members at once during services or events.

## Usage
```tsx
import { FamilyCheckInForm } from '@/components/FamilyCheckInForm';

// Basic usage
<FamilyCheckInForm
  familyId="family123"
  onCheckIn={handleCheckIn}
/>

// With validation
<FamilyCheckInForm
  familyId="family123"
  onCheckIn={handleCheckIn}
  validateLocation={true}
/>
````

## Props

| Prop             | Type                        | Default | Required | Description                        |
| ---------------- | --------------------------- | ------- | -------- | ---------------------------------- |
| familyId         | string                      | -       | Yes      | Unique identifier for the family   |
| onCheckIn        | (data: CheckInData) => void | -       | Yes      | Callback when check-in is complete |
| validateLocation | boolean                     | false   | No       | Whether to validate location       |

## Examples

### Basic Check-in

```tsx
<FamilyCheckInForm familyId="family123" onCheckIn={handleCheckIn} />
```

### With Location Validation

```tsx
<FamilyCheckInForm
  familyId="family123"
  onCheckIn={handleCheckIn}
  validateLocation={true}
  geofenceRadius={100}
/>
```

## Accessibility

- Form labels for all inputs
- Error messages for validation
- Loading states for async operations

## Best Practices

- Validate all required fields
- Handle offline scenarios
- Provide clear feedback

## Related Components

- MemberSearch
- LocationValidator
- CheckInConfirmation

````

## Component Testing Template

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName prop1="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('handles error states', () => {
    render(<ComponentName error="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
````

## Component Story Template (Storybook)

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import ComponentName from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    prop1: 'value',
  },
};

export const WithChildren: Story = {
  args: {
    children: <div>Child content</div>,
  },
};
```
