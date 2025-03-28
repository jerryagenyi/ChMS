import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getServerSession(req, res, authOptions);
  const eventId = req.query.eventId as string;

  try {
    // First, check if the event exists and has capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: true,
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.capacity && event.registrations.length >= event.capacity) {
      return res.status(400).json({ error: 'Event is at full capacity' });
    }

    const { guestType, memberId, firstName, lastName, email, phone, organisation, dietaryRestrictions, notes } = req.body;

    if (guestType === 'MEMBER') {
      // Verify member exists
      const member = await prisma.member.findUnique({
        where: { id: memberId },
      });

      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }

      // Check if member is already registered
      const existingRegistration = await prisma.eventRegistration.findFirst({
        where: {
          eventId,
          memberId,
        },
      });

      if (existingRegistration) {
        return res.status(400).json({ error: 'Member is already registered' });
      }

      // Create registration for member
      const registration = await prisma.eventRegistration.create({
        data: {
          eventId,
          memberId,
          guestType,
          status: 'REGISTERED',
        },
      });

      return res.status(201).json(registration);
    } else {
      // Create event guest
      const guest = await prisma.eventGuest.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          organisation,
          dietaryRestrictions,
          notes,
        },
      });

      // Create registration for guest
      const registration = await prisma.eventRegistration.create({
        data: {
          eventId,
          guestId: guest.id,
          guestType,
          status: 'REGISTERED',
        },
      });

      return res.status(201).json(registration);
    }
  } catch (error) {
    console.error('Error registering for event:', error);
    return res.status(500).json({ error: 'Error registering for event' });
  }
} 