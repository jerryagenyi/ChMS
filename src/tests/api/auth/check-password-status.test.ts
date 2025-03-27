import { describe, it, expect, beforeEach } from 'vitest';
import { createMockRequest } from '@/tests/utils/test-helpers';
import { prismaMock } from '@/tests/mocks/prisma';
import { GET } from '@/app/api/auth/check-password-status/route';
import { mockSession } from '@/tests/setup/test-setup';

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(() => mockSession),
}));

describe('GET /api/auth/check-password-status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns needsPassword true when user has no password', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: null,
      name: 'Test User',
      role: 'MEMBER',
      organisationId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = createMockRequest('/api/auth/check-password-status');
    const response = await GET(request);
    const data = await response.json();

    expect(data).toEqual({ needsPassword: true });
  });

  it('returns needsPassword false when user has password', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword',
      name: 'Test User',
      role: 'MEMBER',
      organisationId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = createMockRequest('/api/auth/check-password-status');
    const response = await GET(request);
    const data = await response.json();

    expect(data).toEqual({ needsPassword: false });
  });

  it('returns needsPassword false when no session exists', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const request = createMockRequest('/api/auth/check-password-status');
    const response = await GET(request);
    const data = await response.json();

    expect(data).toEqual({ needsPassword: false });
  });
});