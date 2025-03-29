import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface RecurrencePattern {
  frequency: 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  endDate?: string;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'sunday' | 'wednesday' | 'special';
  location?: string;
  notes?: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  attendance: {
    id: string;
    memberId: string;
    status: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ServiceState {
  // State
  upcomingServices: Service[];
  recentServices: Service[];
  selectedService: Service | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search?: string;
    type?: 'sunday' | 'wednesday' | 'special';
    startDate?: string;
    endDate?: string;
    isRecurring?: boolean;
  };

  // Actions
  setUpcomingServices: (services: Service[]) => void;
  setRecentServices: (services: Service[]) => void;
  addService: (service: Service) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  setSelectedService: (service: Service | null) => void;
  setFilters: (filters: Partial<ServiceState['filters']>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: ServiceState = {
  upcomingServices: [],
  recentServices: [],
  selectedService: null,
  isLoading: false,
  error: null,
  filters: {},
};

export const createServiceStore = create<ServiceState>()(
  devtools(
    (set) => ({
      ...initialState,

      setUpcomingServices: (services) =>
        set({ upcomingServices: services }, false, 'service/setUpcomingServices'),

      setRecentServices: (services) =>
        set({ recentServices: services }, false, 'service/setRecentServices'),

      addService: (service) =>
        set(
          (state) => {
            const now = new Date();
            const serviceDate = new Date(service.date);
            const isUpcoming = serviceDate > now;

            return {
              upcomingServices: isUpcoming
                ? [service, ...state.upcomingServices].slice(0, 50)
                : state.upcomingServices,
              recentServices: [service, ...state.recentServices].slice(0, 50),
            };
          },
          false,
          'service/addService'
        ),

      updateService: (id, service) =>
        set(
          (state) => {
            const now = new Date();
            const serviceDate = new Date(service.date || state.selectedService?.date || '');
            const isUpcoming = serviceDate > now;

            const updateServiceInList = (services: Service[]) => {
              const index = services.findIndex((s) => s.id === id);
              if (index === -1) return services;

              const newServices = [...services];
              newServices[index] = { ...newServices[index], ...service };
              return newServices;
            };

            return {
              upcomingServices: isUpcoming
                ? updateServiceInList(state.upcomingServices)
                : state.upcomingServices.filter((s) => s.id !== id),
              recentServices: updateServiceInList(state.recentServices),
              selectedService:
                state.selectedService?.id === id
                  ? { ...state.selectedService, ...service }
                  : state.selectedService,
            };
          },
          false,
          'service/updateService'
        ),

      deleteService: (id) =>
        set(
          (state) => ({
            upcomingServices: state.upcomingServices.filter((s) => s.id !== id),
            recentServices: state.recentServices.filter((s) => s.id !== id),
            selectedService: state.selectedService?.id === id ? null : state.selectedService,
          }),
          false,
          'service/deleteService'
        ),

      setSelectedService: (service) =>
        set({ selectedService: service }, false, 'service/setSelectedService'),

      setFilters: (filters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...filters },
          }),
          false,
          'service/setFilters'
        ),

      setLoading: (isLoading) => set({ isLoading }, false, 'service/setLoading'),

      setError: (error) => set({ error }, false, 'service/setError'),

      reset: () => set(initialState, false, 'service/reset'),
    }),
    {
      name: 'service-store',
    }
  )
); 