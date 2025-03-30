import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import CheckInForm from './CheckInForm';

const mockServices = [
  { id: '1', name: 'Sunday Service', date: new Date() },
  { id: '2', name: 'Wednesday Service', date: new Date() },
];

const mockLocations = [
  { id: '1', name: 'Main Hall', capacity: 200 },
  { id: '2', name: 'Youth Room', capacity: 50 },
];

const mockOnSubmit = jest.fn();

describe('CheckInForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockReset();
  });

  const renderWithChakra = (ui: React.ReactElement) => {
    return render(<ChakraProvider>{ui}</ChakraProvider>);
  };

  it('renders all form fields', () => {
    renderWithChakra(
      <CheckInForm services={mockServices} locations={mockLocations} onSubmit={mockOnSubmit} />
    );

    expect(screen.getByLabelText(/member id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check in/i })).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    renderWithChakra(
      <CheckInForm services={mockServices} locations={mockLocations} onSubmit={mockOnSubmit} />
    );

    const submitButton = screen.getByRole('button', { name: /check in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/member id is required/i)).toBeInTheDocument();
      expect(screen.getByText(/service is required/i)).toBeInTheDocument();
      expect(screen.getByText(/location is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    renderWithChakra(
      <CheckInForm services={mockServices} locations={mockLocations} onSubmit={mockOnSubmit} />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/member id/i), {
      target: { value: 'M123' },
    });
    fireEvent.change(screen.getByLabelText(/service/i), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText(/notes/i), {
      target: { value: 'Test notes' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /check in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        memberId: 'M123',
        serviceId: '1',
        location: '1',
        notes: 'Test notes',
      });
    });
  });

  it('handles submission error', async () => {
    const error = new Error('Submission failed');
    mockOnSubmit.mockRejectedValue(error);

    renderWithChakra(
      <CheckInForm services={mockServices} locations={mockLocations} onSubmit={mockOnSubmit} />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/member id/i), {
      target: { value: 'M123' },
    });
    fireEvent.change(screen.getByLabelText(/service/i), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: '1' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /check in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
    });
  });

  it('disables form while submitting', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithChakra(
      <CheckInForm services={mockServices} locations={mockLocations} onSubmit={mockOnSubmit} />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/member id/i), {
      target: { value: 'M123' },
    });
    fireEvent.change(screen.getByLabelText(/service/i), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: '1' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /check in/i });
    fireEvent.click(submitButton);

    // Check if form is disabled
    expect(screen.getByLabelText(/member id/i)).toBeDisabled();
    expect(screen.getByLabelText(/service/i)).toBeDisabled();
    expect(screen.getByLabelText(/location/i)).toBeDisabled();
    expect(screen.getByLabelText(/notes/i)).toBeDisabled();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByLabelText(/member id/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/service/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/location/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/notes/i)).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('respects external loading state', () => {
    renderWithChakra(
      <CheckInForm
        services={mockServices}
        locations={mockLocations}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    expect(screen.getByRole('button', { name: /checking in/i })).toBeInTheDocument();
  });

  it('respects external disabled state', () => {
    renderWithChakra(
      <CheckInForm
        services={mockServices}
        locations={mockLocations}
        onSubmit={mockOnSubmit}
        isDisabled={true}
      />
    );

    expect(screen.getByLabelText(/member id/i)).toBeDisabled();
    expect(screen.getByLabelText(/service/i)).toBeDisabled();
    expect(screen.getByLabelText(/location/i)).toBeDisabled();
    expect(screen.getByLabelText(/notes/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /check in/i })).toBeDisabled();
  });

  it('uses default values when provided', () => {
    const defaultValues = {
      memberId: 'M123',
      serviceId: '1',
      location: '1',
      notes: 'Default notes',
    };

    renderWithChakra(
      <CheckInForm
        services={mockServices}
        locations={mockLocations}
        onSubmit={mockOnSubmit}
        defaultValues={defaultValues}
      />
    );

    expect(screen.getByLabelText(/member id/i)).toHaveValue('M123');
    expect(screen.getByLabelText(/service/i)).toHaveValue('1');
    expect(screen.getByLabelText(/location/i)).toHaveValue('1');
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Default notes');
  });
});
