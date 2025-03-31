import { ReactNode } from 'react';
import { CheckInFormData } from '../CheckInForm/types';

export interface AttendanceRecord extends CheckInFormData {
  id: string;
  timestamp: string;
  synced: boolean;
  syncError?: string;
  retryCount: number;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime?: string;
  pendingRecords: number;
  error?: string;
}

export interface AttendanceContextValue {
  records: AttendanceRecord[];
  syncStatus: SyncStatus;
  addRecord: (data: CheckInFormData) => Promise<void>;
  retrySync: () => Promise<void>;
  clearSyncError: () => void;
}

export interface AttendanceRecorderProps {
  children: ReactNode;
  onSync?: (records: AttendanceRecord[]) => Promise<void>;
  syncInterval?: number; // in milliseconds, defaults to 30000 (30 seconds)
  maxRetries?: number; // maximum number of sync retries, defaults to 3
}

export interface UseOfflineSyncOptions {
  onSync: (records: AttendanceRecord[]) => Promise<void>;
  syncInterval?: number;
  maxRetries?: number;
}

export interface UseAttendanceStoreReturn {
  records: AttendanceRecord[];
  addRecord: (record: AttendanceRecord) => void;
  updateRecord: (id: string, updates: Partial<AttendanceRecord>) => void;
  getUnsynced: () => AttendanceRecord[];
  clearSyncError: () => void;
} 