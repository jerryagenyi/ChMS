import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { eventId } = req.query;
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId as string },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const {
      guestType,
      memberId,
      firstName,
      lastName,
      email,
      phone,
      organization,
      dietaryRestrictions,
      notes,
      touchpoint,
    } = req.body;

    if (!guestType) {
      return res.status(400).json({ message: 'Guest type is required' });
    }

    let registration;

    if (guestType === 'MEMBER') {
      if (!memberId) {
        return res.status(400).json({ message: 'Member ID is required' });
      }

      registration = await prisma.eventRegistration.create({
        data: {
          eventId: eventId as string,
          guestType: 'MEMBER',
          memberId,
        },
      });
    } else if (guestType === 'VISITOR') {
      if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First name and last name are required' });
      }

      // Create visitor and registration in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create visitor
        const visitor = await tx.visitor.create({
          data: {
            organizationId: event.organizationId,
            firstName,
            lastName,
            email,
            phone,
            visitDate: new Date(),
          },
        });

        // Create registration
        const registration = await tx.eventRegistration.create({
          data: {
            eventId: eventId as string,
            guestType: 'VISITOR',
            visitorId: visitor.id,
          },
        });

        // Create touchpoint if provided
        if (touchpoint?.touchpoint && touchpoint?.source) {
          await tx.visitorTouchpoint.create({
            data: {
              visitorId: visitor.id,
              organizationId: event.organizationId,
              touchpoint: touchpoint.touchpoint,
              source: touchpoint.source,
            },
          });
        }

        return registration;
      });

      registration = result;
    } else {
      return res.status(400).json({ message: 'Invalid guest type' });
    }

    return res.status(201).json(registration);
  } catch (error) {
    console.error('Error registering for event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 