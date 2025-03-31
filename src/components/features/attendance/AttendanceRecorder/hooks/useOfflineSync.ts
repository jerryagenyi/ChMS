import { useState, useEffect, useCallback, useRef } from 'react';
import { UseOfflineSyncOptions, SyncStatus, AttendanceRecord } from '../types';

const DEFAULT_SYNC_INTERVAL = 30000; // 30 seconds
const DEFAULT_MAX_RETRIES = 3;

export const useOfflineSync = ({
  onSync,
  syncInterval = DEFAULT_SYNC_INTERVAL,
  maxRetries = DEFAULT_MAX_RETRIES,
}: UseOfflineSyncOptions) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isSyncing: false,
    pendingRecords: 0,
  });

  const syncTimeoutRef = useRef<NodeJS.Timeout>();
  const isOnlineRef = useRef(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const updateSyncStatus = useCallback((updates: Partial<SyncStatus>) => {
    setSyncStatus(prev => ({
      ...prev,
      ...updates,
      lastSyncTime: updates.isSyncing ? prev.lastSyncTime : new Date().toISOString(),
    }));
  }, []);

  const syncRecords = useCallback(async (records: AttendanceRecord[]) => {
    if (!records.length || !isOnlineRef.current) return;

    updateSyncStatus({ isSyncing: true, error: undefined });

    try {
      await onSync(records);
      updateSyncStatus({
        isSyncing: false,
        pendingRecords: 0,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      updateSyncStatus({
        isSyncing: false,
        error: errorMessage,
      });
    }
  }, [onSync, updateSyncStatus]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      isOnlineRef.current = true;
      // Trigger immediate sync when coming online
      syncTimeoutRef.current && clearTimeout(syncTimeoutRef.current);
      syncRecords([]);
    };

    const handleOffline = () => {
      isOnlineRef.current = false;
      syncTimeoutRef.current && clearTimeout(syncTimeoutRef.current);
      updateSyncStatus({ error: 'Device is offline' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncRecords, updateSyncStatus]);

  // Set up periodic sync
  useEffect(() => {
    const scheduleSyncTimeout = () => {
      syncTimeoutRef.current = setTimeout(() => {
        if (isOnlineRef.current) {
          syncRecords([]);
        }
        scheduleSyncTimeout();
      }, syncInterval);
    };

    scheduleSyncTimeout();

    return () => {
      syncTimeoutRef.current && clearTimeout(syncTimeoutRef.current);
    };
  }, [syncInterval, syncRecords]);

  const shouldRetry = useCallback((record: AttendanceRecord) => {
    return !record.synced && (!record.retryCount || record.retryCount < maxRetries);
  }, [maxRetries]);

  return {
    syncStatus,
    syncRecords,
    shouldRetry,
    isOnline: isOnlineRef.current,
  };
}; 