import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function checkInHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { memberId, serviceId, type } = req.body;

    const checkIn = await prisma.checkIn.create({
      data: {
        memberId,
        serviceId,
        type,
        timestamp: new Date()
      }
    });

    return res.status(200).json(checkIn);
  } catch (error) {
    return res.status(500).json({ error: 'Error processing check-in' });
  }
}