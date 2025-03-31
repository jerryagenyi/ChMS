import 'next-auth';
import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: Role;
    permissions: string[];
  }

  interface Session {
    user: User;
    expires: string;
  }

  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    role: Role;
    permissions: string[];
  }
} 