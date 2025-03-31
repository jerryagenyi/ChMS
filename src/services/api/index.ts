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

  // Data sharing endpoints
  share: {
    export: {
      attendance: (params: ExportParams) => get<ExportData>('/share/export/attendance', params),
      services: (params: ExportParams) => get<ExportData>('/share/export/services', params),
      members: (params: ExportParams) => get<ExportData>('/share/export/members', params),
    },
    import: {
      attendance: (data: ImportData) => post<ImportResult>('/share/import/attendance', data),
      services: (data: ImportData) => post<ImportResult>('/share/import/services', data),
      members: (data: ImportData) => post<ImportResult>('/share/import/members', data),
    },
    apiKeys: {
      create: (data: ApiKeyCreate) => post<ApiKey>('/share/integrations/api-keys', data),
      list: () => get<ApiKey[]>('/share/integrations/api-keys'),
      revoke: (id: string) => del<void>(`/share/integrations/api-keys/${id}`),
    },
    webhooks: {
      register: (data: WebhookRegistration) => post<Webhook>('/share/integrations/webhooks', data),
      list: () => get<Webhook[]>('/share/integrations/webhooks'),
      update: (id: string, data: WebhookUpdate) => put<Webhook>(`/share/integrations/webhooks/${id}`, data),
      delete: (id: string) => del<void>(`/share/integrations/webhooks/${id}`),
    },
  },
}; 
