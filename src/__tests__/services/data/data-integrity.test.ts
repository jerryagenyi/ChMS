import { vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { db } from '@/services/db';
import { organizationService } from '@/services/organization';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
    attendance: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    member: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
    service: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
    organization: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('Data Integrity Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Database Operations', () => {
    test('should handle transactions correctly', async () => {
      const mockData = { id: '1', name: 'Test' };
      (prisma.$transaction as any).mockResolvedValue(mockData);

      const result = await db.attendance.create({
        data: mockData,
      });

      expect(result).toEqual(mockData);
    });

    test('should handle transaction failures', async () => {
      const error = new Error('Transaction failed');
      (prisma.$transaction as any).mockRejectedValue(error);

      await expect(
        db.attendance.create({
          data: { id: '1', name: 'Test' },
        })
      ).rejects.toThrow('Transaction failed');
    });
  });

  describe('Organization Data Integrity', () => {
    const mockOrg = {
      id: '1',
      name: 'Test Church',
    };

    test('should get current organization', async () => {
      (prisma.organization.findFirst as any).mockResolvedValue(mockOrg);
      const result = await organizationService.getCurrentOrg();
      expect(result).toEqual(mockOrg);
    });

    test('should update organization with data validation', async () => {
      const updateData = {
        name: 'Updated Church',
      };
      (prisma.organization.update as any).mockResolvedValue({
        ...mockOrg,
        ...updateData,
      });

      const result = await organizationService.updateOrg(updateData);
      expect(result.name).toBe('Updated Church');
    });
  });

  describe('Member Data Integrity', () => {
    const mockMembers = [
      { id: '1', name: 'Member 1', organizationId: '1' },
      { id: '2', name: 'Member 2', organizationId: '1' },
    ];

    test('should get members with organization context', async () => {
      (prisma.organization.findFirst as any).mockResolvedValue({ id: '1' });
      (prisma.member.findMany as any).mockResolvedValue(mockMembers);

      const result = await organizationService.getMembers({});
      expect(result).toEqual(mockMembers);
      expect(prisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: '1',
          }),
        })
      );
    });
  });

  describe('Service Data Integrity', () => {
    const mockServices = [
      { id: '1', name: 'Service 1', organizationId: '1' },
      { id: '2', name: 'Service 2', organizationId: '1' },
    ];

    test('should get services with organization context', async () => {
      (prisma.organization.findFirst as any).mockResolvedValue({ id: '1' });
      (prisma.service.findMany as any).mockResolvedValue(mockServices);

      const result = await organizationService.getServices({});
      expect(result).toEqual(mockServices);
      expect(prisma.service.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: '1',
          }),
        })
      );
    });
  });

  describe('Attendance Data Integrity', () => {
    const mockAttendance = [
      { id: '1', memberId: '1', serviceId: '1', organizationId: '1' },
      { id: '2', memberId: '2', serviceId: '1', organizationId: '1' },
    ];

    test('should get attendance with organization context', async () => {
      (prisma.organization.findFirst as any).mockResolvedValue({ id: '1' });
      (prisma.attendance.findMany as any).mockResolvedValue(mockAttendance);

      const result = await organizationService.getAttendance({});
      expect(result).toEqual(mockAttendance);
      expect(prisma.attendance.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: '1',
          }),
        })
      );
    });
  });
}); 