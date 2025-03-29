import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PasswordSetup from '@/components/auth/PasswordSetup';
import { useToast } from '@chakra-ui/react';

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: vi.fn(() => vi.fn()),
  };
});

describe('PasswordSetup', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders password setup form', () => {
    render(<PasswordSetup onComplete={mockOnComplete} />);
    
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /set password/i })).toBeInTheDocument();
  });

  it('validates password requirements', async () => {
    render(<PasswordSetup onComplete={mockOnComplete} />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('validates password match', async () => {
    render(<PasswordSetup onComplete={mockOnComplete} />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
    fireEvent.change(confirmInput, { target: { value: 'DifferentPass123!' } });
    
    await waitFor(() => {
      expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid passwords', async () => {
    const mockToast = vi.fn();
    vi.mocked(useToast).mockReturnValue(mockToast);

    render(<PasswordSetup onComplete={mockOnComplete} />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
    fireEvent.change(confirmInput, { target: { value: 'StrongPass123!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /set password/i }));
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Password set successfully',
        status: 'success',
      });
    });
  });
});