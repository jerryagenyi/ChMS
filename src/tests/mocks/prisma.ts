import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// Create a mock instance of PrismaClient
const prismaMock = mockDeep<PrismaClient>();

// Mock the prisma module
jest.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}));

export { prismaMock };
export default prismaMock; 