import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Box, useToast } from '@chakra-ui/react';
import { AttendanceRecorderProps, AttendanceRecord } from './types';
import { useAttendanceStore } from './hooks/useAttendanceStore';
import { useOfflineSync } from './hooks/useOfflineSync';
import AttendanceContext from './context/AttendanceContext';
import { CheckInFormData } from '../CheckInForm/types';

export const AttendanceRecorder: React.FC<AttendanceRecorderProps> = ({
  children,
  onSync,
  syncInterval,
  maxRetries,
}) => {
  const toast = useToast();
  const { records, addRecord, updateRecord, getUnsynced, clearSyncError } = useAttendanceStore();

  const { syncStatus, syncRecords, shouldRetry, isOnline } = useOfflineSync({
    onSync: async records => {
      if (!onSync) return;
      await onSync(records);
      records.forEach(record => {
        updateRecord(record.id, { synced: true });
      });
    },
    syncInterval,
    maxRetries,
  });

  const handleAddRecord = useCallback(
    async (data: CheckInFormData) => {
      const newRecord: AttendanceRecord = {
        ...data,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        synced: false,
        retryCount: 0,
      };

      addRecord(newRecord);

      toast({
        title: 'Attendance recorded',
        description: isOnline ? 'Syncing...' : 'Will sync when online',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      if (isOnline) {
        const unsynced = [newRecord, ...getUnsynced()];
        await syncRecords(unsynced.filter(shouldRetry));
      }
    },
    [addRecord, getUnsynced, isOnline, shouldRetry, syncRecords, toast]
  );

  const handleRetrySync = useCallback(async () => {
    const unsynced = getUnsynced();
    if (!unsynced.length) return;

    toast({
      title: 'Retrying sync',
      description: `Attempting to sync ${unsynced.length} records`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });

    await syncRecords(unsynced.filter(shouldRetry));
  }, [getUnsynced, shouldRetry, syncRecords, toast]);

  const contextValue = {
    records,
    syncStatus,
    addRecord: handleAddRecord,
    retrySync: handleRetrySync,
    clearSyncError,
  };

  return (
    <AttendanceContext.Provider value={contextValue}>
      <Box position="relative">{children}</Box>
    </AttendanceContext.Provider>
  );
};

export { useAttendance } from './context/AttendanceContext';
export type { AttendanceRecord, AttendanceRecorderProps } from './types';
