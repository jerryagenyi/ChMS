import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

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
        const events = await prisma.event.findMany({
          where: {
            OR: [
              { isPublic: true },
              { organisationId: session.user.organisationId }
            ]
          },
          orderBy: {
            startDate: 'desc'
          }
        });
        return res.status(200).json(events);
      } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({ error: 'Error fetching events' });
      }

    case 'POST':
      try {
        const { name, description, startDate, endDate, venue, capacity, isPublic } = req.body;

        const event = await prisma.event.create({
          data: {
            name,
            description,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            venue,
            capacity,
            isPublic,
            organisationId: session.user.organisationId,
          }
        });

        return res.status(201).json(event);
      } catch (error) {
        console.error('Error creating event:', error);
        return res.status(500).json({ error: 'Error creating event' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 