import { useState, useCallback } from 'react';

interface SyncOptions {
  maxRetries: number;
  onConflict?: (localData: unknown, serverData: unknown) => void;
}

interface SyncResult {
  sync: (preference?: 'local' | 'server') => Promise<void>;
  isSyncing: boolean;
  error: Error | null;
}

export const useDataSync = ({ maxRetries, onConflict }: SyncOptions): SyncResult => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const sync = useCallback(
    async (preference?: 'local' | 'server') => {
      setIsSyncing(true);
      setError(null);

      try {
        // Get data from IndexedDB
        const db = await window.indexedDB.open('ChMS');
        const localData = await (db as any).result.getItem('offlineData');

        const response = await fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: localData,
            preference,
          }),
        });

        if (!response.ok) {
          if (response.status === 409) {
            const { serverData } = await response.json();
            onConflict?.(localData, serverData);
            return;
          }

          throw new Error(`Sync failed: ${response.statusText}`);
        }

        // Reset retry count on successful sync
        setRetryCount(0);
      } catch (err) {
        setError(err as Error);

        // Implement retry logic
        if (retryCount < maxRetries) {
          setRetryCount((count) => count + 1);
          setTimeout(() => sync(preference), Math.pow(2, retryCount) * 1000);
        }
      } finally {
        setIsSyncing(false);
      }
    },
    [maxRetries, onConflict, retryCount]
  );

  return {
    sync,
    isSyncing,
    error,
  };
}; 