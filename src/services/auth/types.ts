import { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  organizationId: string | null;
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
}

export interface TokenPayload {
  userId: string;
  type: 'password_reset' | 'email_verification';
  exp?: number;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  password: string | null;
  role: string;
  organizationId: string | null;
  verificationToken: string | null;
  emailVerified: Date | null;
  dateOfBirth: Date | null;
  memorableDates: any; // TODO: Define proper type for memorable dates
}

export interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  expires: string;
}