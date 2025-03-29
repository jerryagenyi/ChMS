import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  occupation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  status: 'active' | 'inactive' | 'deceased';
  familyId?: string;
  familyRole?: 'head' | 'spouse' | 'child' | 'other';
  baptismDate?: string;
  confirmationDate?: string;
  membershipDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface MemberState {
  // State
  recentMembers: Member[];
  searchHistory: string[];
  selectedMember: Member | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search?: string;
    status?: 'active' | 'inactive' | 'deceased';
    gender?: 'male' | 'female' | 'other';
  };

  // Actions
  setRecentMembers: (members: Member[]) => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  setSelectedMember: (member: Member | null) => void;
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  setFilters: (filters: Partial<MemberState['filters']>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: MemberState = {
  recentMembers: [],
  searchHistory: [],
  selectedMember: null,
  isLoading: false,
  error: null,
  filters: {},
};

export const createMemberStore = create<MemberState>()(
  devtools(
    (set) => ({
      ...initialState,

      setRecentMembers: (members) =>
        set({ recentMembers: members }, false, 'member/setRecentMembers'),

      addMember: (member) =>
        set(
          (state) => ({
            recentMembers: [member, ...state.recentMembers].slice(0, 50),
          }),
          false,
          'member/addMember'
        ),

      updateMember: (id, member) =>
        set(
          (state) => {
            const index = state.recentMembers.findIndex((m) => m.id === id);
            if (index === -1) return state;

            const newMembers = [...state.recentMembers];
            newMembers[index] = { ...newMembers[index], ...member };

            return {
              recentMembers: newMembers,
              selectedMember:
                state.selectedMember?.id === id
                  ? { ...state.selectedMember, ...member }
                  : state.selectedMember,
            };
          },
          false,
          'member/updateMember'
        ),

      deleteMember: (id) =>
        set(
          (state) => ({
            recentMembers: state.recentMembers.filter((m) => m.id !== id),
            selectedMember: state.selectedMember?.id === id ? null : state.selectedMember,
          }),
          false,
          'member/deleteMember'
        ),

      setSelectedMember: (member) =>
        set({ selectedMember: member }, false, 'member/setSelectedMember'),

      addSearchHistory: (query) =>
        set(
          (state) => ({
            searchHistory: [
              query,
              ...state.searchHistory.filter((q) => q !== query),
            ].slice(0, 10),
          }),
          false,
          'member/addSearchHistory'
        ),

      clearSearchHistory: () =>
        set({ searchHistory: [] }, false, 'member/clearSearchHistory'),

      setFilters: (filters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...filters },
          }),
          false,
          'member/setFilters'
        ),

      setLoading: (isLoading) => set({ isLoading }, false, 'member/setLoading'),

      setError: (error) => set({ error }, false, 'member/setError'),

      reset: () => set(initialState, false, 'member/reset'),
    }),
    {
      name: 'member-store',
    }
  )
); 