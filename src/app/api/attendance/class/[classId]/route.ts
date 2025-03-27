import { NextResponse } from 'next/server';
import { validate } from '@/middleware/validate';
import { createAttendanceSchema } from '@/lib/validation/schemas';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { z } from 'zod';

// Define the request type with validated data
type ValidatedRequest = Request & {
  validatedData: {
    body?: z.infer<typeof createAttendanceSchema>;
    query?: unknown;
    params: {
      classId: string;
    };
  };
};

// Get attendance records for a class
const getHandler = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const validatedReq = req as ValidatedRequest;
    const { params } = validatedReq.validatedData;

    const attendance = await prisma.attendance.findMany({
      where: {
        classId: params.classId,
      },
      include: {
        member: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: attendance.map(record => ({
        id: record.id,
        memberId: record.memberId,
        classId: record.classId,
        organisationId: record.organisationId,
        status: record.status,
        notes: record.notes,
        date: record.date.toISOString(),
        firstName: record.member.firstName,
        lastName: record.member.lastName,
      }))
    });
  } catch (error) {
    logger.error('Failed to fetch attendance records', error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
};

export const GET = validate({
  params: z.object({
    classId: z.string().uuid(),
  }),
})(getHandler);

// Create attendance record for a class
const postHandler = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const validatedReq = req as ValidatedRequest;
    const { params, body } = validatedReq.validatedData;

    // Add an explicit check for organisationId for type safety
    if (!session.user.organisationId) {
      logger.error('Organisation ID missing from session');
      return NextResponse.json(
        { error: 'Internal server error: Organisation ID missing' },
        { status: 500 }
      );
    }

    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Check if class exists and belongs to the organisation
    const classExists = await prisma.class.findFirst({
      where: {
        id: params.classId,
        organisationId: session.user.organisationId,
      },
    });

    if (!classExists) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    // Check if member is enrolled in the class
    const memberEnrolled = await prisma.memberClass.findFirst({
      where: {
        memberId: body.memberId,
        classId: params.classId,
        status: 'ENROLLED',
      },
    });

    if (!memberEnrolled) {
      return NextResponse.json(
        { error: 'Member is not enrolled in this class' },
        { status: 400 }
      );
    }

    // Use prisma.attendance.create for type safety and returning the created record
    const newAttendance = await prisma.attendance.create({
      data: {
        memberId: body.memberId,
        classId: params.classId,
        organisationId: session.user.organisationId,
        status: body.status,
        notes: body.notes,
        date: body.date, // Keep as ISO string
      },
    });

    logger.info('Attendance record created', { attendanceId: newAttendance.id });
    // Return the newly created attendance record
    return NextResponse.json(newAttendance);
  } catch (error) {
    logger.error('Failed to create attendance record', error as Error);
    return NextResponse.json(
      { error: 'Failed to create attendance record' },
      { status: 500 }
    );
  }
};

export const POST = validate({
  params: z.object({
    classId: z.string().uuid(),
  }),
  body: createAttendanceSchema,
})(postHandler);