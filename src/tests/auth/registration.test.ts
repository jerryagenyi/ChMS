import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest } from '../utils/test-helpers';
import { getServerSession } from 'next-auth';
import { prismaMock } from '../mocks/prisma';
import { Role } from '@prisma/client';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}));

describe('User Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a new user successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      organizationId: 'org1',
    };

    vi.mocked(getServerSession).mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(mockUser);

    const request = createMockRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      },
    });

    const response = await fetch(request);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data).toEqual({
      success: true,
      user: mockUser,
    });
  });

  it('handles duplicate email registration', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    prismaMock.user.create.mockRejectedValue(new Error('Unique constraint failed on the fields: (`email`)'));

    const request = createMockRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      },
    });

    const response = await fetch(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toEqual({
      error: 'Email already exists',
    });
  });
});
