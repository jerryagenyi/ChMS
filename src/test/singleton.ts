import { PrismaClient } from '@prisma/client';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'jest-mock-extended';

beforeEach(() => {
  mockReset(prismaMock);
});

export type MockPrismaClient = ReturnType<typeof mockDeep<PrismaClient>>;
export const prismaMock = mockDeep<PrismaClient>(); 