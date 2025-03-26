import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import { generateReport } from '../route';
import prisma from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    attendance: {
      findMany: vi.fn(),
    },
  },
}));

describe('Attendance Reports API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles database errors gracefully', async () => {
    // Mock prisma to throw an error
    (prisma.attendance.findMany as any).mockRejectedValue(new Error('DB Error'));

    const response = await generateReport();
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ error: 'Failed to generate attendance report' });
  });

  // Add more test cases here...
}); 
