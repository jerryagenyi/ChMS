export interface LoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string | number;
  overlay?: boolean;
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  spinnerColor?: string;
  spinnerThickness?: string;
  spinnerSpeed?: string;
  spinnerLabel?: string;
} 