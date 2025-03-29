import { ReactNode, ReactElement } from 'react';

interface OfflineFallbackProps {
  isOffline: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function OfflineFallback({
  isOffline,
  children,
  fallback,
}: OfflineFallbackProps): ReactElement {
  if (isOffline) {
    return (
      (fallback as ReactElement) || (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h2 className="text-yellow-800 font-semibold">You're offline</h2>
          <p className="text-yellow-600 mt-2">
            Please check your internet connection and try again.
          </p>
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
