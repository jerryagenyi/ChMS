import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { TouchpointType, TouchpointSource } from '@/constants/touchpoints';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { visitorId } = req.query;

  if (!visitorId) {
    return res.status(400).json({ message: 'Visitor ID is required' });
  }

  if (req.method === 'POST') {
    try {
      const { type, source } = req.body;

      if (!type || !source) {
        return res.status(400).json({ message: 'Type and source are required' });
      }

      const touchpoint = await prisma.visitorTouchpoint.create({
        data: {
          visitorId: visitorId as string,
          touchpoint: type as TouchpointType,
          source: source as TouchpointSource,
        },
      });

      return res.status(201).json(touchpoint);
    } catch (error) {
      console.error('Error creating touchpoint:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'GET') {
    try {
      const touchpoints = await prisma.visitorTouchpoint.findMany({
        where: {
          visitorId: visitorId as string,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(touchpoints);
    } catch (error) {
      console.error('Error fetching touchpoints:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 