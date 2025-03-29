import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Button, Icon, useColorModeValue } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import { OfflineFallbackProps, OfflineFallbackState } from './types';

export const OfflineFallback: React.FC<OfflineFallbackProps> = ({
  children,
  fallback,
  onRetry,
  retryLabel = 'Retry',
  message = 'You are currently offline. Please check your internet connection.',
  icon,
}) => {
  const [state, setState] = useState<OfflineFallbackState>({
    isOffline: !navigator.onLine,
    lastOnline: null,
  });

  useEffect(() => {
    const handleOnline = () => {
      setState({
        isOffline: false,
        lastOnline: new Date(),
      });
    };

    const handleOffline = () => {
      setState({
        isOffline: true,
        lastOnline: state.lastOnline,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [state.lastOnline]);

  const bgColor = useColorModeValue('yellow.50', 'yellow.900');
  const textColor = useColorModeValue('yellow.800', 'yellow.200');
  const borderColor = useColorModeValue('yellow.200', 'yellow.700');

  if (!state.isOffline) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={6}
      textAlign="center"
    >
      <VStack spacing={4}>
        {icon || <Icon as={WarningIcon} w={8} h={8} color={textColor} />}
        <Text color={textColor} fontSize="md">
          {message}
        </Text>
        {onRetry && (
          <Button colorScheme="yellow" variant="outline" onClick={onRetry} size="sm">
            {retryLabel}
          </Button>
        )}
      </VStack>
    </Box>
  );
};
