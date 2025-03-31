'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { theme } from '@/theme';

interface ProvidersProps {
  children: React.ReactNode;
  session: any; // We'll type this properly once we have the session type
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </CacheProvider>
    </SessionProvider>
  );
}