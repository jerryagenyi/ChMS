import { BoxProps, StatProps } from '@chakra-ui/react';

export interface AttendanceStatsProps {
  totalAttendance: number;
  uniqueMembers: number;
  averageAttendance: number;
  peakAttendance: number;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  onRefresh?: () => Promise<void>;
  containerProps?: BoxProps;
  statProps?: StatProps;
}

export interface AttendanceStatsState {
  isRefreshing: boolean;
  error: Error | null;
}

export interface StatCardProps extends StatProps {
  label: string;
  value: number | string;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
} 