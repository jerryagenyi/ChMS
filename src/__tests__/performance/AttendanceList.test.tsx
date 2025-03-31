import { render, screen } from '@testing-library/react';
import { AttendanceList } from '@/components/attendance/AttendanceList';
import { measurePerformance } from '@/utils/testHelpers';

describe('Performance Tests', () => {
  it('renders large lists efficiently', async () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({
      id: `${i}`,
      memberId: `member-${i}`,
      timestamp: new Date(),
    }));

    const { duration } = await measurePerformance(() => {
      render(<AttendanceList items={items} />);
    });

    expect(duration).toBeLessThan(100); // 100ms threshold
  });

  it('handles pagination efficiently', async () => {
    const { rerender } = render(<AttendanceList page={1} />);

    const startTime = performance.now();
    await rerender(<AttendanceList page={2} />);
    const duration = performance.now() - startTime;

    expect(duration).toBeLessThan(50); // 50ms threshold
  });
});