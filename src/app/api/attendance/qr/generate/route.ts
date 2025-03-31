import { NextResponse } from 'next/server';
import { validate } from '@/middleware/validate';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';
import { logger } from '@/lib/logger';
import { generateQRData } from '@/lib/qr';

const generateQRSchema = z.object({
  body: z.object({
    classId: z.string().uuid(),
    expiryMinutes: z.number().min(1).max(60).default(5),
  }),
});

export const POST = validate(generateQRSchema, async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { classId, expiryMinutes } = req.body;

    // Verify class exists and user has access
    const classRecord = await prisma.class.findFirst({
      where: {
        id: classId,
        organizationId: session.user.organizationId,
      },
    });

    if (!classRecord) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Generate QR code data
    const qrData = generateQRData(classId, expiryMinutes);

    return NextResponse.json({ data: qrData });
  } catch (error) {
    logger.error('Failed to generate QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}); 