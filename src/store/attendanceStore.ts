import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AttendanceRecord {
  id: string;
  serviceId: string;
  memberId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

interface AttendanceState {
  // State
  recentRecords: AttendanceRecord[];
  stats: AttendanceStats;
  isLoading: boolean;
  error: string | null;
  filters: {
    serviceId?: string;
    date?: string;
    status?: 'present' | 'absent' | 'late';
  };

  // Actions
  setRecentRecords: (records: AttendanceRecord[]) => void;
  addRecord: (record: AttendanceRecord) => void;
  updateRecord: (id: string, record: Partial<AttendanceRecord>) => void;
  deleteRecord: (id: string) => void;
  setStats: (stats: AttendanceStats) => void;
  setFilters: (filters: Partial<AttendanceState['filters']>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: AttendanceState = {
  recentRecords: [],
  stats: {
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  },
  isLoading: false,
  error: null,
  filters: {},
};

export const createAttendanceStore = create<AttendanceState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setRecentRecords: (records) =>
        set({ recentRecords: records }, false, 'attendance/setRecentRecords'),

      addRecord: (record) =>
        set(
          (state) => ({
            recentRecords: [record, ...state.recentRecords].slice(0, 50),
            stats: {
              ...state.stats,
              total: state.stats.total + 1,
              [record.status]: state.stats[record.status] + 1,
              percentage: ((state.stats.present + (record.status === 'present' ? 1 : 0)) / (state.stats.total + 1)) * 100,
            },
          }),
          false,
          'attendance/addRecord'
        ),

      updateRecord: (id, record) =>
        set(
          (state) => {
            const index = state.recentRecords.findIndex((r) => r.id === id);
            if (index === -1) return state;

            const oldRecord = state.recentRecords[index];
            const newRecord = { ...oldRecord, ...record };
            const newRecords = [...state.recentRecords];
            newRecords[index] = newRecord;

            const stats = { ...state.stats };
            if (record.status && record.status !== oldRecord.status) {
              stats[oldRecord.status]--;
              stats[record.status]++;
              stats.percentage = (stats.present / stats.total) * 100;
            }

            return {
              recentRecords: newRecords,
              stats,
            };
          },
          false,
          'attendance/updateRecord'
        ),

      deleteRecord: (id) =>
        set(
          (state) => {
            const record = state.recentRecords.find((r) => r.id === id);
            if (!record) return state;

            const newRecords = state.recentRecords.filter((r) => r.id !== id);
            const stats = { ...state.stats };
            stats.total--;
            stats[record.status]--;
            stats.percentage = (stats.present / stats.total) * 100;

            return {
              recentRecords: newRecords,
              stats,
            };
          },
          false,
          'attendance/deleteRecord'
        ),

      setStats: (stats) => set({ stats }, false, 'attendance/setStats'),

      setFilters: (filters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...filters },
          }),
          false,
          'attendance/setFilters'
        ),

      setLoading: (isLoading) => set({ isLoading }, false, 'attendance/setLoading'),

      setError: (error) => set({ error }, false, 'attendance/setError'),

      reset: () => set(initialState, false, 'attendance/reset'),
    }),
    {
      name: 'attendance-store',
    }
  )
); 