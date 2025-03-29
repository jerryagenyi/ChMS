import { createService, updateService, getActiveServices } from '@/lib/attendance/service';
import { prismaMock } from '../mocks/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: prismaMock
}));

describe('Service Management', () => {
  const mockService = {
    id: '1',
    name: 'Sunday Service',
    locationId: 'loc1',
    startTime: new Date(),
    endTime: new Date(),
    status: 'ACTIVE'
  };

  it('creates new service', async () => {
    prismaMock.service.create.mockResolvedValue(mockService);

    const result = await createService({
      name: 'Sunday Service',
      locationId: 'loc1',
      startTime: new Date(),
      endTime: new Date()
    });

    expect(result).toEqual(mockService);
  });

  it('updates service details', async () => {
    const updatedService = {
      ...mockService,
      name: 'Updated Service Name'
    };

    prismaMock.service.update.mockResolvedValue(updatedService);

    const result = await updateService('1', {
      name: 'Updated Service Name'
    });

    expect(result.name).toBe('Updated Service Name');
  });

  it('retrieves active services', async () => {
    prismaMock.service.findMany.mockResolvedValue([mockService]);

    const activeServices = await getActiveServices();

    expect(activeServices).toHaveLength(1);
    expect(activeServices[0].status).toBe('ACTIVE');
  });
});