import { useState, useEffect } from 'react';
import { AttendanceRecord, UseAttendanceStoreReturn } from '../types';

const STORAGE_KEY = 'attendance_records';

export const useAttendanceStore = (): UseAttendanceStoreReturn => {
  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  }, [records]);

  const addRecord = (record: AttendanceRecord) => {
    setRecords(prev => [...prev, record]);
  };

  const updateRecord = (id: string, updates: Partial<AttendanceRecord>) => {
    setRecords(prev =>
      prev.map(record =>
        record.id === id ? { ...record, ...updates } : record
      )
    );
  };

  const getUnsynced = () => {
    return records.filter(record => !record.synced);
  };

  const clearSyncError = () => {
    setRecords(prev =>
      prev.map(record => ({
        ...record,
        syncError: undefined,
        retryCount: record.synced ? record.retryCount : 0,
      }))
    );
  };

  return {
    records,
    addRecord,
    updateRecord,
    getUnsynced,
    clearSyncError,
  };
}; 