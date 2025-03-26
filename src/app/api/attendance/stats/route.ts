import { NextResponse } from 'next/server';
import { validate } from '@/middleware/validate';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

const statsSchema = z.object({
  query: z.object({
    classId: z.string().uuid().optional(),
    months: z.number().min(1).max(12).default(3),
  }),
});

export const GET = validate(statsSchema, async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const months = parseInt(searchParams.get('months') || '3');

    // Get date range
    const endDate = endOfMonth(new Date());
    const startDate = startOfMonth(subMonths(endDate, months - 1));

    // Build where clause
    const where = {
      organisationId: session.user.organisationId,
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(classId && { classId }),
    };

    // Get total attendance records
    const totalAttendance = await prisma.attendance.count({ where });

    // Get attendance by status
    const attendanceByStatus = await prisma.attendance.groupBy({
      by: ['status'],
      where,
      _count: true,
    });

    // Get monthly attendance trends
    const monthlyTrends = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', date) as month,
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'PRESENT' THEN 1 END) as present,
        COUNT(CASE WHEN status = 'ABSENT' THEN 1 END) as absent,
        COUNT(CASE WHEN status = 'LATE' THEN 1 END) as late
      FROM "Attendance"
      WHERE ${where}
      GROUP BY DATE_TRUNC('month', date)
      ORDER BY month ASC
    `;

    // Get top members by attendance
    const topMembers = await prisma.attendance.groupBy({
      by: ['memberId'],
      where: {
        ...where,
        status: 'PRESENT',
      },
      _count: true,
      orderBy: {
        _count: {
          memberId: 'desc',
        },
      },
      take: 5,
    });

    // Get member details for top members
    const memberIds = topMembers.map(m => m.memberId);
    const members = await prisma.member.findMany({
      where: {
        id: { in: memberIds },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    const topMembersWithDetails = topMembers.map(member => ({
      ...member,
      member: members.find(m => m.id === member.memberId),
    }));

    return NextResponse.json({
      data: {
        totalAttendance,
        attendanceByStatus,
        monthlyTrends,
        topMembers: topMembersWithDetails,
        dateRange: {
          start: format(startDate, 'yyyy-MM-dd'),
          end: format(endDate, 'yyyy-MM-dd'),
        },
      },
    });
  } catch (error) {
    logger.error('Failed to fetch attendance stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance statistics' },
      { status: 500 }
    );
  }
}); 