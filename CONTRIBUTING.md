# Contributing to ChMS

Thank you for your interest in contributing to the ChMS project! These guidelines will help you get your development environment set up and outline the process for contributing.

> **Note:** For a complete overview of the project documentation, please see [DOCUMENTATION.md](./DOCUMENTATION.md).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (for running a local PostgreSQL database)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/ChMS.git # Replace with the actual repo URL
    cd ChMS
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    # or
    npm install
    ```

3.  **Set up the database:**

    - The easiest way is using Docker:
      ```bash
      docker-compose up -d # Assuming a docker-compose.yml exists for postgres
      ```
    - Alternatively, ensure you have a local PostgreSQL instance running.

4.  **Set up environment variables:**

    - Copy the example environment file:
      ```bash
      cp .env.example .env.local
      ```
    - Update `.env.local` with your local database connection string (`DATABASE_URL`) and a `NEXTAUTH_SECRET`. You can generate a secret using:
      ```bash
      openssl rand -base64 32
      ```
    - Add any necessary OAuth provider credentials (e.g., `GITHUB_ID`, `GITHUB_SECRET`) if you plan to test OAuth logins.

5.  **Run database migrations:**

    ```bash
    npx prisma migrate dev
    ```

    This will apply any pending migrations and potentially seed the database (if seeding is configured).

6.  **Start the development server:**
    ```bash
    yarn dev
    # or
    npm run dev
    ```
    The application should now be running, typically at `http://localhost:3000`.

## Development Workflow

1.  **Create a Feature Branch:**

    ```bash
    git checkout main # Or your base branch
    git pull
    git checkout -b feature/your-feature-name
    ```

2.  **Make Changes:** Implement your feature or fix.

    - Follow the coding standards outlined in `docs/standards/development-standards.md`.
    - Ensure code is well-formatted (Prettier should handle this on save if configured).
    - Add necessary tests (Unit, Integration).

3.  **Run Tests:**

    ```bash
    yarn test
    # or
    npm run test
    ```

    Ensure all tests pass.

4.  **Commit Changes:**

    - Use meaningful commit messages (e.g., `feat: Add member profile editing`, `fix: Correct attendance report calculation`).
    - Keep commits focused and atomic.

5.  **Push Changes:**

    ```bash
    git push origin feature/your-feature-name
    ```

6.  **Create a Pull Request (PR):**

    - Open a PR against the `main` branch (or the designated integration branch).
    - Provide a clear description of the changes.
    - Link any relevant issues.
    - Ensure CI checks pass.

7.  **Code Review:** Your PR will be reviewed by maintainers.

## Coding Standards

Please refer to the documents in the `docs/standards/` directory:

- [Development Standards](./docs/standards/development-standards.md)
- [Testing Standards](./docs/standards/testing-standards.md)
- [Documentation Standards](./docs/standards/documentation-standards.md)

Key points:

- Use TypeScript.
- Follow Chakra UI best practices.
- Write tests using Vitest and React Testing Library.
- Format code using Prettier.
- Follow naming conventions.

## Project Documentation

- For technical architecture and design decisions, see [pm/technical-architecture.md](./pm/technical-architecture.md)
- For feature requirements, see the [pm/features/](./pm/features/) directory
- For user guides and tutorials, see the [docs/](./docs/) directory

## Questions?

If you have questions, feel free to open an issue on the GitHub repository.

## Version History

### 1.1.0 - [Current Date]

- Added cross-references to documentation structure
- Added links to standards documents

### 1.0.0 - [Initial Date]

- Initial version of contributing guidelines
