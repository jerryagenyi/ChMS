import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { eventId } = req.query;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const event = await prisma.event.findUnique({
        where: {
          id: eventId as string,
        },
        include: {
          registrations: {
            include: {
              member: true,
              visitor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      });

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      return res.status(200).json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const {
        name,
        description,
        startDate,
        endDate,
        venue,
        capacity,
        isPublic,
      } = req.body;

      if (!name || !startDate) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const event = await prisma.event.update({
        where: {
          id: eventId as string,
        },
        data: {
          name,
          description,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          venue,
          capacity,
          isPublic,
        },
      });

      return res.status(200).json(event);
    } catch (error) {
      console.error('Error updating event:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.event.delete({
        where: {
          id: eventId as string,
        },
      });

      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting event:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 