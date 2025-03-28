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
  const { registrationId } = req.body;

  try {
    // Find the registration
    const registration = await prisma.eventRegistration.findFirst({
      where: {
        OR: [
          { id: registrationId },
          {
            event: { id: eventId },
            member: { email: registrationId },
          },
          {
            event: { id: eventId },
            guest: { email: registrationId },
          },
        ],
      },
      include: {
        event: true,
        member: true,
        guest: true,
      },
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    if (registration.status === 'ATTENDED') {
      return res.status(400).json({ error: 'Already checked in' });
    }

    // Update registration status
    const updatedRegistration = await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { status: 'ATTENDED' },
      include: {
        event: true,
        member: true,
        guest: true,
      },
    });

    return res.status(200).json(updatedRegistration);
  } catch (error) {
    console.error('Error checking in:', error);
    return res.status(500).json({ error: 'Error checking in' });
  }
} 