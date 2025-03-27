import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import AttendanceReport from '../AttendanceReport';

// Mock data
const mockAttendanceData = {
  total: 150,
  average: 75,
  byDate: [
    { date: '2024-01-01', count: 80 },
    { date: '2024-01-08', count: 70 },
  ],
  byMember: [
    { memberId: '1', name: 'John Doe', attendance: 8 },
    { memberId: '2', name: 'Jane Smith', attendance: 7 },
  ],
};

// Mock fetch
global.fetch = vi.fn();

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('AttendanceReport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));

    renderWithChakra(<AttendanceReport />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    renderWithChakra(<AttendanceReport />);

    await waitFor(() => {
      expect(screen.getByText(/error loading attendance data/i)).toBeInTheDocument();
    });
  });

  it('renders report data when fetch succeeds', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockAttendanceData),
    });

    renderWithChakra(<AttendanceReport />);

    await waitFor(() => {
      expect(screen.getByText('Total Attendance: 150')).toBeInTheDocument();
      expect(screen.getByText('Average Attendance: 75')).toBeInTheDocument();
    });
  });

  it('opens member details modal when clicking view details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockAttendanceData),
    });

    renderWithChakra(<AttendanceReport />);

    await waitFor(() => {
      const viewDetailsButton = screen.getByText(/view details/i);
      fireEvent.click(viewDetailsButton);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('exports CSV when clicking export button', async () => {
    const mockCreateObjectURL = vi.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = vi.fn();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockAttendanceData),
    });

    renderWithChakra(<AttendanceReport />);

    await waitFor(() => {
      const exportButton = screen.getByText(/export csv/i);
      fireEvent.click(exportButton);
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });
  });

  it('changes month when selecting a different month', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockAttendanceData),
    });

    renderWithChakra(<AttendanceReport />);

    await waitFor(() => {
      const monthSelect = screen.getByLabelText(/select month/i);
      fireEvent.change(monthSelect, { target: { value: '2024-02' } });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
