import { prisma } from '@/lib/prisma';
import type { CheckInData } from '@/types/attendance';
import { getCurrentOrganizationId } from '@/lib/organization';
import { validateCheckIn } from '@/services/attendance/validation';

export async function checkInMember(data: CheckInData) {
  const validated = await validateCheckIn(data);
  
  return await prisma.attendance.create({
    data: {
      ...validated,
      checkedInAt: new Date(),
      organizationId: await getCurrentOrganizationId(),
    },
    include: {
      member: true,
      class: true,
      classSession: true,
    },
  });
}

export async function checkOutMember(attendanceId: string) {
  return await prisma.attendance.update({
    where: { id: attendanceId },
    data: {
      checkedOutAt: new Date()
    },
    include: {
      member: true,
      class: true,
      classSession: true,
    }
  });
}

export async function getAttendance(serviceId: string) {
  return await prisma.attendance.findMany({
    where: {
      serviceId
    },
    include: {
      member: true,
      class: true,
      classSession: true,
    },
    orderBy: {
      checkedInAt: 'desc'
    }
  });
}

