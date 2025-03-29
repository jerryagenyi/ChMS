import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  date: z.string().datetime(),
  startTime: z.string(),
  endTime: z.string(),
  type: z.enum(['sunday', 'wednesday', 'special']),
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

  switch (req.method) {
    case 'GET':
      try {
        const { search, type, startDate, endDate, isRecurring } = req.query;

        const where = {
          ...(search && {
            OR: [
              { name: { contains: String(search), mode: 'insensitive' } },
              { description: { contains: String(search), mode: 'insensitive' } },
            ],
          }),
          ...(type && { type: String(type) }),
          ...(startDate && { date: { gte: new Date(String(startDate)) } }),
          ...(endDate && { date: { lte: new Date(String(endDate)) } }),
          ...(isRecurring !== undefined && { isRecurring: isRecurring === 'true' }),
        };

        const services = await prisma.service.findMany({
          where,
          include: {
            attendance: {
              select: {
                id: true,
                memberId: true,
                status: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
        });

        return res.status(200).json(services);
      } catch (error) {
        console.error('Error fetching services:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'POST':
      try {
        const data = serviceSchema.parse(req.body);

        // Check for overlapping services
        const overlappingService = await prisma.service.findFirst({
          where: {
            date: new Date(data.date),
            OR: [
              {
                AND: [
                  { startTime: { lte: data.startTime } },
                  { endTime: { gt: data.startTime } },
                ],
              },
              {
                AND: [
                  { startTime: { lt: data.endTime } },
                  { endTime: { gte: data.endTime } },
                ],
              },
            ],
          },
        });

        if (overlappingService) {
          return res.status(400).json({ error: 'Service time overlaps with existing service' });
        }

        const service = await prisma.service.create({
          data: {
            ...data,
            date: new Date(data.date),
            startTime: data.startTime,
            endTime: data.endTime,
            recurrencePattern: data.recurrencePattern ? {
              create: {
                ...data.recurrencePattern,
                endDate: data.recurrencePattern.endDate ? new Date(data.recurrencePattern.endDate) : null,
              },
            } : undefined,
          },
          include: {
            attendance: true,
            recurrencePattern: true,
          },
        });

        return res.status(201).json(service);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: error.errors });
        }
        console.error('Error creating service:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 