import { describe, it, expect, beforeEach } from 'vitest';
import { GET } from '@/app/api/attendance/reports/route';
import { createMockPrismaClient, createMockRequest } from '../setup/test-setup';
import { createMockAttendance, createMockMember } from '../factories/mock-factory';
import type { MockPrismaClient } from '../setup/test-setup';

describe('Attendance Reports API', () => {
  let prismaMock: MockPrismaClient;

  beforeEach(() => {
    prismaMock = createMockPrismaClient();
  });

  it('should generate attendance report successfully', async () => {
    // Arrange
    const mockAttendances = [createMockAttendance()];
    const mockMembers = [createMockMember()];

    prismaMock.attendance.findMany.mockResolvedValue(mockAttendances);
    prismaMock.member.findMany.mockResolvedValue(mockMembers);

    const request = createMockRequest(
      'http://localhost:3000/api/attendance/reports?month=2024-01'
    );

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      data: {
        month: '2024-01',
        members: expect.arrayContaining([
          expect.objectContaining({
            id: mockMembers[0].id,
            name: `${mockMembers[0].firstName} ${mockMembers[0].lastName}`,
          }),
        ]),
        overallStats: expect.any(Object),
      },
    });
  });

  it('should handle database errors gracefully', async () => {
    // Arrange
    prismaMock.attendance.findMany.mockRejectedValue(
      new Error('Database connection failed')
    );

    const request = createMockRequest(
      'http://localhost:3000/api/attendance/reports?month=2024-01'
    );

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: 'Failed to generate attendance report',
    });
  });

  it('should validate required month parameter', async () => {
    // Arrange
    const request = createMockRequest(
      'http://localhost:3000/api/attendance/reports'
    );

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Month parameter is required',
    });
  });

  it('should validate date format', async () => {
    // Arrange
    const request = createMockRequest(
      'http://localhost:3000/api/attendance/reports?month=invalid-date'
    );

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Invalid date format',
    });
  });
});