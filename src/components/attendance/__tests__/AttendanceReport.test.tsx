import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AttendanceReport } from '../AttendanceReport';
import { vi } from 'vitest';

// Mock the fetch function
const mockFetch = vi.fn();

// Mock the toast function
const mockToast = vi.fn();

// Mock the useToast hook
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => mockToast,
  };
});

describe('AttendanceReport', () => {
  const mockReport = {
    class: {
      id: '1',
      name: 'Test Class',
      description: 'Test Description',
    },
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
          totalDays: 20,
          present: 18,
          absent: 1,
          late: 1,
          attendancePercentage: 90,
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
      totalDays: 20,
      totalPresent: 18,
      totalAbsent: 1,
      totalLate: 1,
      averageAttendance: 90,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
  });

  it('renders loading state initially', () => {
    render(<AttendanceReport />);
    expect(screen.getByText('Loading report...')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));
    render(<AttendanceReport />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to fetch attendance report',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    });
  });

  it('renders report data when fetch succeeds', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockReport }),
    });

    render(<AttendanceReport />);

    await waitFor(() => {
      expect(screen.getByText('Test Class - Attendance Report')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('90.0%')).toBeInTheDocument();
    });
  });

  it('opens member details modal when clicking view details', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockReport }),
    });

    render(<AttendanceReport />);

    await waitFor(() => {
      expect(screen.getByText('View Details')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('View Details'));

    await waitFor(() => {
      expect(screen.getByText('Attendance Details - John Doe')).toBeInTheDocument();
      expect(screen.getByText('On time')).toBeInTheDocument();
    });
  });

  it('exports CSV when clicking export button', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockReport }),
    });

    const mockCreateObjectURL = vi.fn();
    const mockRevokeObjectURL = vi.fn();
    const mockClick = vi.fn();

    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    const mockLink = {
      href: '',
      download: '',
      click: mockClick,
    };

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

    render(<AttendanceReport />);

    await waitFor(() => {
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Export CSV'));

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it('changes month when selecting a different month', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockReport }),
    });

    render(<AttendanceReport />);

    await waitFor(() => {
      expect(screen.getByLabelText('Select month')).toBeInTheDocument();
    });

    const select = screen.getByLabelText('Select month');
    fireEvent.change(select, { target: { value: '2024-02' } });

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('month=2024-02'));
  });
});
