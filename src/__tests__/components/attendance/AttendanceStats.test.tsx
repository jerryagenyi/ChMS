import { renderWithProviders } from '@/tests/utils/test-helpers';
import { screen, waitFor } from '@testing-library/react';
import AttendanceStats from '@/components/attendance/AttendanceStats';

describe('AttendanceStats Component', () => {
  const mockStats = {
    totalAttendees: 150,
    newVisitors: 12,
    departments: [
      { name: 'Children', count: 45 },
      { name: 'Youth', count: 35 },
      { name: 'Adults', count: 70 }
    ],
    trend: {
      previousWeek: 145,
      percentageChange: 3.45
    }
  };

  it('displays attendance overview correctly', async () => {
    renderWithProviders(<AttendanceStats stats={mockStats} />);

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('+3.45%')).toBeInTheDocument();
  });

  it('shows department breakdown', () => {
    renderWithProviders(<AttendanceStats stats={mockStats} />);

    mockStats.departments.forEach(dept => {
      expect(screen.getByText(dept.name)).toBeInTheDocument();
      expect(screen.getByText(dept.count.toString())).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    renderWithProviders(<AttendanceStats isLoading />);
    
    expect(screen.getByTestId('stats-skeleton')).toBeInTheDocument();
  });
});