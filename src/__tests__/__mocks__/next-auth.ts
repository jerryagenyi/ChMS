import { vi } from 'vitest';
import { Role } from '@prisma/client';

export const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: Role.MEMBER,
    permissions: ['read:users'],
  },
  expires: '2024-01-01',
};

export const mockUpdate = vi.fn();

export const mockUseSession = vi.fn(() => ({
  data: mockSession,
  status: 'authenticated',
  update: mockUpdate,
}));

const nextAuth = vi.fn(() => ({
  useSession: mockUseSession,
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(() => Promise.resolve(mockSession)),
}));

export default nextAuth; 