import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { Role, Permission } from '@/types/auth';
import { withPermission } from '@/components/withPermission';

// Mock next-auth useSession hook
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe('withPermission HOC', () => {
  const DummyComponent = () => <div>Protected Content</div>;

  // Helper to mock session data
  const mockSession = (role: Role, permissions: Permission[] = []) => {
    (useSession as any).mockReturnValue({
      data: {
        user: {
          role,
          permissions,
        },
      },
      status: 'authenticated',
    });
  };

  it('allows access for users with required role', () => {
    mockSession(Role.ADMIN);
    const WrappedComponent = withPermission(DummyComponent, {
      allowedRoles: [Role.ADMIN],
    });
    render(<WrappedComponent />);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('allows access for users with higher role', () => {
    mockSession(Role.SUPER_ADMIN);
    const WrappedComponent = withPermission(DummyComponent, {
      allowedRoles: [Role.ADMIN],
    });
    render(<WrappedComponent />);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('denies access for users with insufficient role', () => {
    mockSession(Role.VIEWER);
    const WrappedComponent = withPermission(DummyComponent, {
      allowedRoles: [Role.ADMIN],
    });
    render(<WrappedComponent />);
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('allows access for users with required permission', () => {
    mockSession(Role.STAFF, ['read:members']);
    const WrappedComponent = withPermission(DummyComponent, {
      requiredPermissions: ['read:members'],
    });
    render(<WrappedComponent />);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('denies access for users without required permission', () => {
    mockSession(Role.STAFF, ['read:events']);
    const WrappedComponent = withPermission(DummyComponent, {
      requiredPermissions: ['read:members'],
    });
    render(<WrappedComponent />);
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('shows loading state when session is loading', () => {
    (useSession as any).mockReturnValue({
      data: null,
      status: 'loading',
    });
    const WrappedComponent = withPermission(DummyComponent, {
      allowedRoles: [Role.ADMIN],
    });
    render(<WrappedComponent />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to login', () => {
    const mockPush = vi.fn();
    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }));

    (useSession as any).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    const WrappedComponent = withPermission(DummyComponent, {
      allowedRoles: [Role.ADMIN],
    });
    render(<WrappedComponent />);
    expect(mockPush).toHaveBeenCalledWith('/auth/signin');
  });

  it('handles both role and permission requirements', () => {
    mockSession(Role.ADMIN, ['read:members', 'write:members']);
    const WrappedComponent = withPermission(DummyComponent, {
      allowedRoles: [Role.ADMIN],
      requiredPermissions: ['read:members', 'write:members'],
    });
    render(<WrappedComponent />);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('denies access when role is sufficient but permissions are missing', () => {
    mockSession(Role.ADMIN, ['read:events']);
    const WrappedComponent = withPermission(DummyComponent, {
      allowedRoles: [Role.ADMIN],
      requiredPermissions: ['read:members'],
    });
    render(<WrappedComponent />);
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });
});
