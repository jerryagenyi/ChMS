import { prismaMock } from '../mocks/prisma';
import { Role } from '@prisma/client';

describe('User Registration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new user successfully', async () => {
    const mockUser = {
      id: 'user1',
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: null,
      image: null,
      password: 'hashedPassword123',
      role: Role.MEMBER,
      organisationId: null
    };

    prismaMock.user.create.mockResolvedValue(mockUser);

    const result = await prismaMock.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        role: Role.MEMBER,
        organisationId: null
      }
    });

    expect(result).toEqual(mockUser);
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: expect.any(String),
        role: Role.MEMBER,
        organisationId: null
      }
    });
  });

  it('handles duplicate email registration', async () => {
    prismaMock.user.create.mockRejectedValue(new Error('Unique constraint failed on the fields: (`email`)'));

    await expect(prismaMock.user.create({
      data: {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        role: Role.MEMBER,
        organisationId: null
      }
    })).rejects.toThrow('Unique constraint failed on the fields: (`email`)');
  });
});
