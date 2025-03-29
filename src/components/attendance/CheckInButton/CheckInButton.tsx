import React, { useState } from 'react';
import { Button, Text, VStack } from '@chakra-ui/react';
import { CheckInButtonProps, CheckInButtonState } from './types';

export const CheckInButton: React.FC<CheckInButtonProps> = ({
  onCheckIn,
  isLoading = false,
  isDisabled = false,
  variant = 'solid',
  size = 'md',
  children = 'Check In',
  ...buttonProps
}) => {
  const [state, setState] = useState<CheckInButtonState>({
    isCheckingIn: false,
    error: null,
  });

  const handleCheckIn = async () => {
    try {
      setState(prev => ({ ...prev, isCheckingIn: true, error: null }));
      await onCheckIn();
      setState(prev => ({ ...prev, isCheckingIn: false }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check in');
      setState(prev => ({ ...prev, error, isCheckingIn: false }));
    }
  };

  return (
    <VStack spacing={2}>
      <Button
        onClick={handleCheckIn}
        isLoading={isLoading || state.isCheckingIn}
        isDisabled={isDisabled || state.isCheckingIn}
        variant={variant}
        size={size}
        colorScheme="blue"
        loadingText="Checking in..."
        {...buttonProps}
      >
        {children}
      </Button>
      {state.error && (
        <Text color="red.500" fontSize="sm">
          {state.error.message}
        </Text>
      )}
    </VStack>
  );
};

export default CheckInButton;
