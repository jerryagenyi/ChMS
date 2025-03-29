import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { eventId } = req.query;
    const { registrationId } = req.body;

    if (!eventId || !registrationId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the registration
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        id: registrationId,
      },
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.eventId !== eventId) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    if (registration.status === 'ATTENDED') {
      return res.status(400).json({ message: 'Already checked in' });
    }

    // Update registration status to ATTENDED
    const updatedRegistration = await prisma.eventRegistration.update({
      where: {
        id: registrationId,
      },
      data: {
        status: 'ATTENDED',
      },
    });

    return res.status(200).json(updatedRegistration);
  } catch (error) {
    console.error('Error checking in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 