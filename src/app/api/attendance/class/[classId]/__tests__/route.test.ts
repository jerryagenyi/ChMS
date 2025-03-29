import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from '../route';
import { createMockPrismaClient, createMockRequest } from '@/tests/setup/test-setup';
import { createMockMember, createMockService } from '@/tests/factories/mock-factory';
import { getServerSession } from 'next-auth';
import type { MockPrismaClient } from '@/tests/setup/test-setup';

describe('Class Attendance API', () => {
  let prismaMock: MockPrismaClient;

  const mockSession = {
    user: {
      id: '1',
      organizationId: '1',
    },
  };

  beforeEach(() => {
    prismaMock = createMockPrismaClient();
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
  });

  describe('POST', () => {
    const mockMember = createMockMember();
    const mockService = createMockService();
    
    const mockBody = {
      memberId: mockMember.id,
      date: '2024-03-01',
      status: 'PRESENT',
      notes: 'On time',
    };

    it('handles database errors gracefully', async () => {
      prismaMock.class.findFirst.mockResolvedValue({ id: '1', name: 'Test Class' } as any);
      prismaMock.memberClass.findFirst.mockResolvedValue({ id: '1' } as any);
      prismaMock.attendance.create.mockRejectedValue(new Error('Database error'));

      const request = createMockRequest('http://localhost:3000/api/attendance/class/1', {
        method: 'POST',
        body: mockBody,
        params: { classId: '1' },
      });

      const response = await POST(request, { params: { classId: '1' } });
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({
        error: 'Failed to create attendance record',
      });
    });

    it('validates required parameters', async () => {
      const request = createMockRequest('http://localhost:3000/api/attendance/class/1', {
        method: 'POST',
        body: {},
        params: { classId: '1' },
      });

      const response = await POST(request, { params: { classId: '1' } });
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid request body');
    });
  });

  describe('GET', () => {
    it('returns attendance records for a class', async () => {
      const mockMember = createMockMember();
      const mockAttendance = [{
        id: '1',
        memberId: mockMember.id,
        firstName: mockMember.firstName,
        lastName: mockMember.lastName,
        date: '2024-03-01',
        status: 'PRESENT',
      }];

      prismaMock.attendance.findMany.mockResolvedValue(mockAttendance as any);

      const request = createMockRequest('http://localhost:3000/api/attendance/class/1', {
        method: 'GET',
        params: { classId: '1' },
      });

      const response = await GET(request, { params: { classId: '1' } });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockAttendance);
    });
  });
});
