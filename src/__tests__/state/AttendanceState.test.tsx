import { renderHook, act } from '@testing-library/react';
import { useAttendanceState } from '@/state/attendance';
import { AttendanceProvider } from '@/state/AttendanceContext';

describe('Attendance State Management', () => {
  it('manages attendance state correctly', () => {
    const wrapper = ({ children }) => (
      <AttendanceProvider>{children}</AttendanceProvider>
    );

    const { result } = renderHook(() => useAttendanceState(), { wrapper });

    act(() => {
      result.current.addAttendance({
        memberId: '123',
        serviceId: '456',
        timestamp: new Date(),
      });
    });

    expect(result.current.attendanceRecords).toHaveLength(1);
    expect(result.current.attendanceRecords[0].memberId).toBe('123');
  });

  it('handles side effects properly', async () => {
    const { result } = renderHook(() => useAttendanceState());

    await act(async () => {
      await result.current.syncAttendance();
    });

    expect(result.current.syncStatus).toBe('success');
  });
});