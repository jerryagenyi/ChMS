import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckInForm } from '@/components/features/attendance/CheckInForm/CheckInForm';
import {
  Service,
  Location,
  CheckInFormData,
  CheckInFormProps,
} from '@/components/features/attendance/CheckInForm/types';

// Mock Chakra UI toast
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => vi.fn(),
  };
});

describe('CheckInForm', () => {
  const mockServices: Service[] = [
    { id: '1', name: 'Sunday Service', date: new Date('2024-03-17') },
    { id: '2', name: 'Bible Study', date: new Date('2024-03-20') },
  ];

  const mockLocations: Location[] = [
    { id: 'loc1', name: 'Main Hall', capacity: 200 },
    { id: 'loc2', name: 'Chapel', capacity: 50 },
  ];

  const mockOnSubmit: CheckInFormProps['onSubmit'] = vi.fn().mockResolvedValue(undefined);

  const defaultProps: CheckInFormProps = {
    services: mockServices,
    locations: mockLocations,
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Form rendering
  it('renders all form fields correctly', () => {
    render(<CheckInForm {...defaultProps} />);

    expect(screen.getByLabelText(/member id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check in/i })).toBeInTheDocument();
  });

  it('renders service options correctly', () => {
    render(<CheckInForm {...defaultProps} />);
    const serviceSelect = screen.getByLabelText(/service/i);
    fireEvent.click(serviceSelect);

    mockServices.forEach(service => {
      const optionText = `${service.name} - ${new Date(service.date).toLocaleDateString()}`;
      expect(screen.getByText(optionText)).toBeInTheDocument();
    });
  });

  it('renders location options correctly', () => {
    render(<CheckInForm {...defaultProps} />);
    const locationSelect = screen.getByLabelText(/location/i);
    fireEvent.click(locationSelect);

    mockLocations.forEach(location => {
      const optionText = location.capacity
        ? `${location.name} (Capacity: ${location.capacity})`
        : location.name;
      expect(screen.getByText(optionText)).toBeInTheDocument();
    });
  });

  // 2. Form validation
  it('shows validation errors for required fields when submitting empty form', async () => {
    render(<CheckInForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /check in/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText('Member ID is required')).toBeInTheDocument();
    expect(await screen.findByText('Service is required')).toBeInTheDocument();
    expect(await screen.findByText('Location is required')).toBeInTheDocument();
  });

  // 3. Form submission
  it('calls onSubmit with correct data when form is valid', async () => {
    render(<CheckInForm {...defaultProps} />);

    await userEvent.type(screen.getByLabelText(/member id/i), 'MEMBER123');
    await userEvent.selectOptions(screen.getByLabelText(/service/i), '1');
    await userEvent.selectOptions(screen.getByLabelText(/location/i), 'loc1');
    await userEvent.type(screen.getByLabelText(/notes/i), 'Test note');

    const submitButton = screen.getByRole('button', { name: /check in/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        memberId: 'MEMBER123',
        serviceId: '1',
        location: 'loc1',
        notes: 'Test note',
      });
    });
  });

  // 4. Loading states
  it('disables form fields and shows loading state during submission', async () => {
    const slowMockSubmit: CheckInFormProps['onSubmit'] = vi
      .fn()
      .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<CheckInForm {...defaultProps} onSubmit={slowMockSubmit} />);

    await userEvent.type(screen.getByLabelText(/member id/i), 'MEMBER123');
    await userEvent.selectOptions(screen.getByLabelText(/service/i), '1');
    await userEvent.selectOptions(screen.getByLabelText(/location/i), 'loc1');

    const submitButton = screen.getByRole('button', { name: /check in/i });
    await userEvent.click(submitButton);

    expect(submitButton).toHaveAttribute('disabled');
    expect(screen.getByLabelText(/member id/i)).toBeDisabled();
    expect(screen.getByLabelText(/service/i)).toBeDisabled();
    expect(screen.getByLabelText(/location/i)).toBeDisabled();
    expect(screen.getByLabelText(/notes/i)).toBeDisabled();
    expect(screen.getByText('Checking in...')).toBeInTheDocument();
  });

  // 5. Error states
  it('displays error message when submission fails', async () => {
    const mockError = new Error('Failed to check in');
    const failingMockSubmit: CheckInFormProps['onSubmit'] = vi.fn().mockRejectedValue(mockError);
    render(<CheckInForm {...defaultProps} onSubmit={failingMockSubmit} />);

    await userEvent.type(screen.getByLabelText(/member id/i), 'MEMBER123');
    await userEvent.selectOptions(screen.getByLabelText(/service/i), '1');
    await userEvent.selectOptions(screen.getByLabelText(/location/i), 'loc1');

    const submitButton = screen.getByRole('button', { name: /check in/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(mockError.message)).toBeInTheDocument();
  });

  // 6. Success feedback
  it('resets form after successful submission', async () => {
    render(<CheckInForm {...defaultProps} />);

    await userEvent.type(screen.getByLabelText(/member id/i), 'MEMBER123');
    await userEvent.selectOptions(screen.getByLabelText(/service/i), '1');
    await userEvent.selectOptions(screen.getByLabelText(/location/i), 'loc1');
    await userEvent.type(screen.getByLabelText(/notes/i), 'Test note');

    const submitButton = screen.getByRole('button', { name: /check in/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/member id/i)).toHaveValue('');
      expect(screen.getByLabelText(/notes/i)).toHaveValue('');
    });
  });

  // 7. Props handling
  it('handles disabled state correctly', () => {
    render(<CheckInForm {...defaultProps} isDisabled={true} />);

    expect(screen.getByLabelText(/member id/i)).toBeDisabled();
    expect(screen.getByLabelText(/service/i)).toBeDisabled();
    expect(screen.getByLabelText(/location/i)).toBeDisabled();
    expect(screen.getByLabelText(/notes/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /check in/i })).toBeDisabled();
  });

  it('applies default values correctly', () => {
    const defaultValues = {
      memberId: 'DEFAULT123',
      serviceId: '1',
      location: 'loc1',
      notes: 'Default note',
    };

    render(<CheckInForm {...defaultProps} defaultValues={defaultValues} />);

    expect(screen.getByLabelText(/member id/i)).toHaveValue(defaultValues.memberId);
    expect(screen.getByLabelText(/service/i)).toHaveValue(defaultValues.serviceId);
    expect(screen.getByLabelText(/location/i)).toHaveValue(defaultValues.location);
    expect(screen.getByLabelText(/notes/i)).toHaveValue(defaultValues.notes);
  });
});
