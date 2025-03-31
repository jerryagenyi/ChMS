import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useRouter } from 'next/router';
import { LoginForm } from '@/components/auth/LoginForm';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { useSession } from '@/hooks/useSession';

// Mock next/router
vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}));

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock session hook
vi.mock('@/hooks/useSession', () => ({
  useSession: vi.fn(),
}));

// Test data
const mockUser = {
  id: '123',
  email: 'test@example.com',
  name: 'Test User',
  roles: ['admin'],
  permissions: ['read:users', 'write:users'],
};

const mockSession = {
  user: mockUser,
  accessToken: 'mock-token',
  expiresAt: new Date(Date.now() + 3600000).toISOString(),
};

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      pathname: '/',
    }));
  });

  describe('Login → Session', () => {
    it('completes login flow and establishes session', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSession),
        })
      );

      (useSession as jest.Mock).mockImplementation(() => ({
        data: null,
        status: 'unauthenticated',
        signIn: vi.fn(),
        signOut: vi.fn(),
      }));

      render(
        <SessionProvider>
          <LoginForm />
        </SessionProvider>
      );

      // Fill in login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/auth/login',
          expect.objectContaining({
            method: 'POST',
            body: expect.any(String),
          })
        );
      });

      // Verify session establishment
      (useSession as jest.Mock).mockImplementation(() => ({
        data: mockSession,
        status: 'authenticated',
        signIn: vi.fn(),
        signOut: vi.fn(),
      }));

      await waitFor(() => {
        expect(useRouter().push).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('handles invalid credentials', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: 'Invalid credentials' }),
        })
      );

      render(
        <SessionProvider>
          <LoginForm />
        </SessionProvider>
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'wrong@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpass' },
      });

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Permissions → Logout', () => {
    it('enforces permission-based access control', async () => {
      (useSession as jest.Mock).mockImplementation(() => ({
        data: mockSession,
        status: 'authenticated',
        signIn: vi.fn(),
        signOut: vi.fn(),
      }));

      const ProtectedComponent = () => (
        <PermissionGuard requiredPermissions={['read:users']}>
          <div>Protected Content</div>
        </PermissionGuard>
      );

      render(
        <SessionProvider>
          <ProtectedComponent />
        </SessionProvider>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();

      // Test with insufficient permissions
      (useSession as jest.Mock).mockImplementation(() => ({
        data: {
          ...mockSession,
          user: { ...mockUser, permissions: [] },
        },
        status: 'authenticated',
        signIn: vi.fn(),
        signOut: vi.fn(),
      }));

      render(
        <SessionProvider>
          <ProtectedComponent />
        </SessionProvider>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('handles logout flow', async () => {
      const signOut = vi.fn();
      (useSession as jest.Mock).mockImplementation(() => ({
        data: mockSession,
        status: 'authenticated',
        signIn: vi.fn(),
        signOut,
      }));

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      );

      render(
        <SessionProvider>
          <button onClick={() => signOut()}>Logout</button>
        </SessionProvider>
      );

      fireEvent.click(screen.getByText('Logout'));

      await waitFor(() => {
        expect(signOut).toHaveBeenCalled();
        expect(useRouter().replace).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('Session Management', () => {
    it('handles session expiry', async () => {
      const expiredSession = {
        ...mockSession,
        expiresAt: new Date(Date.now() - 1000).toISOString(),
      };

      (useSession as jest.Mock).mockImplementation(() => ({
        data: expiredSession,
        status: 'authenticated',
        signIn: vi.fn(),
        signOut: vi.fn(),
      }));

      render(
        <SessionProvider>
          <div>Protected Content</div>
        </SessionProvider>
      );

      await waitFor(() => {
        expect(useRouter().replace).toHaveBeenCalledWith('/login');
      });
    });

    it('refreshes session token', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              ...mockSession,
              accessToken: 'new-token',
            }),
        })
      );

      const nearExpirySession = {
        ...mockSession,
        expiresAt: new Date(Date.now() + 300000).toISOString(), // 5 minutes until expiry
      };

      (useSession as jest.Mock).mockImplementation(() => ({
        data: nearExpirySession,
        status: 'authenticated',
        signIn: vi.fn(),
        signOut: vi.fn(),
      }));

      render(
        <SessionProvider>
          <div>Protected Content</div>
        </SessionProvider>
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/refresh', expect.any(Object));
      });
    });
  });

  describe('Error Handling', () => {
    it('handles network errors during authentication', async () => {
      mockFetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

      render(
        <SessionProvider>
          <LoginForm />
        </SessionProvider>
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('handles session validation errors', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 403,
          json: () => Promise.resolve({ error: 'Invalid session' }),
        })
      );

      (useSession as jest.Mock).mockImplementation(() => ({
        data: mockSession,
        status: 'authenticated',
        signIn: vi.fn(),
        signOut: vi.fn(),
      }));

      render(
        <SessionProvider>
          <div>Protected Content</div>
        </SessionProvider>
      );

      await waitFor(() => {
        expect(useRouter().replace).toHaveBeenCalledWith('/login');
      });
    });
  });
});
