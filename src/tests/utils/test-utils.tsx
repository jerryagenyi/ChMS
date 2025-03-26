import React, { ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import userEvent from '@testing-library/user-event';
import { Session } from 'next-auth';

// Define custom session type for testing
interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
}

// Mock session data for testing
export const mockSession: CustomSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

// Enhanced render function with Chakra UI provider and user events
function render(ui: ReactElement, options = {}) {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, {
      wrapper: ({ children }) => <ChakraProvider>{children}</ChakraProvider>,
      ...options,
    }),
  };
}

// Mock data for common test scenarios
export const mockServices = [
  { id: '1', name: 'Sunday Morning', startTime: '09:00', status: 'ACTIVE' },
  { id: '2', name: 'Sunday Evening', startTime: '18:00', status: 'ACTIVE' },
];

// Re-export everything from testing-library
export * from '@testing-library/react';
export { render };
