import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';
import { startOfDay, subDays, subMonths, subYears, endOfDay } from 'date-fns';
import { Prisma } from '@prisma/client';

type AnalyticsResponse = {
  attendance: number;
  uniqueAttendees: number;
  newVisitors: number;
  returningVisitors: number;
  convertedVisitors: number;
  conversionRate: number;
  engagement: number;
  period: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsResponse | { message: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { organizationId } = req.query;
    if (!organizationId) {
      return res.status(400).json({ message: 'Organization ID is required' });
    }

    const { period = 'day' } = req.query;
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = startOfDay(now);
        break;
      case 'week':
        startDate = subDays(now, 7);
        break;
      case 'month':
        startDate = subMonths(now, 1);
        break;
      case 'year':
        startDate = subYears(now, 1);
        break;
      default:
        startDate = startOfDay(now);
    }

    // Fetch visitor data with event registrations
    const visitorData = await prisma.visitor.findMany({
      where: {
        organizationId: organizationId as string,
        visitDate: {
          gte: startDate,
          lte: endOfDay(now),
        },
      },
      include: {
        eventRegistrations: true,
      },
    });

    // Calculate metrics
    const totalAttendance = visitorData.length;
    const uniqueAttendees = new Set(visitorData.map(v => v.id)).size;
    const newVisitors = visitorData.filter(v => 
      (v as any).eventRegistrations.length === 1
    ).length;
    const returningVisitors = totalAttendance - newVisitors;
    const convertedVisitors = visitorData.filter(v => 
      (v as any).eventRegistrations.length > 1
    ).length;
    const conversionRate = totalAttendance > 0 
      ? (convertedVisitors / totalAttendance) * 100 
      : 0;
    const engagement = visitorData.reduce((acc, v) => 
      acc + (v as any).eventRegistrations.length, 0) / totalAttendance || 0;

    // Store metrics
    await prisma.metric.create({
      data: {
        organizationId: organizationId as string,
        type: 'ATTENDANCE',
        name: 'daily_summary',
        value: totalAttendance,
        date: now,
        metadata: {
          attendance: totalAttendance,
          uniqueAttendees,
          newVisitors,
          returningVisitors,
          convertedVisitors,
          conversionRate,
          engagement,
        },
      },
    });

    return res.status(200).json({
      attendance: totalAttendance,
      uniqueAttendees,
      newVisitors,
      returningVisitors,
      convertedVisitors,
      conversionRate,
      engagement,
      period: period as string,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 