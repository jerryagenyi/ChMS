import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      organisationId?: string
    } & DefaultSession['user']
  }

  interface User {
    role: string
    organisationId?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    organisationId?: string
  }
} 