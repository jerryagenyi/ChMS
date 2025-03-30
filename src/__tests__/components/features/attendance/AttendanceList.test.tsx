import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import AttendanceList from './AttendanceList';

const mockRecords = [
  {
    id: '1',
    memberId: 'M1',
    memberName: 'John Doe',
    serviceId: 'S1',
    serviceName: 'Sunday Service',
    location: 'Main Hall',
    timestamp: new Date('2024-03-20T10:00:00'),
    notes: 'Late arrival',
  },
  {
    id: '2',
    memberId: 'M2',
    memberName: 'Jane Smith',
    serviceId: 'S1',
    serviceName: 'Sunday Service',
    location: 'Main Hall',
    timestamp: new Date('2024-03-20T09:30:00'),
  },
  {
    id: '3',
    memberId: 'M3',
    memberName: 'Bob Wilson',
    serviceId: 'S2',
    serviceName: 'Wednesday Service',
    location: 'Youth Room',
    timestamp: new Date('2024-03-19T19:00:00'),
  },
];

const mockOnRefresh = jest.fn();
const mockOnFilterChange = jest.fn();
const mockOnSortChange = jest.fn();

describe('AttendanceList', () => {
  beforeEach(() => {
    mockOnRefresh.mockReset();
    mockOnFilterChange.mockReset();
    mockOnSortChange.mockReset();
  });

  const renderWithChakra = (ui: React.ReactElement) => {
    return render(<ChakraProvider>{ui}</ChakraProvider>);
  };

  it('renders attendance records', () => {
    renderWithChakra(
      <AttendanceList
        records={mockRecords}
        onRefresh={mockOnRefresh}
        onFilterChange={mockOnFilterChange}
        onSortChange={mockOnSortChange}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithChakra(
      <AttendanceList
        records={mockRecords}
        isLoading={true}
        onRefresh={mockOnRefresh}
        onFilterChange={mockOnFilterChange}
        onSortChange={mockOnSortChange}
      />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const error = new Error('Failed to load records');
    renderWithChakra(
      <AttendanceList
        records={mockRecords}
        isError={true}
        error={error}
        onRefresh={mockOnRefresh}
        onFilterChange={mockOnFilterChange}
        onSortChange={mockOnSortChange}
      />
    );

    expect(screen.getByText('Error loading attendance records')).toBeInTheDocument();
    expect(screen.getByText('Failed to load records')).toBeInTheDocument();
  });

  it('handles search filtering', () => {
    renderWithChakra(
      <AttendanceList
        records={mockRecords}
        onRefresh={mockOnRefresh}
        onFilterChange={mockOnFilterChange}
        onSortChange={mockOnSortChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
  });

  it('handles service filtering', () => {
    renderWithChakra(
      <AttendanceList
        records={mockRecords}
        onRefresh={mockOnRefresh}
        onFilterChange={mockOnFilterChange}
        onSortChange={mockOnSortChange}
      />
    );

    const serviceSelect = screen.getByPlaceholderText(/filter by service/i);
    fireEvent.change(serviceSelect, { target: { value: 'S2' } });

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
  });

  it('handles location filtering', () => {
    renderWithChakra(
      <AttendanceList
        records={mockRecords}
        onRefresh={mockOnRefresh}
        onFilterChange={mockOnFilterChange}
        onSortChange={mockOnSortChange}
      />
    );

    const locationSelect = screen.getByPlaceholderText(/filter by location/i);
    fireEvent.change(locationSelect, { target: { value: 'Youth Room' } });

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
  });

  it('handles sorting', () => {
    renderWithChakra(
      <AttendanceList
        records={mockRecords}
        onRefresh={mockOnRefresh}
        onFilterChange={mockOnFilterChange}
        onSortChange={mockOnSortChange}
      />
    );

    const memberHeader = screen.getByText('Member');
    fireEvent.click(memberHeader);

    expect(mockOnSortChange).toHaveBeenCalledWith({
      field: 'memberName',
      direction: 'asc',
    });
  });

  it('handles pagination', () => {
    const manyRecords = Array.from({ length: 15 }, (_, i) => ({
      ...mockRecords[0],
      id: String(i + 1),
      memberName: `Member ${i + 1}`,
    }));

    renderWithChakra(
      <AttendanceList
        records={manyRecords}
        onRefresh={mockOnRefresh}
        onFilterChange={mockOnFilterChange}
        onSortChange={mockOnSortChange}
      />
    );

    expect(screen.getByText('Showing 10 of 15 records')).toBeInTheDocument();

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(screen.getByText('Showing 5 of 15 records')).toBeInTheDocument();
  });

  it('handles refresh', async () => {
    mockOnRefresh.mockResolvedValue(undefined);

    renderWithChakra(
      <AttendanceList
        records={mockRecords}
        onRefresh={mockOnRefresh}
        onFilterChange={mockOnFilterChange}
        onSortChange={mockOnSortChange}
      />
    );

    const refreshButton = screen.getByLabelText('Refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });
  });

  it('handles refresh error', async () => {
    const error = new Error('Refresh failed');
    mockOnRefresh.mockRejectedValue(error);

    renderWithChakra(
      <AttendanceList
        records={mockRecords}
        onRefresh={mockOnRefresh}
        onFilterChange={mockOnFilterChange}
        onSortChange={mockOnSortChange}
      />
    );

    const refreshButton = screen.getByLabelText('Refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to refresh attendance list')).toBeInTheDocument();
    });
  });
});
