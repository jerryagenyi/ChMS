import { get, post, put, del } from './api';

export const api = {
  // Attendance endpoints
  attendance: {
    checkIn: (data: CheckInData) => post<Attendance>('/attendance/check-in', data),
    getReport: (params: ReportParams) => get<AttendanceReport>('/attendance/report', params),
    getStats: () => get<AttendanceStats>('/attendance/stats'),
  },

  // Member endpoints
  members: {
    register: (data: MemberRegistration) => post<Member>('/members/register', data),
    getById: (id: string) => get<Member>(`/members/${id}`),
    update: (id: string, data: MemberUpdate) => put<Member>(`/members/${id}`, data),
    delete: (id: string) => del<void>(`/members/${id}`),
  },

  // Service endpoints
  services: {
    create: (data: ServiceCreate) => post<Service>('/services', data),
    getAll: () => get<Service[]>('/services'),
    getById: (id: string) => get<Service>(`/services/${id}`),
    update: (id: string, data: ServiceUpdate) => put<Service>(`/services/${id}`, data),
    delete: (id: string) => del<void>(`/services/${id}`),
  },

  // Organization endpoints
  organization: {
    getCurrent: () => get<Organization>('/organization/current'),
    update: (data: OrganizationUpdate) => put<Organization>('/organization', data),
  },
}; 