import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const attendanceSchema = z.object({
  serviceId: z.string(),
  memberId: z.string(),
  date: z.string().datetime(),
  status: z.enum(['present', 'absent', 'late']),
  notes: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const { serviceId, date, status } = req.query;

        const where = {
          ...(serviceId && { serviceId: String(serviceId) }),
          ...(date && { date: new Date(String(date)) }),
          ...(status && { status: String(status) }),
        };

        const attendance = await prisma.attendance.findMany({
          where,
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
          orderBy: {
            date: 'desc',
          },
        });

        return res.status(200).json(attendance);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'POST':
      try {
        const data = attendanceSchema.parse(req.body);

        const attendance = await prisma.attendance.create({
          data: {
            ...data,
            date: new Date(data.date),
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
        });

        return res.status(201).json(attendance);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error('Error creating attendance:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 