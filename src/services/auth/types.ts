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