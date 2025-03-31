import { NextResponse } from 'next/server';
import { validate } from '@/middleware/validate';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';
import { logger } from '@/lib/logger';
import { startOfMonth, endOfMonth, format } from 'date-fns';

const reportSchema = z.object({
  query: z.object({
    classId: z.string().uuid().optional(),
    month: z.string().regex(/^\d{4}-\d{2}$/),
  }),
});

export const GET = validate(reportSchema, async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const month = searchParams.get('month') || format(new Date(), 'yyyy-MM');

    // Parse month
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = startOfMonth(new Date(year, monthNum - 1));
    const endDate = endOfMonth(startDate);

    // Build where clause
    const where = {
      organizationId: session.user.organizationId,
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(classId && { classId }),
    };

    // Get class details if classId is provided
    let classDetails = null;
    if (classId) {
      classDetails = await prisma.class.findUnique({
        where: { id: classId },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });
    }

    // Get all members who should have attendance records
    const members = await prisma.member.findMany({
      where: {
        organizationId: session.user.organizationId,
        ...(classId && {
          memberClasses: {
            some: {
              classId,
            },
          },
        }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    // Get attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      where,
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Calculate attendance statistics for each member
    const memberStats = members.map(member => {
      const memberAttendance = attendanceRecords.filter(
        record => record.memberId === member.id
      );

      const totalDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const present = memberAttendance.filter(
        record => record.status === 'PRESENT'
      ).length;

      const absent = memberAttendance.filter(
        record => record.status === 'ABSENT'
      ).length;

      const late = memberAttendance.filter(
        record => record.status === 'LATE'
      ).length;

      const attendancePercentage = (present / totalDays) * 100;

      return {
        member,
        stats: {
          totalDays,
          present,
          absent,
          late,
          attendancePercentage,
        },
        attendance: memberAttendance,
      };
    });

    // Calculate overall statistics
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPresent = attendanceRecords.filter(
      record => record.status === 'PRESENT'
    ).length;
    const totalAbsent = attendanceRecords.filter(
      record => record.status === 'ABSENT'
    ).length;
    const totalLate = attendanceRecords.filter(
      record => record.status === 'LATE'
    ).length;

    const overallStats = {
      totalDays,
      totalPresent,
      totalAbsent,
      totalLate,
      averageAttendance: (totalPresent / (totalDays * members.length)) * 100,
    };

    return NextResponse.json({
      data: {
        class: classDetails,
        month: format(startDate, 'MMMM yyyy'),
        members: memberStats,
        overallStats,
      },
    });
  } catch (error) {
    logger.error('Failed to generate attendance report:', error);
    return NextResponse.json(
      { error: 'Failed to generate attendance report' },
      { status: 500 }
    );
  }
}); 
