import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const events = await prisma.event.findMany({
        include: {
          _count: {
            select: {
              registrations: true,
            },
          },
        },
        orderBy: {
          startDate: 'desc',
        },
      });

      return res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        name,
        description,
        startDate,
        endDate,
        venue,
        capacity,
        isPublic,
        organizationId,
      } = req.body;

      if (!name || !startDate || !organizationId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const event = await prisma.event.create({
        data: {
          name,
          description,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          venue,
          capacity,
          isPublic,
          organizationId,
        },
      });

      return res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
} 