import { prisma } from '@/lib/prisma';

export interface CheckInData {
  memberId: string;
  serviceId: string;
  isFamily?: boolean;
}

export async function checkInMember(data: CheckInData) {
  return await prisma.attendance.create({
    data: {
      memberId: data.memberId,
      serviceId: data.serviceId,
      isFamily: data.isFamily || false
    },
    include: {
      member: true,
      service: true
    }
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
      service: true
    }
  });
}

export async function getAttendance(serviceId: string) {
  return await prisma.attendance.findMany({
    where: {
      serviceId
    },
    include: {
      member: true
    },
    orderBy: {
      checkedInAt: 'desc'
    }
  });
}

export async function getAttendanceStats(serviceId: string) {
  const attendance = await prisma.attendance.findMany({
    where: {
      serviceId
    },
    include: {
      member: {
        include: {
          teams: {
            include: {
              team: {
                include: {
                  department: true
                }
              }
            }
          }
        }
      }
    }
  });

  const stats = {
    totalAttendees: attendance.length,
    newVisitors: attendance.filter(a => !a.member.teams.length).length,
    departments: [] as { name: string; count: number }[]
  };

  const departmentCounts = new Map<string, number>();
  attendance.forEach(a => {
    a.member.teams.forEach(mt => {
      const deptName = mt.team.department.name;
      departmentCounts.set(deptName, (departmentCounts.get(deptName) || 0) + 1);
    });
  });

  stats.departments = Array.from(departmentCounts.entries()).map(([name, count]) => ({
    name,
    count
  }));

  return stats;
}