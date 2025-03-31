# Church Management System (ChMS)

A modern, minimalist web-based solution for church administration, designed specifically for African churches with focus on performance and efficiency.

## Core Architecture Principles

### 1. Minimalist Design

- Simple, focused feature set addressing core church management needs
- Intuitive, clean user interface requiring minimal training
- Efficient workflows minimizing clicks and user actions
- Carefully curated dependencies to maintain small bundle size
- Progressive enhancement approach for feature additions

### 2. Performance First

- Optimized for low-bandwidth environments
- Offline-first architecture for core features
- Efficient data structures for common operations
  - Optimized member lookups
  - Fast attendance tracking
  - Efficient family unit management
  - Optimized image handling and storage
- Minimal client-side JavaScript
- Strategic code splitting and lazy loading

## Core Features (MVP)

### Organization Management

- Multi-department support
- Class/event management
- Family unit tracking
- Visitor management system
- Organization customization
  - Brand colours (primary, secondary, background, accent)
  - Localization preferences (language, currency, timezone)
  - Brand assets (logo, favicon)
    - Optimized image upload and storage
    - Automatic image format conversion
    - Responsive image delivery
  - Customizable UI theme
  - Accessible through settings dashboard

### Technical Implementation Approach

Each feature is implemented following our core principles:

1. Minimalist Implementation

   - Simple, maintainable code
   - Clear separation of concerns
   - Minimal dependencies
   - Focused feature scope
   - Comprehensive testing coverage

2. Performance Optimization

   - Efficient database queries
   - Optimized API responses
   - Strategic caching
   - Minimal network requests
   - Image optimization pipeline

3. Security Integration
   - Built-in security controls
   - Data privacy by design
   - Role-based access control
   - Regular security audits
   - Secure file handling

### Member Management

- Complete member profiles
  - Profile image management
  - Image optimization and validation
  - Secure storage handling
- Family registration and linking
- Attendance tracking
- Skills and gifts tracking
- Team/department assignments
- Class enrollment

### Visitor Management

- Visitor registration
- Follow-up tracking
- Conversion status monitoring

### Attendance System

- Service attendance tracking
- Class attendance tracking
- Family check-in support
- Offline capability

## Future Enhancements

### Communication System

- Mass emailing system
- SMS integration
- External email client API integration
- Automated notifications for:
  - Event reminders
  - Birthday wishes
  - Welcome messages
  - Follow-up messages
  - Announcements

### Financial Management

- Tithe and offering tracking
- Online giving integration
- Expense tracking
- Financial reports
- Gift Aid tracking

### Ministry Scheduling

- Service roster management
- Volunteer scheduling
- Team availability tracking
- Automatic schedule generation
- Conflict detection

### Resource Management

- Room/venue booking system
- Equipment tracking
- Resource allocation for events
- Maintenance scheduling

### Enhanced Reporting & Analytics

- Attendance trends and patterns
- Growth metrics and KPIs
- Member engagement scores
- Financial dashboards
- Custom report builder
- Visitor conversion tracking
- Event success metrics
- Ministry performance analytics

### Small Groups Management

- Home cell groups tracking
- Bible study groups
- Meeting attendance
- Discussion topics
- Resource sharing
- Leader assignment
- Member participation tracking

### Advanced Features

- Family check-in feature (single scan for multiple family members)
- Advanced reporting system
- Mobile app for check-in

### Security & Compliance

- Role-based access control
- Data encryption
- GDPR compliance
- Regular backups

## Standards Integration

Our implementation follows these integrated standards:

1. Development Standards

   - Clean code principles
   - Performance optimization guidelines
   - Security-first development
   - Accessibility requirements

2. Testing Standards

   - Comprehensive test coverage
   - Performance benchmarking
   - Security testing
   - Accessibility testing

3. Security Standards
   - Data protection
   - Access control
   - Audit logging
   - Compliance requirements

## Technical Stack

- **Frontend**: Next.js with TypeScript
- **UI Framework**: Chakra UI
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Testing**:
  - Vitest for unit and integration tests
  - React Testing Library
  - User Event for interaction testing
  - Mock Service Worker (MSW)
  - Custom test helpers and factories
  - Schema validation testing
  - Service layer testing
- **Image Processing**:
  - Sharp for image optimization
  - Secure upload handling
  - Format conversion
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Monitoring & Logging**
  - Sentry for error tracking
  - Pino for structured logging
  - Custom performance monitoring
  - User event tracking
  - Feature flag system

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and update the database connection string
3. Install dependencies: `npm install`
4. Generate Prisma client: `npm run prisma:generate`
5. Run migrations: `npm run prisma:migrate`
6. Start development server: `npm run dev`

## Development Guidelines

- Follow TypeScript best practices
- Write tests for all new features
- Use functional components
- Follow the established project structure
- Document new features and APIs
- Ensure proper image handling and optimization
- Maintain test coverage targets

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Next.js pages
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── services/      # API and external service integrations
└── styles/        # Global styles and theme
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

MIT
