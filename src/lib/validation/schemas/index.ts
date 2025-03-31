import { z } from 'zod';

export const createAttendanceSchema = z.object({
  memberId: z.string().uuid(),
  classId: z.string().uuid(),
  date: z.string().datetime(),
  status: z.enum(['present', 'absent', 'late']),
  notes: z.string().optional(),
});