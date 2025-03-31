import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AttendanceRecorder,
  useAttendance,
} from '@/components/features/attendance/AttendanceRecorder';
import { CheckInFormData } from '@/components/features/attendance/CheckInForm/types';

// Mock Chakra UI toast
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => vi.fn(),
  };
});

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

describe('AttendanceRecorder', () => {
  const mockOnSync = vi.fn(() => Promise.resolve());
  const TestChild = () => {
    const { addRecord, records, syncStatus, retrySync } = useAttendance();
    return (
      <div>
        <button onClick={() => addRecord({ memberId: '123', serviceId: '456', location: 'main' })}>
          Add Record
        </button>
        <button onClick={retrySync}>Retry Sync</button>
        <div data-testid="records-count">{records.length}</div>
        <div data-testid="sync-status">{JSON.stringify(syncStatus)}</div>
      </div>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
  });

  // 1. Data recording
  it('records attendance data and stores it locally', async () => {
    render(
      <AttendanceRecorder onSync={mockOnSync}>
        <TestChild />
      </AttendanceRecorder>
    );

    await userEvent.click(screen.getByText('Add Record'));

    expect(screen.getByTestId('records-count')).toHaveTextContent('1');
    expect(localStorage.getItem('attendance_records')).toContain('test-uuid');
  });

  // 2. Status updates
  it('updates sync status during sync operations', async () => {
    render(
      <AttendanceRecorder onSync={mockOnSync}>
        <TestChild />
      </AttendanceRecorder>
    );

    await userEvent.click(screen.getByText('Add Record'));

    const syncStatus = JSON.parse(screen.getByTestId('sync-status').textContent || '{}');
    expect(syncStatus.isSyncing).toBe(true);

    await waitFor(() => {
      const updatedStatus = JSON.parse(screen.getByTestId('sync-status').textContent || '{}');
      expect(updatedStatus.isSyncing).toBe(false);
      expect(updatedStatus.lastSyncTime).toBeTruthy();
    });
  });

  // 3. Error handling
  it('handles sync errors gracefully', async () => {
    const mockError = new Error('Sync failed');
    const failingSync = vi.fn().mockRejectedValue(mockError);

    render(
      <AttendanceRecorder onSync={failingSync}>
        <TestChild />
      </AttendanceRecorder>
    );

    await userEvent.click(screen.getByText('Add Record'));

    await waitFor(() => {
      const syncStatus = JSON.parse(screen.getByTestId('sync-status').textContent || '{}');
      expect(syncStatus.error).toBe('Sync failed');
    });
  });

  // 4. Offline support
  it('works offline and syncs when back online', async () => {
    // Start offline
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);

    render(
      <AttendanceRecorder onSync={mockOnSync}>
        <TestChild />
      </AttendanceRecorder>
    );

    await userEvent.click(screen.getByText('Add Record'));
    expect(mockOnSync).not.toHaveBeenCalled();

    // Go online
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    await waitFor(() => {
      expect(mockOnSync).toHaveBeenCalled();
    });
  });

  // 5. Sync status
  it('maintains accurate sync status for records', async () => {
    render(
      <AttendanceRecorder onSync={mockOnSync}>
        <TestChild />
      </AttendanceRecorder>
    );

    // Add a record
    await userEvent.click(screen.getByText('Add Record'));

    // Verify initial sync
    await waitFor(() => {
      const records = JSON.parse(localStorage.getItem('attendance_records') || '[]');
      expect(records[0].synced).toBe(true);
    });

    // Add another record with failing sync
    mockOnSync.mockRejectedValueOnce(new Error('Sync failed'));
    await userEvent.click(screen.getByText('Add Record'));

    // Verify failed sync status
    await waitFor(() => {
      const records = JSON.parse(localStorage.getItem('attendance_records') || '[]');
      expect(records[1].synced).toBe(false);
    });

    // Retry sync
    mockOnSync.mockResolvedValueOnce(undefined);
    await userEvent.click(screen.getByText('Retry Sync'));

    // Verify successful retry
    await waitFor(() => {
      const records = JSON.parse(localStorage.getItem('attendance_records') || '[]');
      expect(records[1].synced).toBe(true);
    });
  });

  // 6. Periodic sync
  it('attempts periodic sync of unsynced records', async () => {
    vi.useFakeTimers();

    render(
      <AttendanceRecorder onSync={mockOnSync} syncInterval={5000}>
        <TestChild />
      </AttendanceRecorder>
    );

    await userEvent.click(screen.getByText('Add Record'));
    mockOnSync.mockClear(); // Clear initial sync

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(mockOnSync).toHaveBeenCalled();

    vi.useRealTimers();
  });

  // 7. Max retries
  it('respects max retries setting', async () => {
    const failingSync = vi.fn().mockRejectedValue(new Error('Sync failed'));

    render(
      <AttendanceRecorder onSync={failingSync} maxRetries={2}>
        <TestChild />
      </AttendanceRecorder>
    );

    await userEvent.click(screen.getByText('Add Record'));

    // First attempt + 2 retries = 3 total attempts
    await waitFor(() => {
      expect(failingSync).toHaveBeenCalledTimes(1);
    });

    // Try manual retry
    await userEvent.click(screen.getByText('Retry Sync'));
    await waitFor(() => {
      expect(failingSync).toHaveBeenCalledTimes(2);
    });

    // One more retry
    await userEvent.click(screen.getByText('Retry Sync'));
    await waitFor(() => {
      expect(failingSync).toHaveBeenCalledTimes(3);
    });

    // Should not retry anymore
    await userEvent.click(screen.getByText('Retry Sync'));
    await waitFor(() => {
      expect(failingSync).toHaveBeenCalledTimes(3); // Still 3, no more retries
    });
  });
});
