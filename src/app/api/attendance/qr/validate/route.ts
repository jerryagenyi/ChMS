import { NextResponse } from 'next/server';
import { validate } from '@/middleware/validate';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';
import { logger } from '@/lib/logger';
import { decodeQRData } from '@/lib/qr';

const validateQRSchema = z.object({
  body: z.object({
    qrData: z.string(),
  }),
});

export const POST = validate(validateQRSchema, async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { qrData } = req.body;

    // Decode and validate QR data
    const decodedData = decodeQRData(qrData);

    // Verify class exists and user has access
    const classRecord = await prisma.class.findFirst({
      where: {
        id: decodedData.classId,
        organizationId: session.user.organizationId,
      },
    });

    if (!classRecord) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      data: {
        classId: decodedData.classId,
        isValid: true,
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    logger.error('Failed to validate QR code:', error);
    return NextResponse.json(
      { error: 'Failed to validate QR code' },
      { status: 500 }
    );
  }
}); 