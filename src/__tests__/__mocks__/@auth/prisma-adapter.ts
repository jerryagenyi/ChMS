import { vi } from 'vitest';

export const PrismaAdapter = vi.fn(() => ({
  createUser: vi.fn(),
  getUser: vi.fn(),
  getUserByEmail: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  linkAccount: vi.fn(),
  unlinkAccount: vi.fn(),
  getAccount: vi.fn(),
  getSessionAndUser: vi.fn(),
  createSession: vi.fn(),
  updateSession: vi.fn(),
  deleteSession: vi.fn(),
  createVerificationToken: vi.fn(),
  useVerificationToken: vi.fn(),
}));