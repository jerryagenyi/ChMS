import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { testRouteHandler } from '@/test/helpers';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    attendance: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    class: {
      findUnique: vi.fn(),
    },
    memberClass: {
      findFirst: vi.fn(),
    },
  },
}));

describe('Class Attendance API', () => {
  const mockSession = {
    user: {
      id: '1',
      organisationId: '1',
    },
  };

  const mockClass = {
    id: '1',
    name: 'Test Class',
    description: 'Test Description',
  };

  const mockAttendance = [
    {
      id: '1',
      memberId: '1',
      classId: '1',
      date: new Date('2024-03-01'),
      status: 'PRESENT',
      notes: 'On time',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as any).mockResolvedValue(mockSession);
  });

  describe('GET', () => {
    it('returns 401 if user is not authenticated', async () => {
      (getServerSession as any).mockResolvedValue(null);

      const response = await testRouteHandler(
        GET,
        'http://localhost:3000/api/attendance/class/1'
      );

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({
        error: 'Unauthorized',
      });
    });

    it('returns 404 if class does not exist', async () => {
      (prisma.class.findUnique as any).mockResolvedValue(null);

      const response = await testRouteHandler(
        GET,
        'http://localhost:3000/api/attendance/class/1'
      );

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        error: 'Class not found',
      });
    });

    it('returns attendance records for a class', async () => {
      (prisma.class.findUnique as any).mockResolvedValue(mockClass);
      (prisma.attendance.findMany as any).mockResolvedValue(mockAttendance);

      const response = await testRouteHandler(
        GET,
        'http://localhost:3000/api/attendance/class/1'
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.data).toEqual(mockAttendance);
    });

    it('handles database errors gracefully', async () => {
      (prisma.class.findUnique as any).mockRejectedValue(new Error('Database error'));

      const response = await testRouteHandler(
        GET,
        'http://localhost:3000/api/attendance/class/1'
      );

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: 'Failed to fetch attendance records',
      });
    });
  });

  describe('POST', () => {
    const mockBody = {
      memberId: '1',
      date: '2024-03-01',
      status: 'PRESENT',
      notes: 'On time',
    };

    it('returns 401 if user is not authenticated', async () => {
      (getServerSession as any).mockResolvedValue(null);

      const response = await testRouteHandler(
        POST,
        'http://localhost:3000/api/attendance/class/1',
        {
          method: 'POST',
          body: mockBody,
        }
      );

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({
        error: 'Unauthorized',
      });
    });

    it('returns 404 if class does not exist', async () => {
      (prisma.class.findUnique as any).mockResolvedValue(null);

      const response = await testRouteHandler(
        POST,
        'http://localhost:3000/api/attendance/class/1',
        {
          method: 'POST',
          body: mockBody,
        }
      );

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        error: 'Class not found',
      });
    });

    it('returns 400 if member is not enrolled in the class', async () => {
      (prisma.class.findUnique as any).mockResolvedValue(mockClass);
      (prisma.memberClass.findFirst as any).mockResolvedValue(null);

      const response = await testRouteHandler(
        POST,
        'http://localhost:3000/api/attendance/class/1',
        {
          method: 'POST',
          body: mockBody,
        }
      );

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: 'Member is not enrolled in this class',
      });
    });

    it('creates an attendance record', async () => {
      (prisma.class.findUnique as any).mockResolvedValue(mockClass);
      (prisma.memberClass.findFirst as any).mockResolvedValue({ id: '1' });
      (prisma.attendance.create as any).mockResolvedValue({
        id: '1',
        ...mockBody,
        classId: '1',
      });

      const response = await testRouteHandler(
        POST,
        'http://localhost:3000/api/attendance/class/1',
        {
          method: 'POST',
          body: mockBody,
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.data).toEqual({
        id: '1',
        ...mockBody,
        classId: '1',
      });
    });

    it('handles database errors gracefully', async () => {
      (prisma.class.findUnique as any).mockResolvedValue(mockClass);
      (prisma.memberClass.findFirst as any).mockResolvedValue({ id: '1' });
      (prisma.attendance.create as any).mockRejectedValue(new Error('Database error'));

      const response = await testRouteHandler(
        POST,
        'http://localhost:3000/api/attendance/class/1',
        {
          method: 'POST',
          body: mockBody,
        }
      );

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: 'Failed to create attendance record',
      });
    });
  });
});