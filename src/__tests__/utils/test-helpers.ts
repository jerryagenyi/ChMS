import { vi } from 'vitest';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'vitest-mock-extended';

// Prisma mocking
export const createMockPrismaClient = () => mockDeep<PrismaClient>();

// Request mocking
export function createMockRequest(
  url: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    params?: Record<string, string>;
  } = {}
) {
  const request = new NextRequest(new URL(url, 'http://localhost'), {
    method: options.method || 'GET',
    headers: new Headers(options.headers || {}),
    body: options.body ? JSON.stringify(options.body) : null,
  });

  // Add validated data for testing purposes
  Object.defineProperty(request, 'validatedData', {
    value: {
      params: options.params || {},
      query: Object.fromEntries(new URL(url).searchParams),
      body: options.body,
    },
    writable: true,
  });

  return request;
}

// Response mocking
export function createMockResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    headers: new Headers(),
  };
}

// Session mocking
export const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    organizationId: '1',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};
