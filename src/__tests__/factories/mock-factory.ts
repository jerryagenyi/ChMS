import { MockAttendance, MockMember, MockService, MockOrganization } from '../types/mock-types';

export const createMockMember = (override = {}): MockMember => ({
  id: 'member-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  organizationId: 'org-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  attendances: [],
  organization: createMockOrganization(),
  ...override,
});

export const createMockService = (override = {}): MockService => ({
  id: 'service-1',
  name: 'Sunday Service',
  startTime: new Date(),
  endTime: new Date(),
  organizationId: 'org-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  attendances: [],
  organization: createMockOrganization(),
  ...override,
});

export const createMockAttendance = (override = {}): MockAttendance => ({
  id: 'attendance-1',
  memberId: 'member-1',
  serviceId: 'service-1',
  date: new Date(),
  status: 'PRESENT',
  createdAt: new Date(),
  updatedAt: new Date(),
  member: createMockMember(),
  service: createMockService(),
  ...override,
});

export const createMockOrganization = (override = {}): MockOrganization => ({
  id: 'org-1',
  name: 'Test Church',
  createdAt: new Date(),
  updatedAt: new Date(),
  members: [],
  services: [],
  ...override,
});