import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import serviceHandler from '@/pages/api/attendance/service';
import { prismaMock } from '@/tests/mocks/prisma';

describe('Service API Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates new service', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Sunday Service',
        locationId: 'loc1',
        startTime: '2024-02-15T09:00:00Z',
        endTime: '2024-02-15T11:00:00Z'
      }
    });

    const mockService = {
      id: '1',
      name: 'Sunday Service',
      locationId: 'loc1',
      startTime: new Date('2024-02-15T09:00:00Z'),
      endTime: new Date('2024-02-15T11:00:00Z'),
      status: 'ACTIVE'
    };

    prismaMock.service.create.mockResolvedValue(mockService);

    await serviceHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        id: '1',
        name: 'Sunday Service'
      })
    );
  });

  it('retrieves active services', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    });

    const mockServices = [
      {
        id: '1',
        name: 'Sunday Service',
        status: 'ACTIVE'
      }
    ];

    prismaMock.service.findMany.mockResolvedValue(mockServices);

    await serviceHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          status: 'ACTIVE'
        })
      ])
    );
  });
});