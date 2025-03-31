import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { mockSession, mockUpdate, mockUseSession } from '@/__tests__/__mocks__/next-auth';
import { mockPush, useRouter } from '@/__tests__/__mocks__/next-router';
import { PermissionGuard } from '@/components/auth/PermissionGuard';

vi.mock('next-auth/react');
vi.mock('next/router');

const TestComponent = () => <div>Protected Content</div>;

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('PermissionGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    (useSession as any).mockReturnValue({
      data: null,
      status: 'loading',
      update: mockUpdate,
    });

    renderWithChakra(
      <PermissionGuard requiredPermissions={['read:users']}>
        <TestComponent />
      </PermissionGuard>
    );

    expect(screen.getByTestId('permission-guard-loading')).toBeInTheDocument();
  });

  it('renders children when user has required permissions', async () => {
    (useSession as any).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: mockUpdate,
    });

    renderWithChakra(
      <PermissionGuard requiredPermissions={['read:users']}>
        <TestComponent />
      </PermissionGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', async () => {
    (useSession as any).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: mockUpdate,
    });

    renderWithChakra(
      <PermissionGuard requiredPermissions={['read:users']}>
        <TestComponent />
      </PermissionGuard>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/auth/login',
        query: { returnUrl: '/protected-route' },
      });
    });
  });

  it('shows access denied when user lacks required permissions', async () => {
    (useSession as any).mockReturnValue({
      data: {
        ...mockSession,
        user: {
          ...mockSession.user,
          permissions: [],
        },
      },
      status: 'authenticated',
      update: mockUpdate,
    });

    renderWithChakra(
      <PermissionGuard requiredPermissions={['read:users']}>
        <TestComponent />
      </PermissionGuard>
    );

    expect(screen.getByTestId('permission-guard-denied')).toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('handles multiple required permissions correctly', async () => {
    (useSession as any).mockReturnValue({
      data: {
        ...mockSession,
        user: {
          ...mockSession.user,
          permissions: ['read:users', 'write:users'],
        },
      },
      status: 'authenticated',
      update: mockUpdate,
    });

    renderWithChakra(
      <PermissionGuard requiredPermissions={['read:users', 'write:users']}>
        <TestComponent />
      </PermissionGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('maintains accessibility during state changes', async () => {
    (useSession as any).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: mockUpdate,
    });

    renderWithChakra(
      <PermissionGuard requiredPermissions={['read:users']}>
        <TestComponent />
      </PermissionGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByTestId('permission-guard-loading')).not.toBeInTheDocument();
  });
});
