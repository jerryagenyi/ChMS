import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const registrationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
  occupation: z.string().optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string(),
  }).optional(),
  notes: z.string().optional(),
  familyId: z.string().optional(),
  familyRole: z.enum(['head', 'spouse', 'child', 'other']).optional(),
  baptismDate: z.string().datetime().optional(),
  confirmationDate: z.string().datetime().optional(),
  membershipDate: z.string().datetime().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const data = registrationSchema.parse(req.body);

    // Check if email already exists
    const existingMember = await prisma.member.findUnique({
      where: { email: data.email },
    });

    if (existingMember) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // If familyId is provided, verify it exists
    if (data.familyId) {
      const family = await prisma.family.findUnique({
        where: { id: data.familyId },
      });

      if (!family) {
        return res.status(400).json({ error: 'Family not found' });
      }
    }

    // Create member with optional family link
    const member = await prisma.member.create({
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        baptismDate: data.baptismDate ? new Date(data.baptismDate) : null,
        confirmationDate: data.confirmationDate ? new Date(data.confirmationDate) : null,
        membershipDate: data.membershipDate ? new Date(data.membershipDate) : null,
        family: data.familyId ? {
          connect: { id: data.familyId },
        } : undefined,
        familyRole: data.familyRole,
      },
      include: {
        family: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(201).json(member);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error registering member:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 