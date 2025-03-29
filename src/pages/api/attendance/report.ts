import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const reportSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  serviceId: z.string().optional(),
  memberId: z.string().optional(),
  groupBy: z.enum(['day', 'week', 'month']).default('day'),
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
    const { startDate, endDate, serviceId, memberId, groupBy } = reportSchema.parse(req.body);

    const where = {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      ...(serviceId && { serviceId }),
      ...(memberId && { memberId }),
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
        date: 'asc',
      },
    });

    // Group attendance data based on the specified period
    const groupedData = groupAttendanceData(attendance, groupBy);

    return res.status(200).json(groupedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error generating attendance report:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

function groupAttendanceData(attendance: any[], groupBy: 'day' | 'week' | 'month') {
  const grouped = attendance.reduce((acc, record) => {
    let key: string;

    switch (groupBy) {
      case 'day':
        key = record.date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(record.date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${record.date.getFullYear()}-${String(record.date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = record.date.toISOString().split('T')[0];
    }

    if (!acc[key]) {
      acc[key] = {
        period: key,
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        records: [],
      };
    }

    acc[key].total++;
    acc[key][record.status]++;
    acc[key].records.push(record);

    return acc;
  }, {} as Record<string, any>);

  return Object.values(grouped);
} 