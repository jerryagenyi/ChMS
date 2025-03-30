import { ButtonProps } from '@chakra-ui/react';

export interface CheckInButtonProps extends Omit<ButtonProps, 'onClick'> {
  onCheckIn: () => Promise<void>;
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export interface CheckInButtonState {
  isCheckingIn: boolean;
  error: Error | null;
} 