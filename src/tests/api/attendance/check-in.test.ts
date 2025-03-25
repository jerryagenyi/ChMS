import { createMocks } from 'node-mocks-http';
import checkInHandler from '@/pages/api/attendance/check-in';
import { prismaMock } from '@/tests/mocks/prisma';

jest.mock('@/lib/auth', () => ({
  validateSession: jest.fn(() => Promise.resolve({ userId: '1' }))
}));

describe('Check-in API Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles individual check-in', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        memberId: '1',
        serviceId: '1',
        type: 'INDIVIDUAL'
      }
    });

    const mockCheckIn = {
      id: '1',
      memberId: '1',
      serviceId: '1',
      timestamp: new Date(),
      type: 'INDIVIDUAL'
    };

    prismaMock.checkIn.create.mockResolvedValue(mockCheckIn);

    await checkInHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        id: '1',
        type: 'INDIVIDUAL'
      })
    );
  });

  it('handles family check-in', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        memberIds: ['1', '2'],
        serviceId: '1',
        type: 'FAMILY'
      }
    });

    const mockFamilyCheckIn = {
      id: '1',
      serviceId: '1',
      timestamp: new Date(),
      type: 'FAMILY',
      members: [
        { memberId: '1' },
        { memberId: '2' }
      ]
    };

    prismaMock.checkIn.create.mockResolvedValue(mockFamilyCheckIn);

    await checkInHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        type: 'FAMILY',
        members: expect.arrayContaining([
          expect.objectContaining({ memberId: '1' }),
          expect.objectContaining({ memberId: '2' })
        ])
      })
    );
  });

  it('handles validation errors', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        // Missing required fields
      }
    });

    await checkInHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        error: expect.any(String)
      })
    );
  });
});