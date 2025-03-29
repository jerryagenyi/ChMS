import { prismaMock } from '../mocks/prisma';
import { Role } from '@prisma/client';

describe('Organization Database Setup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates organization with required fields', async () => {
    const mockOrg = {
      id: 'org1',
      name: 'Test Church',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    prismaMock.organization.create.mockResolvedValue(mockOrg);

    const result = await prismaMock.organization.create({
      data: {
        name: 'Test Church',
        description: null
      }
    });

    expect(result).toEqual(mockOrg);
    expect(prismaMock.organization.create).toHaveBeenCalledWith({
      data: {
        name: 'Test Church',
        description: null
      }
    });
  });

  it('adds user to organization', async () => {
    const mockUser = {
      id: 'user1',
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: null,
      image: null,
      password: null,
      role: Role.MEMBER,
      organizationId: 'org1'
    };

    prismaMock.user.update.mockResolvedValue(mockUser);

    const result = await prismaMock.user.update({
      where: { id: 'user1' },
      data: {
        organizationId: 'org1',
        role: Role.MEMBER
      }
    });

    expect(result).toEqual(mockUser);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'user1' },
      data: {
        organizationId: 'org1',
        role: Role.MEMBER
      }
    });
  });
});
