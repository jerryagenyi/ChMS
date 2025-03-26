import '@testing-library/jest-dom';
import { expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with testing-library matchers
expect.extend(matchers);

// Mock Next.js Response
vi.mock('next/server', () => {
  const json = vi.fn((data, init) => {
    return {
      status: init?.status || 200,
      json: async () => data,
      headers: new Headers(init?.headers),
    };
  });

  return {
    NextResponse: {
      json,
      redirect: vi.fn(),
      rewrite: vi.fn(),
      next: vi.fn(),
    },
  };
});

// Mock fetch API
global.fetch = vi.fn();

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Global error handlers
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /Warning.*not wrapped in act/.test(args[0]) ||
    /Warning: ReactDOM.render is no longer supported/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(() =>
    Promise.resolve({ user: { id: '1', email: 'test@example.com' } })
  ),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock headers
global.Headers = class Headers {
  private headers: Record<string, string> = {};
  
  constructor(init?: Record<string, string>) {
    if (init) {
      Object.assign(this.headers, init);
    }
  }

  append(name: string, value: string) {
    this.headers[name.toLowerCase()] = value;
  }

  get(name: string) {
    return this.headers[name.toLowerCase()] || null;
  }
};
