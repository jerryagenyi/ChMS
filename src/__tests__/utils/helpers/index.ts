import { PrismaClient } from '@prisma/client';
import { vi } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import { render, RenderOptions } from '@testing-library/react';
import { FC, ReactElement, ReactNode } from 'react';

// Mock Prisma Context
export const createMockContext = () => {
  return {
    prisma: {
      ministryUnit: {
        create: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue({}),
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        delete: vi.fn().mockResolvedValue({}),
      },
      member: {
        create: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue({}),
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
      },
      // Add other models as needed
    } as unknown as PrismaClient,
  };
};

// Mock Data
export const mockMinistryUnit = {
  id: 'unit1',
  name: 'Test Unit',
  type: 'TEAM',
  category: 'WORSHIP',
  organizationId: 'org1',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  parentUnitId: null,
  leaders: [],
  members: [],
};

export const mockMember = {
  id: 'member1',
  name: 'Test Member',
  email: 'test@example.com',
  organizationId: 'org1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Test Utils
export const createTestDate = (dateString: string) => new Date(dateString);

export const createMockRequest = (overrides = {}) => {
  return {
    method: 'GET',
    headers: new Headers(),
    ...overrides,
  };
};

// Render Utilities
type CustomRenderOptions = Omit<RenderOptions, 'wrapper'>;

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

export const renderWithProviders = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => render(ui, { wrapper: Wrapper, ...options });

// Performance Testing
export const measurePerformance = async (callback: () => Promise<void>) => {
  const start = performance.now();
  await callback();
  return performance.now() - start;
}; 