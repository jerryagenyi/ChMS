import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import PasswordSetup from '../PasswordSetup';

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('PasswordSetup', () => {
  it('renders password input fields', () => {
    renderWithChakra(<PasswordSetup onSubmit={() => {}} />);

    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates matching passwords', () => {
    renderWithChakra(<PasswordSetup onSubmit={() => {}} />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/^confirm password$/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });

    expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
  });

  it('calls onSubmit with password when passwords match', () => {
    const handleSubmit = vi.fn();
    renderWithChakra(<PasswordSetup onSubmit={handleSubmit} />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/^confirm password$/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith('password123');
  });
});
