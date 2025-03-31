import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Box,
  Center,
  Spinner,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions: string[];
}

export const PermissionGuard = ({ children, requiredPermissions }: PermissionGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <Box aria-live="polite" data-testid="permission-guard-loading">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Checking permissions...</Text>
        </VStack>
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    router.push({
      pathname: '/auth/login',
      query: { returnUrl: router.pathname },
    });
    return null;
  }

  const userPermissions = session?.user?.permissions || [];
  const hasRequiredPermissions = requiredPermissions.every(permission =>
    userPermissions.includes(permission)
  );

  if (!hasRequiredPermissions) {
    return (
      <Box aria-live="assertive" data-testid="permission-guard-denied">
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access this page. Please contact your administrator if you
            believe this is a mistake.
          </AlertDescription>
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
};
