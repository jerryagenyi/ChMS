import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import AttendanceChart from './AttendanceChart';

const mockData = [
  {
    date: new Date('2024-01-01'),
    count: 100,
    uniqueMembers: 80,
  },
  {
    date: new Date('2024-01-02'),
    count: 120,
    uniqueMembers: 90,
  },
];

const mockOnRefresh = jest.fn();

describe('AttendanceChart', () => {
  beforeEach(() => {
    mockOnRefresh.mockReset();
  });

  const renderWithChakra = (ui: React.ReactElement) => {
    return render(<ChakraProvider>{ui}</ChakraProvider>);
  };

  it('renders chart with data', () => {
    renderWithChakra(<AttendanceChart data={mockData} onRefresh={mockOnRefresh} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByText('Jan 1')).toBeInTheDocument();
    expect(screen.getByText('Jan 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithChakra(
      <AttendanceChart data={mockData} isLoading={true} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByText('Error loading attendance chart')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const error = new Error('Failed to load chart data');
    renderWithChakra(
      <AttendanceChart data={mockData} isError={true} error={error} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByText('Error loading attendance chart')).toBeInTheDocument();
    expect(screen.getByText('Failed to load chart data')).toBeInTheDocument();
  });

  it('handles refresh', async () => {
    mockOnRefresh.mockResolvedValue(undefined);

    renderWithChakra(<AttendanceChart data={mockData} onRefresh={mockOnRefresh} />);

    const refreshButton = screen.getByLabelText('Refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });
  });

  it('handles refresh error', async () => {
    const error = new Error('Refresh failed');
    mockOnRefresh.mockRejectedValue(error);

    renderWithChakra(<AttendanceChart data={mockData} onRefresh={mockOnRefresh} />);

    const refreshButton = screen.getByLabelText('Refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to refresh chart data')).toBeInTheDocument();
    });
  });

  it('applies custom container props', () => {
    const containerProps = { bg: 'gray.100', p: 4 };
    renderWithChakra(
      <AttendanceChart data={mockData} containerProps={containerProps} onRefresh={mockOnRefresh} />
    );

    const container = screen.getByRole('img').parentElement?.parentElement;
    expect(container).toHaveStyle({
      backgroundColor: 'var(--chakra-colors-gray-100)',
      padding: 'var(--chakra-space-4)',
    });
  });

  it('respects showTooltips prop', () => {
    renderWithChakra(
      <AttendanceChart data={mockData} showTooltips={false} onRefresh={mockOnRefresh} />
    );

    const tooltip = screen.queryByRole('tooltip');
    expect(tooltip).not.toBeInTheDocument();
  });

  it('respects animate prop', () => {
    renderWithChakra(<AttendanceChart data={mockData} animate={false} onRefresh={mockOnRefresh} />);

    const lines = screen.getAllByRole('img');
    lines.forEach(line => {
      expect(line).toHaveAttribute('animation-duration', '0');
    });
  });
});
