# Church Management System (ChMS)

A modern web-based solution for church administration, designed specifically for African churches.

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
  - Customizable UI theme
  - Accessible through settings dashboard

### Member Management

- Complete member profiles
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

### Communication

- Mass emailing system
- SMS integration
- External email client API integration

### Advanced Features

- Family check-in feature (single scan for multiple family members)
- Advanced reporting system
- Online giving integration
- Mobile app for check-in

### Security & Compliance

- Role-based access control
- Data encryption
- GDPR compliance
- Regular backups

## Technical Stack

- **Frontend**: Next.js with TypeScript
- **UI Framework**: Chakra UI
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Testing**: Jest, React Testing Library, MSW
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Monitoring & Logging**
  - Sentry for error tracking
  - Pino for structured logging
  - Custom performance monitoring
  - User event tracking
  - Feature flag system
- **Recent Implementations**
  - [x] Enhanced error tracking with Sentry
  - [x] Structured logging with Pino
  - [x] Performance monitoring system
  - [x] User event tracking
  - [x] Progressive enhancement
  - [x] Form validation and security

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and update the database connection string
3. Install dependencies: `npm install`
4. Generate Prisma client: `npm run prisma:generate`
5. Run migrations: `npm run prisma:migrate`
6. Start development server: `npm run dev`

## Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use functional components
- Follow the established project structure
- Document new features and APIs

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
