import { vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { DataIntegrityService } from '@/services/data-integrity/DataIntegrityService';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
    member: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
    attendance: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    event: {
      findMany: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('DataIntegrityService', () => {
  let service: DataIntegrityService;

  beforeEach(() => {
    service = new DataIntegrityService();
    vi.clearAllMocks();
  });

  describe('cleanOrphanedAttendance', () => {
    test('should remove attendance records with non-existent members or events', async () => {
      const mockAttendance = [
        { id: 1, memberId: '1', eventId: '1' },
        { id: 2, memberId: '2', eventId: '2' },
      ];

      const mockMembers = [{ id: '1' }];
      const mockEvents = [{ id: '1' }];

      (prisma.attendance.findMany as any).mockResolvedValue(mockAttendance);
      (prisma.member.findMany as any).mockResolvedValue(mockMembers);
      (prisma.event.findMany as any).mockResolvedValue(mockEvents);
      (prisma.attendance.deleteMany as any).mockResolvedValue({ count: 1 });

      const result = await service.cleanOrphanedAttendance();

      expect(prisma.attendance.findMany).toHaveBeenCalled();
      expect(prisma.member.findMany).toHaveBeenCalled();
      expect(prisma.event.findMany).toHaveBeenCalled();
      expect(prisma.attendance.deleteMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { memberId: { notIn: ['1'] } },
            { eventId: { notIn: ['1'] } },
          ],
        },
      });
      expect(result).toEqual({ deletedCount: 1 });
    });
  });

  describe('cleanOrphanedEvents', () => {
    test('should remove events with no attendees', async () => {
      const mockEvents = [
        { id: '1', name: 'Event 1' },
        { id: '2', name: 'Event 2' },
      ];

      const mockAttendance = [
        { eventId: '1', memberId: '1' },
      ];

      (prisma.event.findMany as any).mockResolvedValue(mockEvents);
      (prisma.attendance.findMany as any).mockResolvedValue(mockAttendance);
      (prisma.$transaction as any).mockImplementation((callback: (prisma: PrismaClient) => Promise<any>) => callback(prisma));
      (prisma.event.delete as any).mockResolvedValue({ id: '2' });

      const result = await service.cleanOrphanedEvents();

      expect(prisma.event.findMany).toHaveBeenCalled();
      expect(prisma.attendance.findMany).toHaveBeenCalled();
      expect(prisma.event.delete).toHaveBeenCalledWith({
        where: { id: '2' },
      });
      expect(result).toEqual({ deletedCount: 1 });
    });
  });

  describe('updateMembershipStatus', () => {
    test('should update inactive members', async () => {
      const mockMembers = [
        { 
          id: '1', 
          lastAttendance: new Date('2023-01-01'),
          status: 'ACTIVE',
        },
      ];

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      (prisma.member.findMany as any).mockResolvedValue(mockMembers);
      (prisma.member.update as any).mockResolvedValue({ id: '1', status: 'INACTIVE' });

      const result = await service.updateMembershipStatus();

      expect(prisma.member.findMany).toHaveBeenCalledWith({
        where: {
          status: 'ACTIVE',
          lastAttendance: {
            lt: expect.any(Date),
          },
        },
      });
      expect(prisma.member.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'INACTIVE' },
      });
      expect(result).toEqual({ updatedCount: 1 });
    });
  });
}); 