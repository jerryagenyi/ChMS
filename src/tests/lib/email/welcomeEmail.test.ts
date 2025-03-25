import { sendWelcomeEmail } from '@/lib/email/welcomeEmail';

describe('Welcome Email', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    organisation: {
      name: 'Test Organization'
    }
  };

  const mockPassword = 'tempPass123';

  beforeEach(() => {
    // Clear console mock between tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('logs email content with correct user information', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    await sendWelcomeEmail(mockUser as any, mockPassword);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Sending welcome email to:',
      mockUser.email
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Email content:',
      expect.stringContaining(mockUser.email)
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Email content:',
      expect.stringContaining(mockPassword)
    );
  });

  it('includes organization name in email content', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    await sendWelcomeEmail(mockUser as any, mockPassword);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Email content:',
      expect.stringContaining(mockUser.organisation.name)
    );
  });
});