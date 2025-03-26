import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';
import { TestWrapper } from './wrapper';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Create a custom renderer that includes providers
const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: TestWrapper, ...options });

// Override the built-in render method
export { customRender as render }; 