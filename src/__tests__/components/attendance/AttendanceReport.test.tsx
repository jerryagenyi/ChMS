import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { format } from 'date-fns';
import { AttendanceReport } from '@/components/features/attendance/AttendanceReport';
import { ChakraProvider } from '@chakra-ui/react';

// Mock data
const mockReport = {
  class: null,
  month: '2024-03',
  members: [
    {
      member: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
      stats: {
        totalDays: 30,
        present: 25,
        absent: 3,
        late: 2,
        attendancePercentage: 83.33,
      },
      attendance: [
        {
          id: '1',
          date: '2024-03-01',
          status: 'PRESENT',
          notes: 'On time',
        },
      ],
    },
  ],
  overallStats: {
    totalDays: 30,
    totalPresent: 25,
    totalAbsent: 3,
    totalLate: 2,
    averageAttendance: 83.33,
  },
};

// Mock fetch
global.fetch = vi.fn();

const mockFetchResponse = {
  ok: true,
  json: async () => ({ data: mockReport }),
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('AttendanceReport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);
  });

  // Data display tests
  describe('Data Display', () => {
    it('displays loading state initially', () => {
      renderWithProviders(<AttendanceReport />);
      expect(screen.getByText('Loading report...')).toBeInTheDocument();
    });

    it('displays report data when loaded', async () => {
      renderWithProviders(<AttendanceReport />);

      await waitFor(() => {
        expect(screen.getByText('Attendance Report')).toBeInTheDocument();
      });

      // Check overall stats
      expect(screen.getByText('Total Days')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('Present')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();

      // Check member data
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('83.33%')).toBeInTheDocument();
    });

    it('displays no data message when report is empty', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null }),
      });

      renderWithProviders(<AttendanceReport />);

      await waitFor(() => {
        expect(screen.getByText('No report available')).toBeInTheDocument();
      });
    });
  });

  // Filtering tests
  describe('Filtering', () => {
    it('updates report when month is changed', async () => {
      renderWithProviders(<AttendanceReport />);

      await waitFor(() => {
        expect(screen.getByText('Attendance Report')).toBeInTheDocument();
      });

      const monthSelect = screen.getByRole('combobox', { name: /select month/i });
      const newMonth = format(new Date(), 'yyyy-MM');

      fireEvent.change(monthSelect, { target: { value: newMonth } });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`month=${newMonth}`),
        expect.any(Object)
      );
    });

    it('updates report when class is selected', async () => {
      const classId = 'class123';
      renderWithProviders(<AttendanceReport classId={classId} />);

      await waitFor(() => {
        expect(screen.getByText('Attendance Report')).toBeInTheDocument();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`classId=${classId}`),
        expect.any(Object)
      );
    });
  });

  // Export options tests
  describe('Export Options', () => {
    it('exports data as CSV when export button is clicked', async () => {
      // Mock URL.createObjectURL and URL.revokeObjectURL
      const mockUrl = 'blob:test';
      global.URL.createObjectURL = vi.fn(() => mockUrl);
      global.URL.revokeObjectURL = vi.fn();

      renderWithProviders(<AttendanceReport />);

      await waitFor(() => {
        expect(screen.getByText('Export CSV')).toBeInTheDocument();
      });

      const exportButton = screen.getByText('Export CSV');
      fireEvent.click(exportButton);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
    });
  });

  // Loading states tests
  describe('Loading States', () => {
    it('shows loading state while fetching data', () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));

      renderWithProviders(<AttendanceReport />);
      expect(screen.getByText('Loading report...')).toBeInTheDocument();
    });

    it('updates loading state after data is fetched', async () => {
      renderWithProviders(<AttendanceReport />);

      expect(screen.getByText('Loading report...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText('Loading report...')).not.toBeInTheDocument();
        expect(screen.getByText('Attendance Report')).toBeInTheDocument();
      });
    });
  });

  // Error handling tests
  describe('Error Handling', () => {
    it('displays error message when fetch fails', async () => {
      const errorMessage = 'Failed to fetch attendance report';
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      renderWithProviders(<AttendanceReport />);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('displays error message when response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      renderWithProviders(<AttendanceReport />);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch attendance report')).toBeInTheDocument();
      });
    });

    it('allows retrying after error', async () => {
      // First call fails
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        // Second call succeeds
        .mockResolvedValueOnce(mockFetchResponse);

      renderWithProviders(<AttendanceReport />);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });

      // Close the error toast
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      // Data should be fetched again on mount
      await waitFor(() => {
        expect(screen.getByText('Attendance Report')).toBeInTheDocument();
      });
    });
  });
});
