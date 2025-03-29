import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/tests/utils/test-utils';
import ServiceSelector from '@/components/attendance/ServiceSelector';

type Service = {
  id: string;
  name: string;
  startTime: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'COMPLETED';
};

describe('ServiceSelector Component', () => {
  const mockServices: Service[] = [
    { id: '1', name: 'Sunday Service', startTime: '10:00', status: 'ACTIVE' as const },
    { id: '2', name: 'Wednesday Service', startTime: '19:00', status: 'SCHEDULED' as const },
  ];

  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders service options', () => {
    render(<ServiceSelector services={mockServices} onSelect={mockOnSelect} />);

    mockServices.forEach(service => {
      expect(screen.getByText(service.name)).toBeInTheDocument();
      expect(screen.getByText(service.startTime)).toBeInTheDocument();
    });
  });

  it('calls onSelect when a service is selected', () => {
    render(<ServiceSelector services={mockServices} onSelect={mockOnSelect} />);

    const serviceOption = screen.getByText(mockServices[0].name);
    fireEvent.click(serviceOption);

    expect(mockOnSelect).toHaveBeenCalledWith(mockServices[0]);
  });

  it('highlights selected service', () => {
    render(
      <ServiceSelector
        services={mockServices}
        onSelect={mockOnSelect}
        selectedId={mockServices[0].id}
      />
    );

    const selectedService = screen.getByText(mockServices[0].name);
    expect(selectedService.closest('button')).toHaveStyle({
      backgroundColor: 'var(--chakra-colors-blue-50)',
    });
  });

  it('disables scheduled services', () => {
    render(<ServiceSelector services={mockServices} onSelect={mockOnSelect} />);

    const scheduledService = screen.getByText(mockServices[1].name).closest('button');
    expect(scheduledService).toBeDisabled();
  });
});
