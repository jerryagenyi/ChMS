import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckInButton from './CheckInButton';

describe('CheckInButton', () => {
  const mockOnCheckIn = jest.fn();

  beforeEach(() => {
    mockOnCheckIn.mockReset();
  });

  it('renders with default props', () => {
    render(<CheckInButton onCheckIn={mockOnCheckIn} />);
    expect(screen.getByText('Check In')).toBeInTheDocument();
  });

  it('renders with custom children', () => {
    render(<CheckInButton onCheckIn={mockOnCheckIn}>Custom Text</CheckInButton>);
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  it('handles successful check-in', async () => {
    mockOnCheckIn.mockResolvedValue(undefined);
    render(<CheckInButton onCheckIn={mockOnCheckIn} />);

    const button = screen.getByText('Check In');
    fireEvent.click(button);

    expect(screen.getByText('Checking in...')).toBeInTheDocument();
    await waitFor(() => {
      expect(mockOnCheckIn).toHaveBeenCalledTimes(1);
    });
  });

  it('handles check-in error', async () => {
    const error = new Error('Check-in failed');
    mockOnCheckIn.mockRejectedValue(error);
    render(<CheckInButton onCheckIn={mockOnCheckIn} />);

    const button = screen.getByText('Check In');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Check-in failed')).toBeInTheDocument();
    });
  });

  it('disables button while checking in', async () => {
    mockOnCheckIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<CheckInButton onCheckIn={mockOnCheckIn} />);

    const button = screen.getByText('Check In');
    fireEvent.click(button);

    expect(button).toBeDisabled();
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('respects external loading state', () => {
    render(<CheckInButton onCheckIn={mockOnCheckIn} isLoading={true} />);
    expect(screen.getByText('Checking in...')).toBeInTheDocument();
  });

  it('respects external disabled state', () => {
    render(<CheckInButton onCheckIn={mockOnCheckIn} isDisabled={true} />);
    expect(screen.getByText('Check In')).toBeDisabled();
  });

  it('applies custom button props', () => {
    render(
      <CheckInButton onCheckIn={mockOnCheckIn} variant="outline" size="lg" colorScheme="green" />
    );

    const button = screen.getByText('Check In');
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-size', 'lg');
    expect(button).toHaveAttribute('data-color-scheme', 'green');
  });
});
