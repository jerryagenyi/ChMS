import { prisma } from './prisma';

export const db = {
  // Attendance operations
  attendance: {
    create: async (data: AttendanceCreate) => {
      return prisma.attendance.create({ data });
    },
    findMany: async (params: AttendanceFindMany) => {
      return prisma.attendance.findMany(params);
    },
    findById: async (id: string) => {
      return prisma.attendance.findUnique({ where: { id } });
    },
    update: async (id: string, data: AttendanceUpdate) => {
      return prisma.attendance.update({ where: { id }, data });
    },
    delete: async (id: string) => {
      return prisma.attendance.delete({ where: { id } });
    },
  },

  // Member operations
  members: {
    create: async (data: MemberCreate) => {
      return prisma.member.create({ data });
    },
    findMany: async (params: MemberFindMany) => {
      return prisma.member.findMany(params);
    },
    findById: async (id: string) => {
      return prisma.member.findUnique({ where: { id } });
    },
    update: async (id: string, data: MemberUpdate) => {
      return prisma.member.update({ where: { id }, data });
    },
    delete: async (id: string) => {
      return prisma.member.delete({ where: { id } });
    },
  },

  // Service operations
  services: {
    create: async (data: ServiceCreate) => {
      return prisma.service.create({ data });
    },
    findMany: async (params: ServiceFindMany) => {
      return prisma.service.findMany(params);
    },
    findById: async (id: string) => {
      return prisma.service.findUnique({ where: { id } });
    },
    update: async (id: string, data: ServiceUpdate) => {
      return prisma.service.update({ where: { id }, data });
    },
    delete: async (id: string) => {
      return prisma.service.delete({ where: { id } });
    },
  },

  // Organization operations
  organization: {
    findFirst: async () => {
      return prisma.organization.findFirst();
    },
    update: async (data: OrganizationUpdate) => {
      return prisma.organization.update({ data });
    },
  },
}; 