# Church Management System (ChMS)

A modern, minimalist web-based solution for church administration, designed specifically for African churches with focus on performance and efficiency.

## Key Features

- **Organization Management**: Multi-department support, event management, family unit tracking
- **Member Management**: Complete profiles, family linking, attendance tracking
- **Visitor System**: Registration, follow-up tracking, conversion monitoring
- **Attendance System**: Service tracking, family check-in, offline support
- **Security**: Role-based access, data encryption, GDPR compliance

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI**: Chakra UI v3, React Icons
- **Backend**: PostgreSQL, Prisma ORM
- **Security**: NextAuth.js, Argon2 (password hashing)
- **Testing**: Vitest, React Testing Library, MSW
- **Other**: Sharp (image processing), date-fns, Sentry, Pino

## Setup Instructions

1. **Prerequisites**

   - Node.js 18+
   - PostgreSQL 14+
   - Git

2. **Environment Variables**

   ```bash
   DATABASE_URL=           # PostgreSQL connection string
   NEXT_PUBLIC_APP_URL=   # Application base URL
   NEXTAUTH_URL=          # NextAuth callback URL
   NEXTAUTH_SECRET=       # JWT signing key (min 32 chars)
   GOOGLE_CLIENT_ID=      # Google OAuth client ID
   GOOGLE_CLIENT_SECRET=  # Google OAuth client secret
   ```

3. **Installation**

   ```bash
   git clone [repository-url]
   cd ChMS
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Development**
   ```bash
   npm run dev        # Start development server
   npm test          # Run tests
   npm run build     # Production build
   ```

## Development Guidelines

- Write clean, maintainable TypeScript code
- Follow the established project structure
- Include tests for new features
- Optimize for low-bandwidth environments
- Document new features and APIs

## Project Structure

```
src/
├── components/     # UI components
├── pages/         # Next.js pages
├── hooks/         # React hooks
├── utils/         # Utilities
├── types/         # TypeScript types
├── services/      # External integrations
└── styles/        # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

MIT
