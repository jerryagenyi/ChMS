
export interface Service {
  id: string;
  name: string;
  type: "SUNDAY" | "WEDNESDAY";
  date: Date;
  description?: string;
  isActive: boolean;
}

export interface ServiceFilters {
  search?: string;
  type?: Service['type'];
  date?: string;
  isActive?: boolean;
}

export interface ServiceSelectorProps {
  services: Service[];
  selectedServiceId?: string;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  onServiceSelect: (serviceId: string) => void;
  onRefresh?: () => void;
  onFilterChange?: (filters: ServiceFilters) => void;
}

export interface ServiceSelectorState {
  isRefreshing: boolean;
  error: Error | null;
  filters: ServiceFilters;
  sortConfig: {
    key: string | null;
    direction: 'asc' | 'desc';
  };
}
