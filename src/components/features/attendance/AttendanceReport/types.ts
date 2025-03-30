import { AttendanceData } from "@/types/attendance";

export interface AttendanceReportProps {
  data: {
    date: string;
    totalAttendance: number;
    uniqueMembers: number;
    averageAttendance: number;
    peakAttendance: number;
    serviceType: string;
    notes?: string;
  }[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  onRefresh?: () => void;
  onExport?: () => void;
  onFilterChange?: (filters: AttendanceFilters) => void;
}

export interface AttendanceFilters {
  startDate?: string;
  endDate?: string;
  serviceType?: string;
  minAttendance?: number;
  maxAttendance?: number;
}

export interface AttendanceReportState {
  isRefreshing: boolean;
  error: Error | null;
  filters: AttendanceFilters;
  sortConfig: {
    key: keyof AttendanceReportProps['data'][0] | null;
    direction: 'asc' | 'desc';
  };
}

export interface AttendanceSummary {
  totalAttendance: number;
  uniqueMembers: number;
  averageAttendance: number;
  peakAttendance: number;
  attendanceByService: Record<string, number>;
  attendanceByMemberType: Record<string, number>;
  attendanceByStatus: Record<string, number>;
}

export interface AttendanceTrend {
  date: Date;
  count: number;
  percentage: number;
} 