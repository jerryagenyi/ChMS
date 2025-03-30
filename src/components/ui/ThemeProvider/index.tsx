import { ReactNode } from 'react';
import theme from '@/theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
