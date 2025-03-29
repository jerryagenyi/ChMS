# Design System Handoff Tutorial

## Overview

This tutorial explains how to prepare and share your design system for implementation in our ChMS project. We use Chakra UI as our component library, so we'll focus on integrating your design system with Chakra's theming system.

## Required Design Tokens

### 1. Color System

```typescript
interface ColorSystem {
  // Brand Colors
  primary: string; // Main brand color (e.g., #553C9A)
  secondary: string; // Complementary color (e.g., #805AD5)

  // Background Colors
  background: string; // Main background (e.g., #FFFFFF)
  surface: string; // Card/panel backgrounds (e.g., #F7FAFC)

  // Text Colors
  text: {
    primary: string; // Main text (e.g., #2D3748)
    secondary: string; // Secondary text (e.g., #718096)
    tertiary: string; // Tertiary text (e.g., #A0AEC0)
  };

  // Status Colors
  status: {
    success: string; // Success state (e.g., #48BB78)
    warning: string; // Warning state (e.g., #ECC94B)
    error: string; // Error state (e.g., #F56565)
    info: string; // Info state (e.g., #4299E1)
  };
}
```

### 2. Typography System

```typescript
interface TypographySystem {
  fontFamily: {
    primary: string; // Main font (e.g., "Inter")
    secondary: string; // Secondary font (e.g., "Roboto")
  };

  fontSize: {
    h1: string; // 2.5rem
    h2: string; // 2rem
    h3: string; // 1.75rem
    h4: string; // 1.5rem
    h5: string; // 1.25rem
    h6: string; // 1rem
    body: string; // 1rem
    small: string; // 0.875rem
  };

  fontWeight: {
    light: number; // 300
    regular: number; // 400
    medium: number; // 500
    bold: number; // 700
  };
}
```

### 3. Spacing System

```typescript
interface SpacingSystem {
  base: string; // Base unit (e.g., "4px")
  xs: string; // Extra small (e.g., "4px")
  sm: string; // Small (e.g., "8px")
  md: string; // Medium (e.g., "16px")
  lg: string; // Large (e.g., "24px")
  xl: string; // Extra large (e.g., "32px")
  '2xl': string; // 2x Extra large (e.g., "48px")
}
```

## Sharing Your Design System

### 1. Design Tokens File

Create a `design-tokens.json` file with this structure:

```json
{
  "colors": {
    "primary": "#553C9A",
    "secondary": "#805AD5",
    "background": "#FFFFFF",
    "surface": "#F7FAFC",
    "text": {
      "primary": "#2D3748",
      "secondary": "#718096",
      "tertiary": "#A0AEC0"
    },
    "status": {
      "success": "#48BB78",
      "warning": "#ECC94B",
      "error": "#F56565",
      "info": "#4299E1"
    }
  },
  "typography": {
    "fontFamily": {
      "primary": "Inter",
      "secondary": "Roboto"
    },
    "fontSize": {
      "h1": "2.5rem",
      "h2": "2rem",
      "h3": "1.75rem",
      "h4": "1.5rem",
      "h5": "1.25rem",
      "h6": "1rem",
      "body": "1rem",
      "small": "0.875rem"
    },
    "fontWeight": {
      "light": 300,
      "regular": 400,
      "medium": 500,
      "bold": 700
    }
  },
  "spacing": {
    "base": "4px",
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px"
  }
}
```

### 2. Component Examples

For each component, provide:

1. **States**:

   - Default
   - Hover
   - Active
   - Disabled
   - Error
   - Success

2. **Specifications**:
   - Padding
   - Margins
   - Border radius
   - Shadow
   - Transitions

### 3. Layout System

Provide:

- Grid system specifications
- Breakpoints
- Container widths
- Responsive behavior

## Implementation Process

1. **Theme Setup**

   ```typescript
   // src/theme/index.ts
   import { extendTheme } from '@chakra-ui/react';
   import designTokens from './design-tokens.json';

   const theme = extendTheme({
     colors: designTokens.colors,
     fonts: designTokens.typography.fontFamily,
     fontSizes: designTokens.typography.fontSize,
     fontWeights: designTokens.typography.fontWeight,
     space: designTokens.spacing,
     // ... other theme configurations
   });

   export default theme;
   ```

2. **Component Implementation**

   ```typescript
   // src/components/Button.tsx
   import { Button as ChakraButton } from '@chakra-ui/react';

   export const Button = ({ children, ...props }) => (
     <ChakraButton bg="primary" color="white" _hover={{ bg: 'secondary' }} {...props}>
       {children}
     </ChakraButton>
   );
   ```

3. **Documentation**

   ````markdown
   # Component Name

   ## Usage

   ```tsx
   <Button>Click me</Button>
   ```
   ````

   ## Props

   | Prop    | Type   | Default   | Description    |
   | ------- | ------ | --------- | -------------- |
   | variant | string | 'primary' | Button variant |
   | size    | string | 'md'      | Button size    |

   ```

   ```

## Best Practices

1. **Consistency**

   - Use design tokens consistently
   - Follow naming conventions
   - Maintain component hierarchy

2. **Accessibility**

   - Ensure sufficient color contrast
   - Provide focus states
   - Include ARIA attributes

3. **Performance**

   - Optimize assets
   - Use system fonts when possible
   - Implement lazy loading

4. **Responsiveness**
   - Mobile-first approach
   - Fluid typography
   - Flexible layouts

## Tools & Resources

1. **Design Tools**

   - Figma
   - Adobe XD
   - Sketch

2. **Development Tools**

   - Chakra UI
   - Storybook
   - Style Dictionary

3. **Testing Tools**
   - Chromatic
   - Percy
   - Lighthouse

## Further Reading

1. **Design Systems**

   - [Chakra UI Documentation](https://chakra-ui.com/docs/theming/theme)
   - [Material Design](https://material.io/)
   - [Design Systems Handbook](https://www.designbetter.co/design-systems-handbook)

2. **Implementation**
   - [React Component Patterns](https://reactpatterns.com/)
   - [CSS-in-JS](https://styled-components.com/docs/basics)
   - [Design Tokens](https://www.lightningdesignsystem.com/design-tokens/)
