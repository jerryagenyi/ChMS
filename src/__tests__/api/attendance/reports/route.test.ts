// Move the entire content of src/app/api/attendance/reports/__tests__/route.test.ts hereimport { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    attendance: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    member: {
      findMany: vi.fn(),
    },
    class: {
      findUnique: vi.fn(),
    },
  },
}));

describe('Attendance Reports API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles successful attendance report generation', async () => {
    const mockAttendanceData = [
      {
        id: '1',
        date: new Date('2024-01-01'),
        memberId: '1',
        serviceId: '1',
        status: 'PRESENT',
      },
    ];

    const mockMembers = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
    ];

    (prisma.attendance.findMany as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(mockAttendanceData);
    (prisma.member.findMany as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(mockMembers);

    const request = new Request(
      'http://localhost:3000/api/attendance/reports?month=2024-01',
      { method: 'GET' }
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('month');
    expect(data.data).toHaveProperty('members');
    expect(data.data).toHaveProperty('overallStats');
  });

  it('handles database errors gracefully', async () => {
    (prisma.attendance.findMany as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error('Database error'));

    const request = new Request(
      'http://localhost:3000/api/attendance/reports?month=2024-01',
      { method: 'GET' }
    );

    const response = await GET(request);
    expect(response.status).toBe(500);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  it('validates required query parameters', async () => {
    const request = new Request(
      'http://localhost:3000/api/attendance/reports',
      { method: 'GET' }
    );

    const response = await GET(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Month parameter is required');
  });

  it('handles invalid date format', async () => {
    const request = new Request(
      'http://localhost:3000/api/attendance/reports?month=invalid-date',
      { method: 'GET' }
    );

    const response = await GET(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Invalid date format');
  });
});
