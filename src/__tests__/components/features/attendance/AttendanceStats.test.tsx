import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import AttendanceStats from './AttendanceStats';

const mockStats = {
  totalAttendance: 150,
  uniqueMembers: 75,
  averageAttendance: 50,
  peakAttendance: 100,
};

const mockOnRefresh = jest.fn();

describe('AttendanceStats', () => {
  beforeEach(() => {
    mockOnRefresh.mockReset();
  });

  const renderWithChakra = (ui: React.ReactElement) => {
    return render(<ChakraProvider>{ui}</ChakraProvider>);
  };

  it('renders all statistics', () => {
    renderWithChakra(<AttendanceStats {...mockStats} onRefresh={mockOnRefresh} />);

    expect(screen.getByText('Total Attendance')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Unique Members')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('Average Attendance')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Peak Attendance')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithChakra(<AttendanceStats {...mockStats} isLoading={true} onRefresh={mockOnRefresh} />);

    expect(screen.getAllByText('Loading...')).toHaveLength(4);
  });

  it('shows error state', () => {
    const error = new Error('Failed to load stats');
    renderWithChakra(
      <AttendanceStats {...mockStats} isError={true} error={error} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByText('Error loading attendance statistics')).toBeInTheDocument();
    expect(screen.getByText('Failed to load stats')).toBeInTheDocument();
  });

  it('handles refresh', async () => {
    mockOnRefresh.mockResolvedValue(undefined);

    renderWithChakra(<AttendanceStats {...mockStats} onRefresh={mockOnRefresh} />);

    const refreshButton = screen.getByLabelText('Refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });
  });

  it('handles refresh error', async () => {
    const error = new Error('Refresh failed');
    mockOnRefresh.mockRejectedValue(error);

    renderWithChakra(<AttendanceStats {...mockStats} onRefresh={mockOnRefresh} />);

    const refreshButton = screen.getByLabelText('Refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to refresh stats')).toBeInTheDocument();
    });
  });

  it('applies custom container props', () => {
    const containerProps = { bg: 'gray.100', p: 4 };
    renderWithChakra(
      <AttendanceStats {...mockStats} containerProps={containerProps} onRefresh={mockOnRefresh} />
    );

    const container = screen.getByText('Total Attendance').parentElement?.parentElement;
    expect(container).toHaveStyle({
      backgroundColor: 'var(--chakra-colors-gray-100)',
      padding: 'var(--chakra-space-4)',
    });
  });

  it('applies custom stat props', () => {
    const statProps = { color: 'blue.500' };
    renderWithChakra(
      <AttendanceStats {...mockStats} statProps={statProps} onRefresh={mockOnRefresh} />
    );

    const stats = screen.getAllByRole('group');
    stats.forEach(stat => {
      expect(stat).toHaveStyle({
        color: 'var(--chakra-colors-blue-500)',
      });
    });
  });
});
