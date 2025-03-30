export interface OfflineFallbackProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  message?: string;
  icon?: React.ReactNode;
}

export interface OfflineFallbackState {
  isOffline: boolean;
  lastOnline: Date | null;
} 