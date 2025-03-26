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
export const GET = validate({
  params: z.object({
    classId: z.string().uuid(),
  }),
})(async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const validatedReq = req as ValidatedRequest;
    const { params } = validatedReq.validatedData;

    const attendance = await prisma.$queryRaw`
      SELECT a.*, m.firstName, m.lastName
      FROM "Attendance" a
      JOIN "Member" m ON a."memberId" = m.id
      WHERE a."classId" = ${params.classId}
      AND a."organisationId" = ${session.user.organisationId}
      ORDER BY a."createdAt" DESC
    `;

    return NextResponse.json({ data: attendance });
  } catch (error) {
    logger.error('Failed to fetch attendance records', error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
});

// Create attendance record for a class
export const POST = validate({
  params: z.object({
    classId: z.string().uuid(),
  }),
  body: createAttendanceSchema,
})(async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const validatedReq = req as ValidatedRequest;
    const { params, body } = validatedReq.validatedData;

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

    const attendance = await prisma.$executeRaw`
      INSERT INTO "Attendance" (
        id,
        "memberId",
        "classId",
        "organisationId",
        status,
        notes,
        date,
        "createdAt",
        "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        ${body.memberId},
        ${params.classId},
        ${session.user.organisationId},
        ${body.status},
        ${body.notes},
        ${new Date(body.date)},
        NOW(),
        NOW()
      ) RETURNING *
    `;

    logger.info('Attendance record created', { attendanceId: attendance });
    return NextResponse.json(attendance);
  } catch (error) {
    logger.error('Failed to create attendance record', error as Error);
    return NextResponse.json(
      { error: 'Failed to create attendance record' },
      { status: 500 }
    );
  }
}); 