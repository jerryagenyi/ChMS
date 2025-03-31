import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import SessionProvider from '@/components/ui/SessionProvider';
import { mockSession } from '@/__tests__/__mocks__/next-auth';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

describe('SessionProvider', () => {
  const TestChild = () => {
    const { data: session, status } = useSession();
    return (
      <div>
        <div data-testid="session-status">{status}</div>
        {session?.user && <div data-testid="user-email">{session.user.email}</div>}
      </div>
    );
  };

  it('provides session data to children', () => {
    (useSession as any).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    });

    render(
      <SessionProvider session={mockSession}>
        <TestChild />
      </SessionProvider>
    );

    expect(screen.getByTestId('session-status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent(mockSession.user.email);
  });

  it('handles loading state', () => {
    (useSession as any).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(
      <SessionProvider session={null}>
        <TestChild />
      </SessionProvider>
    );

    expect(screen.getByTestId('session-status')).toHaveTextContent('loading');
    expect(screen.queryByTestId('user-email')).not.toBeInTheDocument();
  });

  it('handles unauthenticated state', () => {
    (useSession as any).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(
      <SessionProvider session={null}>
        <TestChild />
      </SessionProvider>
    );

    expect(screen.getByTestId('session-status')).toHaveTextContent('unauthenticated');
    expect(screen.queryByTestId('user-email')).not.toBeInTheDocument();
  });
});
