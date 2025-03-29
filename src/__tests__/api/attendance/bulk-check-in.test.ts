import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import bulkCheckInHandler from '@/pages/api/attendance/bulk-check-in';
import { prismaMock } from '@/tests/mocks/prisma';

describe('Bulk Check-in API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles bulk family check-in', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        serviceId: '1',
        members: [
          { memberId: '1', type: 'ADULT' },
          { memberId: '2', type: 'CHILD' },
          { memberId: '3', type: 'CHILD' }
        ]
      }
    });

    const mockBulkCheckIn = {
      id: 'bulk1',
      serviceId: '1',
      checkIns: [
        { memberId: '1', type: 'ADULT' },
        { memberId: '2', type: 'CHILD' },
        { memberId: '3', type: 'CHILD' }
      ]
    };

    prismaMock.$transaction.mockResolvedValue(mockBulkCheckIn);

    await bulkCheckInHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        id: 'bulk1',
        checkIns: expect.arrayContaining([
          expect.objectContaining({ type: 'ADULT' }),
          expect.objectContaining({ type: 'CHILD' })
        ])
      })
    );
  });

  it('validates member types', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        serviceId: '1',
        members: [
          { memberId: '1', type: 'INVALID_TYPE' }
        ]
      }
    });

    await bulkCheckInHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        error: expect.stringContaining('Invalid member type')
      })
    );
  });

  it('handles transaction failures', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        serviceId: '1',
        members: [
          { memberId: '1', type: 'ADULT' }
        ]
      }
    });

    prismaMock.$transaction.mockRejectedValue(new Error('Database error'));

    await bulkCheckInHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        error: expect.stringContaining('Error processing bulk check-in')
      })
    );
  });
});