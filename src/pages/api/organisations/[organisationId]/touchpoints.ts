import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { organizationId } = req.query;
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!organizationId) {
    return res.status(400).json({ message: 'Organization ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const touchpoints = await prisma.organizationTouchpoint.findMany({
        where: {
          organizationId: organizationId as string,
          isActive: true,
        },
        orderBy: {
          type: 'asc',
        },
      });

      return res.status(200).json(touchpoints);
    } catch (error) {
      console.error('Error fetching touchpoints:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { type, source, label } = req.body;

      if (!type || !source || !label) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const touchpoint = await prisma.organizationTouchpoint.create({
        data: {
          organizationId: organizationId as string,
          type,
          source,
          label,
        },
      });

      return res.status(201).json(touchpoint);
    } catch (error) {
      console.error('Error creating touchpoint:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, label, isActive } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Touchpoint ID is required' });
      }

      const touchpoint = await prisma.organizationTouchpoint.update({
        where: {
          id,
        },
        data: {
          label,
          isActive,
        },
      });

      return res.status(200).json(touchpoint);
    } catch (error) {
      console.error('Error updating touchpoint:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Touchpoint ID is required' });
      }

      await prisma.organizationTouchpoint.delete({
        where: {
          id,
        },
      });

      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting touchpoint:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 