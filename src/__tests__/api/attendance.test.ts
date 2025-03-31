import { rest } from 'msw';
import { server } from '@/__tests__/__mocks__/server';
import { createAttendance, getAttendanceStats } from '@/services/attendance';

describe('Attendance API Integration', () => {
  it('successfully creates attendance record', async () => {
    const mockAttendance = {
      memberId: '123',
      serviceId: '456',
      timestamp: new Date(),
    };

    server.use(
      rest.post('/api/attendance', (req, res, ctx) => {
        return res(ctx.json({ id: '789', ...mockAttendance }));
      })
    );

    const result = await createAttendance(mockAttendance);
    expect(result.id).toBe('789');
  });

  it('handles network errors appropriately', async () => {
    server.use(
      rest.get('/api/attendance/stats', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await expect(getAttendanceStats()).rejects.toThrow('Failed to fetch stats');
  });
});