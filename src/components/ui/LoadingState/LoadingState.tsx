import React from 'react';
import { Box, Spinner, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { LoadingStateProps } from './types';

const DefaultFallback: React.FC<{
  size: LoadingStateProps['spinnerSize'];
  color: string;
  thickness: string;
  speed: string;
  label?: string;
}> = ({ size, color, thickness, speed, label }) => (
  <VStack spacing={4} align="center" justify="center">
    <Spinner size={size} color={color} thickness={thickness} speed={speed} label={label} />
    {label && (
      <Text fontSize="sm" color="gray.500">
        {label}
      </Text>
    )}
  </VStack>
);

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  children,
  fallback,
  minHeight = '200px',
  overlay = false,
  spinnerSize = 'xl',
  spinnerColor = 'brand.500',
  spinnerThickness = '4px',
  spinnerSpeed = '0.8s',
  spinnerLabel = 'Loading...',
}) => {
  const bgColor = useColorModeValue('whiteAlpha.800', 'blackAlpha.800');

  if (!isLoading) {
    return <>{children}</>;
  }

  const loadingContent = fallback || (
    <DefaultFallback
      size={spinnerSize}
      color={spinnerColor}
      thickness={spinnerThickness}
      speed={spinnerSpeed}
      label={spinnerLabel}
    />
  );

  if (overlay) {
    return (
      <Box position="relative" minHeight={minHeight}>
        {children}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg={bgColor}
          backdropFilter="blur(2px)"
          zIndex={1}
        >
          {loadingContent}
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight={minHeight}>
      {loadingContent}
    </Box>
  );
};
