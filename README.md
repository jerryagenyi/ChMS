# Project Name

## Setup Instructions

1. **Environment Variables:**

   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `NEXT_PUBLIC_APP_URL`: The base URL of your application.
   - `NEXTAUTH_URL`: The URL used by NextAuth for authentication callbacks.
   - `NEXTAUTH_SECRET`: A secret key for NextAuth.
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Credentials for Google SSO.

2. **Running the Project:**

   - Install dependencies: `npm install`
   - Run the development server: `npm run dev`

3. **Authentication Features:**

   - Google SSO with backup password setup.
   - New API route: `/api/auth/check-password-status` for password status verification.
   - Password setup component with Chakra UI.

4. **Testing:**
   - Run tests with: `npm test`
   - Ensure all tests pass before deploying.

## Additional Information

- Ensure your PostgreSQL server is running and accessible.
- Follow best practices for security and performance.
