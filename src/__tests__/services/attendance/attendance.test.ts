import { vi } from 'vitest';
import { attendanceService } from '@/services/attendance';
import { prisma } from '@/lib/prisma';
import { generateQRCode, parseQRCode } from '@/services/attendance/qr';
import { validateCheckIn } from '@/services/attendance/validation';
import { checkInMember, checkOutMember } from '@/services/attendance/check-in';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    attendance: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    member: {
      findUnique: vi.fn(),
    },
    service: {
      findUnique: vi.fn(),
    },
  },
}));

describe('Attendance Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('QR Code Operations', () => {
    const mockQRData = {
      serviceId: '123',
      memberId: '456',
      type: 'SERVICE' as const,
    };

    test('should generate valid QR code', async () => {
      const qrCode = await generateQRCode(mockQRData);
      expect(qrCode).toMatch(/^data:image\/png;base64,/);
    });

    test('should parse valid QR code data', () => {
      const qrData = JSON.stringify(mockQRData);
      const parsed = parseQRCode(qrData);
      expect(parsed).toEqual(mockQRData);
    });

    test('should throw error for invalid QR code data', () => {
      expect(() => parseQRCode('invalid-data')).toThrow('Invalid QR code data');
    });
  });

  describe('Check-in Validation', () => {
    const mockCheckInData = {
      memberId: '123',
      serviceId: '456',
      notes: 'Test notes',
    };

    const mockMember = { id: '123', name: 'Test Member' };
    const mockService = { id: '456', name: 'Test Service' };

    beforeEach(() => {
      (prisma.member.findUnique as any).mockResolvedValue(mockMember);
      (prisma.service.findUnique as any).mockResolvedValue(mockService);
      (prisma.attendance.findFirst as any).mockResolvedValue(null);
    });

    test('should validate valid check-in data', async () => {
      const result = await validateCheckIn(mockCheckInData);
      expect(result).toEqual(mockCheckInData);
    });

    test('should throw error for non-existent member', async () => {
      (prisma.member.findUnique as any).mockResolvedValue(null);
      await expect(validateCheckIn(mockCheckInData)).rejects.toThrow('Member not found');
    });

    test('should throw error for non-existent service', async () => {
      (prisma.service.findUnique as any).mockResolvedValue(null);
      await expect(validateCheckIn(mockCheckInData)).rejects.toThrow('Service not found');
    });

    test('should throw error for duplicate check-in', async () => {
      (prisma.attendance.findFirst as any).mockResolvedValue({ id: '789' });
      await expect(validateCheckIn(mockCheckInData)).rejects.toThrow('Member already checked in');
    });
  });

  describe('Check-in/Check-out Operations', () => {
    const mockCheckInData = {
      memberId: '123',
      serviceId: '456',
      notes: 'Test notes',
    };

    const mockAttendance = {
      id: '789',
      memberId: '123',
      serviceId: '456',
      checkedInAt: new Date(),
      checkedOutAt: null,
    };

    test('should check in member successfully', async () => {
      (prisma.attendance.create as any).mockResolvedValue(mockAttendance);
      const result = await checkInMember(mockCheckInData);
      expect(result).toEqual(mockAttendance);
    });

    test('should check out member successfully', async () => {
      const checkedOutAttendance = {
        ...mockAttendance,
        checkedOutAt: new Date(),
      };
      (prisma.attendance.update as any).mockResolvedValue(checkedOutAttendance);
      
      const result = await checkOutMember(mockAttendance.id);
      expect(result.checkedOutAt).toBeDefined();
    });
  });

  describe('Attendance Reporting', () => {
    const mockAttendanceData = [
      {
        id: '1',
        memberId: '123',
        serviceId: '456',
        checkedInAt: new Date(),
        member: { name: 'Test Member' },
        service: { name: 'Test Service' },
      },
    ];

    test('should get attendance report', async () => {
      (prisma.attendance.findMany as any).mockResolvedValue(mockAttendanceData);
      
      const result = await attendanceService.getReport({
        serviceId: '456',
        startDate: new Date(),
        endDate: new Date(),
      });

      expect(result).toEqual(mockAttendanceData);
    });
  });
}); 