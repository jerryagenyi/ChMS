import { z } from 'zod';
import type { CheckInData } from '@/types/attendance';
import { prisma } from '@/lib/prisma';

const checkInValidationSchema = z.object({
  memberId: z.string().uuid(),
  serviceId: z.string().uuid(),
  notes: z.string().optional(),
});

export async function validateCheckIn(data: CheckInData) {
  // Validate schema
  const validated = checkInValidationSchema.parse(data);

  // Verify member exists
  const member = await prisma.member.findUnique({
    where: { id: validated.memberId }
  });
  if (!member) {
    throw new Error('Member not found');
  }

  // Verify service exists
  const service = await prisma.service.findUnique({
    where: { id: validated.serviceId }
  });
  if (!service) {
    throw new Error('Service not found');
  }

  // Check for duplicate check-in
  const existingCheckIn = await prisma.attendance.findFirst({
    where: {
      memberId: validated.memberId,
      serviceId: validated.serviceId,
      checkedOutAt: null
    }
  });
  if (existingCheckIn) {
    throw new Error('Member already checked in');
  }

  return validated;
}