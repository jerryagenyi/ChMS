import { ReactNode, ReactElement } from 'react';

interface LoadingStateProps {
  isLoading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function LoadingState({ isLoading, children, fallback }: LoadingStateProps): ReactElement {
  if (isLoading) {
    return (
      (fallback as ReactElement) || (
        <div className="loading-state-container">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading...</span>
        </div>
      )
    );
  }

  return <>{children}</>;
}
