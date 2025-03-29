import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const attendanceRecordSchema = z.object({
  serviceId: z.string(),
  memberId: z.string(),
  date: z.string().datetime(),
  status: z.enum(['present', 'absent', 'late']),
  notes: z.string().optional(),
});

const bulkAttendanceSchema = z.object({
  records: z.array(attendanceRecordSchema),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { records } = bulkAttendanceSchema.parse(req.body);

    // Use transaction to ensure all records are created or none
    const attendance = await prisma.$transaction(
      records.map((record) =>
        prisma.attendance.create({
          data: {
            ...record,
            date: new Date(record.date),
          },
          include: {
            member: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
                date: true,
              },
            },
          },
        })
      )
    );

    return res.status(201).json(attendance);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating bulk attendance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 