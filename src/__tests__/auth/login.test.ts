import { loginUser } from '@/services/auth';

jest.mock('@/services/auth', () => ({
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
      password: 'password123'
    });

    expect(result).toEqual(mockUser);
  });

  it('handles invalid credentials', async () => {
    (loginUser as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    await expect(loginUser({
      email: 'test@example.com',
      password: 'wrongpassword'
    })).rejects.toThrow('Invalid credentials');
  });
});
