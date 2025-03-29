import { NextResponse } from 'next/server';
import { validate } from '@/middleware/validate';
import { createAttendanceSchema, updateAttendanceSchema } from '@/lib/validation/schemas';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { z } from 'zod';

interface ValidatedRequest extends Request {
  validatedData: {
    body?: unknown;
    query?: unknown;
    params?: unknown;
  };
}

// Create attendance record
export const POST = validate({
  body: createAttendanceSchema,
})(async (req: ValidatedRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { body } = req.validatedData;

    const attendance = await prisma.attendance.create({
      data: {
        ...body,
        organizationId: session.user.organizationId,
      },
      include: {
        member: true,
        class: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    logger.info('Attendance record created', { attendanceId: attendance.id });
    return NextResponse.json(attendance);
  } catch (error) {
    logger.error('Failed to create attendance record', error);
    return NextResponse.json(
      { error: 'Failed to create attendance record' },
      { status: 500 }
    );
  }
});

// Get attendance records with pagination and filters
export const GET = validate({
  query: z.object({
    memberId: z.string().uuid().optional(),
    classId: z.string().uuid().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    status: z.enum(['present', 'absent', 'late']).optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
  }),
})(async (req: ValidatedRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query } = req.validatedData;

    const where = {
      organizationId: session.user.organizationId,
      ...(query.memberId && { memberId: query.memberId }),
      ...(query.classId && { classId: query.classId }),
      ...(query.startDate && { date: { gte: new Date(query.startDate) } }),
      ...(query.endDate && { date: { lte: new Date(query.endDate) } }),
      ...(query.status && { status: query.status }),
    };

    const [attendance, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        include: {
          member: true,
          class: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { date: 'desc' },
      }),
      prisma.attendance.count({ where }),
    ]);

    return NextResponse.json({
      data: attendance,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    logger.error('Failed to fetch attendance records', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
}); 