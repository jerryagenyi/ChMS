# UI Elements Design Specifications

## Overview

This document lists all UI elements requiring design specifications for our ChMS project using Chakra UI v3.

> **Related Documents:**
>
> - [Chakra UI Components](./.cursor/rules/chakra-components.mdc) - Component implementation examples
> - [Chakra UI Usage](./.cursor/rules/chakra-usage.mdc) - Usage guidelines and best practices

## Core Elements

### Buttons

- **Variants**
  - Primary
  - Secondary
  - Tertiary
  - Ghost
  - Link
  - Icon button
- **States**
  - Default
  - Hover
  - Active
  - Disabled
  - Loading
  - Focus
- **Sizes**
  - xs: 24px height
  - sm: 32px height
  - md: 40px height
  - lg: 48px height

### Form Elements

- **Text Input**
  - Default
  - Filled
  - Flushed
  - Unstyled
  - With addons
  - With elements
  - With validation states
  - With error messages
- **File Upload**
  - Image upload
  - Drag and drop support
  - Preview capability
  - Progress indicator
  - Validation feedback
  - Error states
- **Select**
  - Single select
  - Multi select
  - With groups
  - Searchable
  - With custom filtering
- **Checkbox**
  - Single
  - Group
  - Indeterminate
- **Radio**
  - Single
  - Group
  - Card radio
- **Toggle/Switch**
- **Textarea**
- **Number Input**
- **Date Picker**
- **Time Picker**

### Data Display

- **Tables**
  - Basic
  - Sortable
  - Filterable
  - Paginated
  - Selectable rows
  - Expandable rows
- **Cards**
  - Basic
  - Interactive
  - With media
  - Action cards
- **Lists**
  - Basic
  - Interactive
  - With icons
  - With actions
- **Charts**
  - Line
  - Bar
  - Pie
  - Area
  - Combined

### Navigation

- **Breadcrumbs**
- **Tabs**
  - Horizontal
  - Vertical
  - With icons
- **Pagination**
- **Steps**
- **Menu**
  - Dropdown
  - Context menu
  - Command menu

### Feedback

- **Alert**
  - Info
  - Success
  - Warning
  - Error
- **Toast**
- **Progress**
  - Linear
  - Circular
  - Steps
- **Skeleton**
- **Spinner**

### Overlays

- **Modal**
  - Basic
  - Form
  - Alert
  - Full screen
- **Drawer**
  - Side drawer
  - Bottom sheet
- **Tooltip**
- **Popover**

### Layout

- **Container**
- **Grid**
- **Stack**
  - Horizontal
  - Vertical
- **Divider**
- **Box**
- **Flex**

## Ministry-Specific Components

### Attendance

- **Check-in Card**
  - QR code display
  - Status indicators
  - Time stamps
  - Error states
- **Attendance Status Indicator**
- **Service Time Selector**
- **Attendance Stats Card**
  - Summary view
  - Detailed view
  - Export controls

### Member Management

- **Profile Card**
  - Image display
  - Loading states
  - Error states
  - Edit controls
- **Member List Item**
- **Role Badge**
- **Leadership Indicator**

### Image Management

- **Image Upload Component**
  - Upload area
  - Preview
  - Progress indicator
  - Error states
  - Success feedback
- **Image Display**
  - Responsive sizes
  - Loading states
  - Error fallback
  - Optimization indicators
- **Image Gallery**
  - Grid layout
  - List layout
  - Loading states
  - Pagination

### Reports

- **Report Card**
- **Metric Display**
- **Trend Indicator**
- **Export Controls**

## Design Specifications

### For Each Element

1. **Dimensions**

   - Height
   - Width
   - Padding
   - Margin
   - Border radius

2. **Typography**

   - Font family
   - Font size
   - Font weight
   - Line height
   - Letter spacing

3. **Colors**

   - Light Mode
     - Background
     - Text
     - Border
     - Icon
     - States (hover, active, disabled)
     - Accent colors
     - Success/Error/Warning states
   - Dark Mode
     - Background (dark theme)
     - Text (light/muted variants)
     - Border (subtle variants)
     - Icon (light variants)
     - States (dark mode specific)
     - Accent colors (dark mode adjusted)
     - Success/Error/Warning states (dark mode variants)

4. **Effects**

   - Shadow
   - Opacity
   - Blur
   - Overlay

5. **Animation**

   - Duration
   - Easing
   - Transform
   - Transition

6. **Spacing**

   - Internal padding
   - External margin
   - Element spacing
   - Content gaps

7. **Responsive Behavior**
   - Breakpoints
   - Stack behavior
   - Hide/show rules
   - Size adjustments

## Implementation Notes

### Color Mode Support

- **Light Mode Base**

  - Background scale: white to gray.50
  - Text: gray.800
  - Accent: brand colors at 500
  - Borders: gray.200
  - Shadows: blackAlpha.100

- **Dark Mode Base**
  - Background scale: gray.900 to gray.800
  - Text: whiteAlpha.900
  - Accent: brand colors at 200
  - Borders: whiteAlpha.300
  - Shadows: blackAlpha.400

### Chakra UI v3 Color Mode Integration

- Use `useColorMode` hook for dynamic switching
- Implement `colorScheme` props
- Define semantic tokens for both modes
- Use color mode specific variants

### Chakra UI v3 Integration

- Use Chakra's theme extension
- Implement custom component variants
- Follow Chakra's style props pattern
- Maintain accessibility standards

### Design Token Usage

- Reference global design tokens
- Use semantic color tokens
- Apply spacing scale
- Follow typography scale

### Accessibility Requirements

- Color contrast ratios
- Focus indicators
- Touch targets
- Screen reader support

### Performance Considerations

- Lazy loading strategy
- Image optimization pipeline
- Asset optimization
- Bundle size impact
- Loading states
- Error boundaries
- Offline support

### Testing Requirements

- Component test coverage (85%+)

  - User interaction testing
  - Accessibility validation
  - State management verification
  - Error handling scenarios
  - Loading state verification
  - Form validation testing
  - Event handling verification
  - Prop validation testing

- Visual regression tests

  - Light/dark mode transitions
  - Responsive breakpoints
  - Component states
  - Animation sequences
  - Loading states
  - Error states
  - Interactive states

- Accessibility tests

  - ARIA attributes
  - Keyboard navigation
  - Screen reader compatibility
  - Color contrast
  - Focus management
  - Touch targets
  - Error announcements

- Performance benchmarks

  - First paint metrics
  - Time to interactive
  - Bundle size impact
  - Memory usage
  - Animation performance
  - Layout shifts
  - Loading performance

- Cross-browser compatibility

  - Chrome/Firefox/Safari
  - Mobile browsers
  - Touch interactions
  - Gesture support
  - Feature detection
  - Fallback handling

- Mobile responsiveness

  - Breakpoint behavior
  - Touch interactions
  - Gesture support
  - Viewport adaptations
  - Input handling
  - Virtual keyboard handling

- Error handling verification
  - Input validation
  - Network errors
  - Loading failures
  - State transitions
  - Recovery flows
  - Fallback UI
  - Error boundaries
