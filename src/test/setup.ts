import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { TestWrapper } from './wrapper';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Create a custom renderer that includes providers
const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: TestWrapper, ...options });

// Override the built-in render method
export { customRender as render };

// Mock next/server globally
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server');
  return {
    ...actual,
    NextRequest: class NextRequest extends Request {
      public validatedData?: {
        body?: any;
        query?: any;
        params?: Record<string, string>;
      };
      public _options?: {
        method?: string;
        headers?: HeadersInit;
        body?: any;
        params?: Record<string, string>;
      };
      
      constructor(input: string | URL, init?: RequestInit) {
        super(input, init);
        this.validatedData = {};
        return this;
      }
    },
    NextResponse: {
      json: (data: any, init?: ResponseInit) => new Response(JSON.stringify(data), init),
    },
  };
});


