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
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )
    );
  }

  return <>{children}</>;
}
