export interface Service {
  id: string;
  name: string;
  type: "SUNDAY" | "WEDNESDAY";
  date: Date;
  description?: string;
  isActive: boolean;
}

export interface ServiceSelectorProps {
  services: Service[];
  selectedServiceId?: string;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  onSelect?: (serviceId: string) => void;
  onRefresh?: () => void;
  includeInactive?: boolean;
  showDescription?: boolean;
}

export interface ServiceSelectorState {
  searchQuery: string;
  selectedType?: "SUNDAY" | "WEDNESDAY";
  sortBy: "date" | "name";
  sortOrder: "asc" | "desc";
} 