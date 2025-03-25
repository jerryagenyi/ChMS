import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/users/import/route';
import { prismaMock } from '@/tests/mocks/prisma';
import { getServerSession } from 'next-auth';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}));

describe('User Import API', () => {
  const mockSession = {
    user: {
      email: 'admin@example.com',
      name: 'Admin User'
    }
  };

  const mockAdminUser = {
    id: '1',
    email: 'admin@example.com',
    role: 'ADMIN',
    organisationId: 'org1',
    organisation: {
      id: 'org1',
      name: 'Test Org'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    prismaMock.user.findUnique.mockResolvedValue(mockAdminUser as any);
  });

  it('handles unauthorized access', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const { req, res } = createMocks({
      method: 'POST',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('handles missing file', async () => {
    const formData = new FormData();
    const { req } = createMocks({
      method: 'POST',
      body: formData,
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('No file provided');
  });

  it('successfully imports valid users', async () => {
    const csvContent = `email,name,role,department
john@example.com,John Doe,MEMBER,Youth
jane@example.com,Jane Doe,MEMBER,Children`;

    const file = new File([csvContent], 'users.csv', { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', file);

    const { req } = createMocks({
      method: 'POST',
      body: formData,
    });

    prismaMock.user.create.mockResolvedValue({ id: '2' } as any);

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.successful).toBe(2);
    expect(data.failed).toBe(0);
    expect(prismaMock.user.create).toHaveBeenCalledTimes(2);
  });

  it('handles invalid data in CSV', async () => {
    const csvContent = `email,name,role,department
invalid-email,John Doe,INVALID_ROLE,Youth`;

    const file = new File([csvContent], 'users.csv', { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', file);

    const { req } = createMocks({
      method: 'POST',
      body: formData,
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.successful).toBe(0);
    expect(data.failed).toBe(1);
    expect(data.errors.length).toBe(1);
  });
});