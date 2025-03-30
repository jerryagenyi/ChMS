import { TableProps, TableContainerProps } from '@chakra-ui/react';

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  serviceId: string;
  serviceName: string;
  location: string;
  timestamp: Date;
  notes?: string;
}

export interface AttendanceListProps {
  records: AttendanceRecord[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  onRefresh?: () => Promise<void>;
  onFilterChange?: (filters: AttendanceFilters) => void;
  onSortChange?: (sort: AttendanceSort) => void;
  tableProps?: TableProps;
  containerProps?: TableContainerProps;
}

export interface AttendanceFilters {
  serviceId?: string;
  location?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

export interface AttendanceSort {
  field: keyof AttendanceRecord;
  direction: 'asc' | 'desc';
}

export interface AttendanceListState {
  filters: AttendanceFilters;
  sort: AttendanceSort;
  page: number;
  pageSize: number;
} 