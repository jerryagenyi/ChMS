import { vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/server/auth';
import { authOptions } from '@/services/auth/auth-options';
import { createMockRequest } from '@/test-utils/request';
import { Role } from '@prisma/client';
import { ROLE_HIERARCHY } from '@/services/auth/roles';

// Mock external dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/security', () => ({
  verifyPassword: vi.fn(),
}));

// Mock NextAuth
vi.mock('next-auth', () => ({
  default: vi.fn(),
}));

vi.mock('@next-auth/prisma-adapter', () => ({
  PrismaAdapter: vi.fn(() => ({
    createUser: vi.fn(),
    getUser: vi.fn(),
    getUserByEmail: vi.fn(),
    getUserByAccount: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    linkAccount: vi.fn(),
    unlinkAccount: vi.fn(),
    createSession: vi.fn(),
    getSessionAndUser: vi.fn(),
    updateSession: vi.fn(),
    deleteSession: vi.fn(),
    createVerificationToken: vi.fn(),
    useVerificationToken: vi.fn(),
  })),
}));

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Role Hierarchy', () => {
    test('should have correct role hierarchy order', () => {
      expect(ROLE_HIERARCHY.SUPER_ADMIN).toBeGreaterThan(ROLE_HIERARCHY.ADMIN);
      expect(ROLE_HIERARCHY.ADMIN).toBeGreaterThan(ROLE_HIERARCHY.MANAGER);
      expect(ROLE_HIERARCHY.MANAGER).toBeGreaterThan(ROLE_HIERARCHY.STAFF);
      expect(ROLE_HIERARCHY.STAFF).toBeGreaterThan(ROLE_HIERARCHY.MEMBER);
      expect(ROLE_HIERARCHY.MEMBER).toBeGreaterThan(ROLE_HIERARCHY.VIEWER);
    });
  });

  describe('Auth Options', () => {
    test('should have Prisma adapter configured', () => {
      expect(authOptions.adapter).toBeDefined();
    });

    test('should have Google provider configured', () => {
      const googleProvider = authOptions.providers.find(
        (provider) => provider.id === 'google'
      );
      expect(googleProvider).toBeDefined();
    });

    test('should have Credentials provider configured', () => {
      const credentialsProvider = authOptions.providers.find(
        (provider) => provider.id === 'credentials'
      );
      expect(credentialsProvider).toBeDefined();
    });
  });

  describe('Credentials Authentication', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: Role.MEMBER,
    };

    test('should authenticate valid credentials', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (verifyPassword as any).mockResolvedValue(true);

      const credentialsProvider = authOptions.providers.find(
        (provider) => provider.id === 'credentials'
      );

      if (!credentialsProvider || !('authorize' in credentialsProvider)) {
        throw new Error('Credentials provider not properly configured');
      }

      const credentials = {
        email: 'test@example.com',
        password: 'correctPassword',
      };

      const result = await credentialsProvider.authorize(credentials, {});

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    test('should reject invalid credentials', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (verifyPassword as any).mockResolvedValue(false);

      const credentialsProvider = authOptions.providers.find(
        (provider) => provider.id === 'credentials'
      );

      if (!credentialsProvider || !('authorize' in credentialsProvider)) {
        throw new Error('Credentials provider not properly configured');
      }

      const credentials = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      await expect(credentialsProvider.authorize(credentials, {})).rejects.toThrow();
    });

    test('should reject non-existent user', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      const credentialsProvider = authOptions.providers.find(
        (provider) => provider.id === 'credentials'
      );

      if (!credentialsProvider || !('authorize' in credentialsProvider)) {
        throw new Error('Credentials provider not properly configured');
      }

      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      await expect(credentialsProvider.authorize(credentials, {})).rejects.toThrow();
    });
  });

  describe('Session Handling', () => {
    test('should include user role in session', async () => {
      const session = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      const token = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.MEMBER,
      };

      const enrichedSession = await authOptions.callbacks?.session?.({
        session,
        token,
        user: token,
      } as any);

      expect(enrichedSession?.user).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.MEMBER,
      });
    });
  });
}); 