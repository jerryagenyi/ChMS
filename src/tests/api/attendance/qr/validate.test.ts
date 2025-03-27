import { describe, it, expect, beforeEach } from 'vitest';
import { createMockRequest } from '@/tests/utils/test-helpers';
import { prismaMock } from '@/tests/mocks/prisma';
import { POST } from '@/app/api/attendance/qr/validate/route';
import { mockSession } from '@/tests/setup/test-setup';

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(() => mockSession),
}));

describe('POST /api/attendance/qr/validate', () => {
  const validQRData = {
    classId: '123e4567-e89b-12d3-a456-426614174000',
    timestamp: Date.now(),
    expiryMinutes: 5
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates a valid QR code', async () => {
    prismaMock.class.findFirst.mockResolvedValue({
      id: validQRData.classId,
      name: 'Test Class',
      organisationId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = createMockRequest('/api/attendance/qr/validate', {
      method: 'POST',
      body: { qrData: JSON.stringify(validQRData) }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data).toEqual({
      data: {
        classId: validQRData.classId,
        isValid: true,
      }
    });
  });

  it('returns 401 when no session exists', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const request = createMockRequest('/api/attendance/qr/validate', {
      method: 'POST',
      body: { qrData: JSON.stringify(validQRData) }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ error: 'Unauthorized' });
  });

  it('returns 404 when class not found', async () => {
    prismaMock.class.findFirst.mockResolvedValue(null);

    const request = createMockRequest('/api/attendance/qr/validate', {
      method: 'POST',
      body: { qrData: JSON.stringify(validQRData) }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Class not found' });
  });
});