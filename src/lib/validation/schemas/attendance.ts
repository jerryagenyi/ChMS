import { z } from 'zod';

export const attendanceSchema = z.object({
  memberId: z.string().uuid(),
  serviceId: z.string().uuid(),
  timestamp: z.date(),
  method: z.enum(['QR_SCAN', 'MANUAL']),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
  notes: z.string().optional(),
  isFamily: z.boolean().default(false),
  locationVerified: z.boolean().default(false)
});

export const bulkAttendanceSchema = z.object({
  records: z.array(attendanceSchema)
});