
import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { mockReset } from 'vitest-mock-extended';
import { prismaMock } from '../mocks/prisma';

// Extend Vitest's expect
expect.extend(matchers);

// Import environment setup
import './environment';

beforeAll(() => {
  // Global setup
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  // Reset all mocks before each test
  vi.resetAllMocks();
  mockReset(prismaMock);
});

afterEach(() => {
  // Cleanup after each test
  cleanup();
});

// Handle console errors/warnings
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};

console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('componentWillReceiveProps') ||
    args[0].includes('componentWillMount')
  ) {
    return;
  }
  originalConsoleWarn.call(console, ...args);
};

// Export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

