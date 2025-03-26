import { beforeEach, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// Create a deep mock of PrismaClient
export const prismaMock = mockDeep<PrismaClient>();

// Mock the prisma module
vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}));

// Clear all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

export type MockPrismaClient = DeepMockProxy<PrismaClient>;
