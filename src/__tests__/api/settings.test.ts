import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest } from '../utils/test-helpers';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

describe('Settings API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles successful settings update', async () => {
    const mockSession = {
      user: {
        id: '1',
        organizationId: '1',
      },
    };

    vi.mocked(getServerSession).mockResolvedValue(mockSession);

    const request = createMockRequest('http://localhost:3000/api/settings', {
      method: 'POST',
      body: {
        organizationName: 'Test Church',
        timezone: 'UTC',
      },
    });

    const response = await fetch(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      success: true,
      message: 'Settings updated successfully',
    });
  });

  it('handles unauthorized access', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = createMockRequest('http://localhost:3000/api/settings', {
      method: 'POST',
      body: {
        organizationName: 'Test Church',
        timezone: 'UTC',
      },
    });

    const response = await fetch(request);
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data).toEqual({
      error: 'Unauthorized',
    });
  });
}); 