import { Prisma } from '@prisma/client';

// Base types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Attendance types
export interface Attendance extends BaseEntity {
  memberId: string;
  serviceId: string;
  organizationId: string;
  timestamp: Date;
  type: 'CHECK_IN' | 'CHECK_OUT';
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  notes?: string;
}

export interface AttendanceCreate extends Omit<Attendance, keyof BaseEntity> {}
export interface AttendanceUpdate extends Partial<AttendanceCreate> {}
export interface AttendanceFindMany extends Prisma.AttendanceFindManyArgs {}

export interface CheckInData {
  memberId: string;
  serviceId: string;
  type: 'CHECK_IN' | 'CHECK_OUT';
  notes?: string;
}

export interface ReportParams {
  serviceId: string;
  startDate: Date;
  endDate: Date;
}

export interface AttendanceReport {
  total: number;
  present: number;
  absent: number;
  late: number;
  attendance: Attendance[];
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  byService: Record<string, {
    total: number;
    present: number;
    absent: number;
    late: number;
  }>;
}

// Member types
export interface Member extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organizationId: string;
  status: 'ACTIVE' | 'INACTIVE';
  role: 'ADMIN' | 'MEMBER' | 'GUEST';
}

export interface MemberCreate extends Omit<Member, keyof BaseEntity> {}
export interface MemberUpdate extends Partial<MemberCreate> {}
export interface MemberFindMany extends Prisma.MemberFindManyArgs {}
export interface MemberRegistration extends Omit<MemberCreate, 'organizationId'> {}

// Service types
export interface Service extends BaseEntity {
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  organizationId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  type: 'SUNDAY_SERVICE' | 'WEDNESDAY_SERVICE' | 'SPECIAL';
}

export interface ServiceCreate extends Omit<Service, keyof BaseEntity> {}
export interface ServiceUpdate extends Partial<ServiceCreate> {}
export interface ServiceFindMany extends Prisma.ServiceFindManyArgs {}

// Organization types
export interface Organization extends BaseEntity {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  settings: Record<string, any>;
}

export interface OrganizationUpdate extends Partial<Omit<Organization, keyof BaseEntity>> {}

// Error types
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export class ValidationError extends ServiceError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class NotFoundError extends ServiceError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
  }
}

export class UnauthorizedError extends ServiceError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends ServiceError {
  constructor(message: string) {
    super(message, 'FORBIDDEN', 403);
  }
} 