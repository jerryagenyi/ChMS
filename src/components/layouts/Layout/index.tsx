import { Box, Container, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  showMinistryNav?: boolean;
  ministryUnitId?: string;
}

export function Layout({ children, showMinistryNav = false, ministryUnitId }: LayoutProps) {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar showMinistryNav={showMinistryNav} activeUnitId={ministryUnitId} />
      <Box flex="1">
        <Header />
        <Container maxW="container.xl" py={8}>
          {children}
        </Container>
      </Box>
    </Flex>
  );
}
