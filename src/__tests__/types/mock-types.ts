import { Prisma } from '@prisma/client';

export type MockAttendance = Prisma.AttendanceGetPayload<{
  include: {
    member: true;
    service: true;
  };
}>;

export type MockMember = Prisma.MemberGetPayload<{
  include: {
    attendances: true;
    organization: true;
  };
}>;

export type MockService = Prisma.ServiceGetPayload<{
  include: {
    attendances: true;
    organization: true;
  };
}>;

export type MockOrganization = Prisma.OrganizationGetPayload<{
  include: {
    members: true;
    services: true;
  };
}>;