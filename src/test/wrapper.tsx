import { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

interface TestWrapperProps {
  children: ReactNode;
}

export function TestWrapper({ children }: TestWrapperProps) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
