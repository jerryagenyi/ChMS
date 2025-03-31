import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth-options';
import { z } from 'zod';

const checkInSchema = z.object({
  memberId: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
  serviceId: z.string(),
  type: z.enum(['INDIVIDUAL', 'FAMILY']),
});

type CheckInData = z.infer<typeof checkInSchema>;

export default async function checkInHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate session
    const session = await getServerSession(authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate request body
    const validationResult = checkInSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.message });
    }

    const data: CheckInData = validationResult.data;

    // Handle individual check-in
    if (data.type === 'INDIVIDUAL' && data.memberId) {
      const checkIn = await prisma.attendance.create({
        data: {
          memberId: data.memberId,
          serviceId: data.serviceId,
          isFamily: false,
        },
        include: {
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      return res.status(200).json(checkIn);
    }

    // Handle family check-in
    if (data.type === 'FAMILY' && data.memberIds && data.memberIds.length > 0) {
      // Create attendance records for each family member
      const checkIns = await prisma.$transaction(
        data.memberIds.map((memberId) =>
          prisma.attendance.create({
            data: {
              memberId,
              serviceId: data.serviceId,
              isFamily: true,
            },
            include: {
              member: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          })
        )
      );
      return res.status(200).json({ checkIns });
    }

    return res.status(400).json({ error: 'Invalid check-in data' });
  } catch (error) {
    console.error('Check-in error:', error);
    return res.status(500).json({ error: 'Error processing check-in' });
  }
}