import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ServiceSelector } from './ServiceSelector';
import { theme } from '@/theme';

const mockServices = [
  {
    id: '1',
    name: 'Sunday Service',
    type: 'SUNDAY' as const,
    date: new Date('2024-01-01'),
    description: 'Weekly Sunday service',
    isActive: true,
  },
  {
    id: '2',
    name: 'Wednesday Service',
    type: 'WEDNESDAY' as const,
    date: new Date('2024-01-03'),
    description: 'Weekly Wednesday service',
    isActive: true,
  },
];

const defaultProps = {
  services: mockServices,
};

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('ServiceSelector', () => {
  it('renders loading state', () => {
    renderWithChakra(<ServiceSelector {...defaultProps} isLoading={true} />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const error = new Error('Failed to load services');
    renderWithChakra(<ServiceSelector {...defaultProps} isError={true} error={error} />);
    expect(screen.getByText('Error loading services')).toBeInTheDocument();
    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it('renders services list', () => {
    renderWithChakra(<ServiceSelector {...defaultProps} />);
    expect(screen.getByText('Sunday Service')).toBeInTheDocument();
    expect(screen.getByText('Wednesday Service')).toBeInTheDocument();
  });

  it('handles service selection', () => {
    const onSelect = jest.fn();
    renderWithChakra(<ServiceSelector {...defaultProps} onSelect={onSelect} />);
    const service = screen.getByText('Sunday Service');
    fireEvent.click(service);
    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('handles search', () => {
    renderWithChakra(<ServiceSelector {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Search services...');
    fireEvent.change(searchInput, {
      target: { value: 'Sunday' },
    });
    expect(screen.getByText('Sunday Service')).toBeInTheDocument();
    expect(screen.queryByText('Wednesday Service')).not.toBeInTheDocument();
  });

  it('handles type filter', () => {
    renderWithChakra(<ServiceSelector {...defaultProps} />);
    const typeSelect = screen.getByLabelText('Service Type');
    fireEvent.change(typeSelect, {
      target: { value: 'SUNDAY' },
    });
    expect(screen.getByText('Sunday Service')).toBeInTheDocument();
    expect(screen.queryByText('Wednesday Service')).not.toBeInTheDocument();
  });

  it('handles sorting', () => {
    renderWithChakra(<ServiceSelector {...defaultProps} />);
    const dateSortButton = screen.getByText('Date');
    fireEvent.click(dateSortButton);
    const services = screen.getAllByRole('button');
    expect(services[0]).toHaveTextContent('Wednesday Service');
  });

  it('handles refresh', () => {
    const onRefresh = jest.fn();
    renderWithChakra(<ServiceSelector {...defaultProps} onRefresh={onRefresh} />);
    const refreshButton = screen.getByLabelText('Refresh');
    fireEvent.click(refreshButton);
    expect(onRefresh).toHaveBeenCalled();
  });

  it('shows inactive services when includeInactive is true', () => {
    const inactiveServices = [
      ...mockServices,
      {
        id: '3',
        name: 'Inactive Service',
        type: 'SUNDAY' as const,
        date: new Date('2024-01-05'),
        description: 'Inactive service',
        isActive: false,
      },
    ];
    renderWithChakra(
      <ServiceSelector {...defaultProps} services={inactiveServices} includeInactive={true} />
    );
    expect(screen.getByText('Inactive Service')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('hides description when showDescription is false', () => {
    renderWithChakra(<ServiceSelector {...defaultProps} showDescription={false} />);
    expect(screen.queryByText('Weekly Sunday service')).not.toBeInTheDocument();
    expect(screen.queryByText('Weekly Wednesday service')).not.toBeInTheDocument();
  });
});
