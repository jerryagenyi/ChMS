import { createMocks } from 'node-mocks-http';
import statsHandler from '@/pages/api/attendance/stats';
import { prismaMock } from '@/tests/mocks/prisma';

describe('Attendance Stats API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns attendance statistics for a specific service', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { serviceId: '1' }
    });

    const mockStats = {
      _count: { id: 150 },
      visitors: { _count: { id: 12 } },
      departments: [
        { name: 'Children', _count: { id: 45 } },
        { name: 'Youth', _count: { id: 35 } }
      ]
    };

    prismaMock.$queryRaw.mockResolvedValue(mockStats);

    await statsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        totalAttendees: 150,
        newVisitors: 12,
        departments: expect.arrayContaining([
          expect.objectContaining({ name: 'Children', count: 45 })
        ])
      })
    );
  });

  it('handles date range queries', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        startDate: '2024-02-01',
        endDate: '2024-02-15'
      }
    });

    const mockTrendData = {
      current: { _count: { id: 150 } },
      previous: { _count: { id: 145 } }
    };

    prismaMock.$queryRaw.mockResolvedValue(mockTrendData);

    await statsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        trend: expect.objectContaining({
          percentageChange: expect.any(Number)
        })
      })
    );
  });

  it('handles invalid date range', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        startDate: 'invalid-date',
        endDate: '2024-02-15'
      }
    });

    await statsHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        error: expect.any(String)
      })
    );
  });
});