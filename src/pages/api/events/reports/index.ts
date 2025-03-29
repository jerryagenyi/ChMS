import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { timeRange = '30days' } = req.query;
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const events = await prisma.event.findMany({
      where: {
        startDate: {
          gte: startDate,
        },
      },
      include: {
        registrations: {
          where: {
            status: {
              in: ['REGISTERED', 'ATTENDED'],
            },
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    const reports = events.map((event) => {
      const totalRegistrations = event.registrations.length;
      const totalAttended = event.registrations.filter(
        (reg) => reg.status === 'ATTENDED'
      ).length;
      const attendanceRate = totalRegistrations
        ? Math.round((totalAttended / totalRegistrations) * 100)
        : 0;

      return {
        id: event.id,
        name: event.name,
        date: event.startDate,
        totalRegistrations,
        totalCheckIns: totalAttended,
        attendanceRate,
      };
    });

    return res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching event reports:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 