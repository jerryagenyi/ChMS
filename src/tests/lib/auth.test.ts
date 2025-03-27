import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUser, validateSession } from '@/lib/auth';
import { prismaMock } from '@/tests/mocks/prisma';
import { hash } from 'bcryptjs';
import { Role } from '@prisma/client';

vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockImplementation((str) => Promise.resolve(`hashed_${str}`)),
}));

describe('Auth Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    const mockUserData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'StrongPass123!',
    };

    it('creates a new user successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: '1',
        email: mockUserData.email,
        name: mockUserData.name,
        password: 'hashed_StrongPass123!',
        role: Role.MEMBER,
        organisationId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await createUser(mockUserData);

      expect(hash).toHaveBeenCalledWith(mockUserData.password, 12);
      expect(result.email).toBe(mockUserData.email);
      expect(result.password).toBe('hashed_StrongPass123!');
    });

    it('throws error if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: mockUserData.email,
        name: 'Existing User',
        password: 'hashed_password',
        role: Role.MEMBER,
        organisationId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(createUser(mockUserData)).rejects.toThrow('Email already exists');
    });
  });

  describe('validateSession', () => {
    it('returns session for authenticated user', async () => {
      const mockSession = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
        expires: new Date().toISOString(),
      };

      vi.mock('next-auth/next', () => ({
        getServerSession: vi.fn().mockResolvedValue(mockSession),
      }));

      const result = await validateSession({} as any, {} as any);
      expect(result).toEqual(mockSession);
    });

    it('returns null for unauthenticated user', async () => {
      vi.mock('next-auth/next', () => ({
        getServerSession: vi.fn().mockResolvedValue(null),
      }));

      const result = await validateSession({} as any, {} as any);
      expect(result).toBeNull();
    });
  });
});