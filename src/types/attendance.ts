import { Prisma } from '@prisma/client';

export type AttendanceCreate = {
  memberId: string;
  classId?: string;
  sessionId?: string;
  organizationId: string;
  date: Date;
};

export type AttendanceFindMany = {
  where?: Prisma.AttendanceWhereInput;
  include?: Prisma.AttendanceInclude;
  orderBy?: Prisma.AttendanceOrderByWithRelationInput;
};

export type AttendanceUpdate = Partial<Omit<AttendanceCreate, 'organizationId'>>;

export type CheckInData = {
  memberId: string;
  classId?: string;
  sessionId?: string;
  isFamily?: boolean;
};
