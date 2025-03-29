import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { AttendanceReport } from './AttendanceReport';
import { theme } from '@/theme';

const mockData = [
  {
    id: '1',
    memberId: 'M1',
    serviceId: 'S1',
    date: new Date('2024-01-01'),
    status: 'present',
  },
  {
    id: '2',
    memberId: 'M2',
    serviceId: 'S2',
    date: new Date('2024-01-02'),
    status: 'absent',
  },
];

const defaultProps = {
  data: mockData,
  dateRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
  },
};

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('AttendanceReport', () => {
  it('renders loading state', () => {
    renderWithChakra(<AttendanceReport {...defaultProps} isLoading={true} />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const error = new Error('Failed to load data');
    renderWithChakra(<AttendanceReport {...defaultProps} isError={true} error={error} />);
    expect(screen.getByText('Error loading attendance report')).toBeInTheDocument();
    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it('renders attendance report with data', () => {
    renderWithChakra(<AttendanceReport {...defaultProps} />);
    expect(screen.getByText('Attendance Report')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Trends')).toBeInTheDocument();
  });

  it('handles date range change', () => {
    const onDateRangeChange = jest.fn();
    renderWithChakra(<AttendanceReport {...defaultProps} onDateRangeChange={onDateRangeChange} />);
    const dateRangePicker = screen.getByRole('combobox');
    fireEvent.change(dateRangePicker, {
      target: { value: '2024-02-01' },
    });
    expect(onDateRangeChange).toHaveBeenCalled();
  });

  it('handles view change', () => {
    renderWithChakra(<AttendanceReport {...defaultProps} />);
    const viewSelect = screen.getByLabelText('View');
    fireEvent.change(viewSelect, {
      target: { value: 'weekly' },
    });
    expect(viewSelect).toHaveValue('weekly');
  });

  it('handles export', async () => {
    const onExport = jest.fn();
    renderWithChakra(<AttendanceReport {...defaultProps} onExport={onExport} />);
    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);
    const csvOption = screen.getByText('CSV');
    fireEvent.click(csvOption);
    await waitFor(() => {
      expect(onExport).toHaveBeenCalledWith('csv');
    });
  });

  it('handles refresh', () => {
    const onRefresh = jest.fn();
    renderWithChakra(<AttendanceReport {...defaultProps} onRefresh={onRefresh} />);
    const refreshButton = screen.getByLabelText('Refresh');
    fireEvent.click(refreshButton);
    expect(onRefresh).toHaveBeenCalled();
  });

  it('displays attendance stats', () => {
    renderWithChakra(<AttendanceReport {...defaultProps} />);
    expect(screen.getByText('Total Attendance')).toBeInTheDocument();
    expect(screen.getByText('Unique Members')).toBeInTheDocument();
    expect(screen.getByText('Average Attendance')).toBeInTheDocument();
    expect(screen.getByText('Peak Attendance')).toBeInTheDocument();
  });

  it('displays attendance charts', () => {
    renderWithChakra(<AttendanceReport {...defaultProps} />);
    expect(screen.getByText('Attendance Trends')).toBeInTheDocument();
    expect(screen.getByText('Attendance Distribution')).toBeInTheDocument();
    expect(screen.getByText('Attendance Growth')).toBeInTheDocument();
  });
});
