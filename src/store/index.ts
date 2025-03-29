import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createAttendanceStore } from './attendanceStore';
import { createMemberStore } from './memberStore';
import { createServiceStore } from './serviceStore';

export const useStore = create(
  persist(
    (...args) => ({
      ...createAttendanceStore(...args),
      ...createMemberStore(...args),
      ...createServiceStore(...args),
    }),
    {
      name: 'chms-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        attendance: {
          recentRecords: state.attendance.recentRecords,
          stats: state.attendance.stats,
        },
        members: {
          recentMembers: state.members.recentMembers,
          searchHistory: state.members.searchHistory,
        },
        services: {
          upcomingServices: state.services.upcomingServices,
          recentServices: state.services.recentServices,
        },
      }),
    }
  )
);

// Export individual stores for better code splitting
export const useAttendanceStore = (selector: any) => useStore((state) => selector(state.attendance));
export const useMemberStore = (selector: any) => useStore((state) => selector(state.members));
export const useServiceStore = (selector: any) => useStore((state) => selector(state.services)); 