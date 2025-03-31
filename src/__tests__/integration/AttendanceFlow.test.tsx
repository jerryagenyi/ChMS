import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QRScanner } from '@/components/QRScanner';
import { CheckInForm } from '@/components/CheckInForm';
import { AttendanceRecorder } from '@/components/AttendanceRecorder';
import { BasicReportView } from '@/components/BasicReportView';
import { useAttendanceStore } from '@/store/attendance';

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock QR scanner
vi.mock('@/components/QRScanner', () => ({
  QRScanner: vi.fn(({ onScan }) => <button onClick={() => onScan('mock-qr-data')}>Scan QR</button>),
}));

// Test data
const mockAttendee = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  timestamp: new Date().toISOString(),
};

const mockQRData = {
  memberId: '123',
  eventId: 'event-1',
  timestamp: new Date().toISOString(),
};

describe('Attendance Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAttendanceStore.setState({ records: [] });
  });

  describe('QR Generation → Scanning', () => {
    it('generates and scans QR code successfully', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ qrData: mockQRData }),
        })
      );

      render(<QRScanner onScan={vi.fn()} />);

      // Simulate QR code generation
      const generateQR = async () => {
        const response = await fetch('/api/attendance/generate-qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memberId: '123', eventId: 'event-1' }),
        });
        return response.json();
      };

      const qrResult = await generateQR();
      expect(qrResult.qrData).toEqual(mockQRData);

      // Simulate QR code scanning
      fireEvent.click(screen.getByText('Scan QR'));
      expect(screen.getByText('Scan QR')).toBeInTheDocument();
    });

    it('handles invalid QR codes gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: 'Invalid QR code' }),
        })
      );

      render(<QRScanner onScan={vi.fn()} />);

      // Simulate scanning invalid QR code
      fireEvent.click(screen.getByText('Scan QR'));

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalled();
      });

      consoleError.mockRestore();
    });
  });

  describe('Check-in → Recording', () => {
    it('completes check-in and records attendance', async () => {
      mockFetch
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAttendee),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          })
        );

      const { rerender } = render(
        <>
          <CheckInForm onSubmit={vi.fn()} />
          <AttendanceRecorder onSync={vi.fn()} />
        </>
      );

      // Simulate check-in
      fireEvent.click(screen.getByText('Check In'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/attendance/check-in'),
          expect.any(Object)
        );
      });

      // Verify attendance recording
      rerender(
        <>
          <CheckInForm onSubmit={vi.fn()} />
          <AttendanceRecorder onSync={vi.fn()} />
          <BasicReportView />
        </>
      );

      await waitFor(() => {
        expect(screen.getByText(mockAttendee.name)).toBeInTheDocument();
      });
    });

    it('handles offline check-in with sync', async () => {
      const online = vi.spyOn(navigator, 'onLine', 'get');
      online.mockReturnValue(false);

      render(
        <>
          <CheckInForm onSubmit={vi.fn()} />
          <AttendanceRecorder onSync={vi.fn()} syncInterval={1000} />
        </>
      );

      // Simulate offline check-in
      fireEvent.click(screen.getByText('Check In'));

      // Simulate coming back online
      online.mockReturnValue(true);
      window.dispatchEvent(new Event('online'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      online.mockRestore();
    });
  });

  describe('Basic Reporting', () => {
    it('displays attendance records and allows filtering', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockAttendee]),
        })
      );

      render(<BasicReportView />);

      await waitFor(() => {
        expect(screen.getByText(mockAttendee.name)).toBeInTheDocument();
      });

      // Test filtering
      const filterInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(filterInput, { target: { value: 'John' } });

      expect(screen.getByText(mockAttendee.name)).toBeInTheDocument();
      fireEvent.change(filterInput, { target: { value: 'NonexistentName' } });
      expect(screen.queryByText(mockAttendee.name)).not.toBeInTheDocument();
    });

    it('handles export functionality', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockAttendee]),
        })
      );

      render(<BasicReportView />);

      await waitFor(() => {
        expect(screen.getByText(mockAttendee.name)).toBeInTheDocument();
      });

      // Test export
      const exportButton = screen.getByText(/export/i);
      const mockUrl = { createObjectURL: vi.fn(), revokeObjectURL: vi.fn() };
      global.URL = mockUrl as any;

      fireEvent.click(exportButton);

      expect(mockUrl.createObjectURL).toHaveBeenCalled();
      expect(mockUrl.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      mockFetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

      render(
        <>
          <CheckInForm onSubmit={vi.fn()} />
          <AttendanceRecorder onSync={vi.fn()} />
        </>
      );

      fireEvent.click(screen.getByText('Check In'));

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('handles validation errors', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: 'Invalid data' }),
        })
      );

      render(<CheckInForm onSubmit={vi.fn()} />);

      fireEvent.click(screen.getByText('Check In'));

      await waitFor(() => {
        expect(screen.getByText(/invalid data/i)).toBeInTheDocument();
      });
    });
  });
});
