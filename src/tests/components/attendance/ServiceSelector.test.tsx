import { renderWithProviders } from '@/tests/utils/test-helpers';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import ServiceSelector from '@/components/attendance/ServiceSelector';

describe('ServiceSelector Component', () => {
  const mockServices = [
    { id: '1', name: 'Sunday Morning', startTime: '09:00', status: 'ACTIVE' },
    { id: '2', name: 'Sunday Evening', startTime: '18:00', status: 'ACTIVE' },
    { id: '3', name: 'Wednesday', startTime: '19:00', status: 'SCHEDULED' }
  ];

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all services correctly', () => {
    renderWithProviders(
      <ServiceSelector 
        services={mockServices} 
        onSelect={mockOnSelect} 
      />
    );

    mockServices.forEach(service => {
      expect(screen.getByText(service.name)).toBeInTheDocument();
      expect(screen.getByText(service.startTime)).toBeInTheDocument();
    });
  });

  it('handles service selection', async () => {
    renderWithProviders(
      <ServiceSelector 
        services={mockServices} 
        onSelect={mockOnSelect} 
      />
    );

    fireEvent.click(screen.getByText('Sunday Morning'));

    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalledWith(mockServices[0]);
    });
  });

  it('disables non-active services', () => {
    renderWithProviders(
      <ServiceSelector 
        services={mockServices} 
        onSelect={mockOnSelect} 
      />
    );

    const wednesdayService = screen.getByText('Wednesday').closest('button');
    expect(wednesdayService).toBeDisabled();
  });
});