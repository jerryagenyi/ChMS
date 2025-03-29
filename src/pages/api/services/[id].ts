import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const serviceUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  type: z.enum(['sunday', 'wednesday', 'special']).optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurrencePattern: z.object({
    frequency: z.enum(['weekly', 'monthly', 'yearly']).optional(),
    interval: z.number().min(1).optional(),
    daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
    endDate: z.string().datetime().optional(),
  }).optional(),
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
    return res.status(400).json({ error: 'Invalid service ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const service = await prisma.service.findUnique({
          where: { id },
          include: {
            attendance: {
              select: {
                id: true,
                memberId: true,
                status: true,
                member: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            recurrencePattern: true,
          },
        });

        if (!service) {
          return res.status(404).json({ error: 'Service not found' });
        }

        return res.status(200).json(service);
      } catch (error) {
        console.error('Error fetching service:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'PUT':
      try {
        const data = serviceUpdateSchema.parse(req.body);

        // Check for overlapping services if date/time is being updated
        if (data.date || data.startTime || data.endTime) {
          const service = await prisma.service.findUnique({
            where: { id },
            select: { date: true, startTime: true, endTime: true },
          });

          if (!service) {
            return res.status(404).json({ error: 'Service not found' });
          }

          const overlappingService = await prisma.service.findFirst({
            where: {
              id: { not: id },
              date: data.date ? new Date(data.date) : service.date,
              OR: [
                {
                  AND: [
                    { startTime: { lte: data.startTime || service.startTime } },
                    { endTime: { gt: data.startTime || service.startTime } },
                  ],
                },
                {
                  AND: [
                    { startTime: { lt: data.endTime || service.endTime } },
                    { endTime: { gte: data.endTime || service.endTime } },
                  ],
                },
              ],
            },
          });

          if (overlappingService) {
            return res.status(400).json({ error: 'Service time overlaps with existing service' });
          }
        }

        const updatedService = await prisma.service.update({
          where: { id },
          data: {
            ...data,
            date: data.date ? new Date(data.date) : undefined,
            startTime: data.startTime,
            endTime: data.endTime,
            recurrencePattern: data.recurrencePattern ? {
              upsert: {
                create: {
                  ...data.recurrencePattern,
                  endDate: data.recurrencePattern.endDate ? new Date(data.recurrencePattern.endDate) : null,
                },
                update: {
                  ...data.recurrencePattern,
                  endDate: data.recurrencePattern.endDate ? new Date(data.recurrencePattern.endDate) : null,
                },
                where: { serviceId: id },
              },
            } : undefined,
          },
          include: {
            attendance: true,
            recurrencePattern: true,
          },
        });

        return res.status(200).json(updatedService);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error('Error updating service:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'DELETE':
      try {
        // Check if service exists
        const service = await prisma.service.findUnique({
          where: { id },
        });

        if (!service) {
          return res.status(404).json({ error: 'Service not found' });
        }

        // Delete service and its related records
        await prisma.service.delete({
          where: { id },
        });

        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting service:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 