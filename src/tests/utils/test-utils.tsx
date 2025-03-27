import React from 'react';
import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';

export function renderWithProviders(ui: React.ReactElement) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}
