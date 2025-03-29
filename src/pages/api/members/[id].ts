import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const memberUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
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
  status: z.enum(['active', 'inactive', 'deceased']).optional(),
  familyId: z.string().optional(),
  familyRole: z.enum(['head', 'spouse', 'child', 'other']).optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid member ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const member = await prisma.member.findUnique({
          where: { id },
          include: {
            family: {
              select: {
                id: true,
                name: true,
                members: {
                  select: {
                    id: true,
                    name: true,
                    familyRole: true,
                  },
                },
              },
            },
            attendance: {
              select: {
                id: true,
                date: true,
                status: true,
                service: {
                  select: {
                    id: true,
                    name: true,
                    date: true,
                  },
                },
              },
              orderBy: {
                date: 'desc',
              },
              take: 10,
            },
          },
        });

        if (!member) {
          return res.status(404).json({ error: 'Member not found' });
        }

        return res.status(200).json(member);
      } catch (error) {
        console.error('Error fetching member:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'PUT':
      try {
        const data = memberUpdateSchema.parse(req.body);

        // If email is being updated, check if it's already taken
        if (data.email) {
          const existingMember = await prisma.member.findFirst({
            where: {
              email: data.email,
              NOT: { id },
            },
          });

          if (existingMember) {
            return res.status(400).json({ error: 'Email already in use' });
          }
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

        const member = await prisma.member.update({
          where: { id },
          data: {
            ...data,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
            family: data.familyId ? {
              connect: { id: data.familyId },
            } : undefined,
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

        return res.status(200).json(member);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error('Error updating member:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'DELETE':
      try {
        // Check if member exists
        const member = await prisma.member.findUnique({
          where: { id },
        });

        if (!member) {
          return res.status(404).json({ error: 'Member not found' });
        }

        // Soft delete by updating status
        await prisma.member.update({
          where: { id },
          data: { status: 'inactive' },
        });

        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting member:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 