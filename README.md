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

## Documentation

This project's documentation is organized into two main directories:

- **[docs/](./docs/)**: Application and developer documentation

  - User guides, API documentation, development standards, tutorials
  - See [docs/README.md](./docs/README.md) for a complete overview

- **[pm/](./pm/)**: Project management artifacts

  - Product requirements, technical architecture, user stories, feature specifications
  - See [pm/README.md](./pm/README.md) for a complete overview

- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Guidelines for contributing to the project

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
docs/              # Application and developer documentation
pm/                # Project management artifacts
```

## Contributing

Please read our [Contributing Guidelines](./CONTRIBUTING.md) for detailed information on:

1. Setting up your development environment
2. Coding standards and practices
3. Testing requirements
4. Pull request process

## Versioning

This project follows [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH).

Documentation follows a similar versioning scheme, with changes tracked in each document's version history section.

## License

MIT
