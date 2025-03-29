import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get total visitors
    const totalVisitors = await prisma.visitor.count({
      where: {
        organizationId: session.user.organizationId,
      },
    });

    // Get touchpoint distribution
    const touchpointStats = await prisma.visitorTouchpoint.groupBy({
      by: ['touchpoint'],
      where: {
        visitor: {
          organizationId: session.user.organizationId,
        },
      },
      _count: {
        _all: true,
      },
    });

    // Get source distribution
    const sourceStats = await prisma.visitorTouchpoint.groupBy({
      by: ['source'],
      where: {
        visitor: {
          organizationId: session.user.organizationId,
        },
      },
      _count: {
        _all: true,
      },
    });

    // Get monthly trends
    const monthlyStats = await prisma.visitorTouchpoint.groupBy({
      by: ['touchpoint', 'createdAt'],
      where: {
        visitor: {
          organizationId: session.user.organizationId,
        },
      },
      _count: {
        _all: true,
      },
    });

    // Process the data
    const processedTouchpointStats = touchpointStats.map((stat) => ({
      type: stat.touchpoint,
      count: stat._count._all,
      percentage: (stat._count._all / totalVisitors) * 100,
    }));

    const processedSourceStats = sourceStats.map((stat) => ({
      source: stat.source,
      count: stat._count._all,
      percentage: (stat._count._all / totalVisitors) * 100,
    }));

    // Group monthly stats by month
    const monthlyData = monthlyStats.reduce((acc, curr) => {
      const month = new Date(curr.createdAt).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });

      if (!acc[month]) {
        acc[month] = {
          month,
          visitors: 0,
          touchpoints: [],
        };
      }

      acc[month].touchpoints.push({
        type: curr.touchpoint,
        count: curr._count._all,
      });

      acc[month].visitors += curr._count._all;

      return acc;
    }, {} as Record<string, any>);

    const processedMonthlyStats = Object.values(monthlyData);

    return res.status(200).json({
      totalVisitors,
      touchpointStats: processedTouchpointStats,
      sourceStats: processedSourceStats,
      monthlyStats: processedMonthlyStats,
    });
  } catch (error) {
    console.error('Error fetching touchpoint analytics:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 