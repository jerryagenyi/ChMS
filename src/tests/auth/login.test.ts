import { jest } from '@jest/globals';
import { loginUser } from '@/lib/auth';

jest.mock('@/lib/auth', () => ({
  loginUser: jest.fn()
}));

describe('User Login', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('authenticates user with valid credentials', async () => {
    (loginUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await loginUser({
      email: 'test@example.com',
      password: 'validPassword123'
    });

    expect(result).toEqual(mockUser);
    expect(loginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'validPassword123'
    });
  });

  it('handles invalid credentials', async () => {
    (loginUser as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    await expect(loginUser({
      email: 'test@example.com',
      password: 'wrongPassword'
    })).rejects.toThrow('Invalid credentials');
  });
});
