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

    // Create CSV content
    const headers = [
      'Event Name',
      'Date',
      'Venue',
      'Total Registrations',
      'Total Check-ins',
      'Attendance Rate',
      'Capacity',
      'Status',
    ].join(',');

    const rows = events.map((event) => {
      const totalRegistrations = event.registrations.length;
      const totalAttended = event.registrations.filter(
        (reg) => reg.status === 'ATTENDED'
      ).length;
      const attendanceRate = totalRegistrations
        ? Math.round((totalAttended / totalRegistrations) * 100)
        : 0;

      return [
        `"${event.name}"`,
        new Date(event.startDate).toLocaleDateString(),
        `"${event.venue || ''}"`,
        totalRegistrations,
        totalAttended,
        `${attendanceRate}%`,
        event.capacity || 'N/A',
        event.isPublic ? 'Public' : 'Private',
      ].join(',');
    });

    const csvContent = [headers, ...rows].join('\n');

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=event-reports-${new Date().toISOString().split('T')[0]}.csv`
    );

    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error exporting event reports:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 