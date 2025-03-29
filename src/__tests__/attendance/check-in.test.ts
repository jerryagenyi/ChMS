import { checkInMember, checkInFamily } from '@/lib/attendance/check-in';
import { prismaMock } from '../mocks/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: prismaMock
}));

describe('Attendance Check-in', () => {
  const mockMember = {
    id: '1',
    name: 'John Doe',
    organizationId: 'org1'
  };

  const mockService = {
    id: '1',
    name: 'Sunday Service',
    locationId: 'loc1'
  };

  it('checks in individual member', async () => {
    const checkIn = {
      id: '1',
      memberId: mockMember.id,
      serviceId: mockService.id,
      timestamp: new Date(),
      type: 'INDIVIDUAL'
    };

    prismaMock.checkIn.create.mockResolvedValue(checkIn);

    const result = await checkInMember({
      memberId: mockMember.id,
      serviceId: mockService.id
    });

    expect(result).toEqual(checkIn);
    expect(result.type).toBe('INDIVIDUAL');
  });

  it('checks in family group', async () => {
    const familyCheckIn = {
      id: '1',
      serviceId: mockService.id,
      timestamp: new Date(),
      type: 'FAMILY',
      members: [
        { memberId: '1', name: 'Parent' },
        { memberId: '2', name: 'Child 1' }
      ]
    };

    prismaMock.checkIn.create.mockResolvedValue(familyCheckIn);

    const result = await checkInFamily({
      serviceId: mockService.id,
      memberIds: ['1', '2']
    });

    expect(result).toEqual(familyCheckIn);
    expect(result.type).toBe('FAMILY');
    expect(result.members).toHaveLength(2);
  });

  it('handles offline check-in', async () => {
    const offlineCheckIn = {
      id: '1',
      memberId: mockMember.id,
      serviceId: mockService.id,
      timestamp: new Date(),
      syncStatus: 'PENDING'
    };

    prismaMock.checkIn.create.mockResolvedValue(offlineCheckIn);

    const result = await checkInMember({
      memberId: mockMember.id,
      serviceId: mockService.id,
      isOffline: true
    });

    expect(result.syncStatus).toBe('PENDING');
  });
});