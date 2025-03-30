export interface PageTransitionProps {
  children: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  onRetry?: () => void;
  transition?: "fade" | "slide" | "scale";
  duration?: number;
}

export interface PageTransitionState {
  isEntering: boolean;
  isExiting: boolean;
  hasError: boolean;
} 