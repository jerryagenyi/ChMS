import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AttendanceFlow } from '@/features/attendance/AttendanceFlow';
import { rest } from 'msw';
import { server } from '@/__tests__/__mocks__/server';

describe('AttendanceFlow', () => {
  it('completes full attendance check-in process', async () => {
    server.use(
      rest.post('/api/attendance/check-in', (req, res, ctx) => {
        return res(ctx.json({ success: true }));
      })
    );

    render(<AttendanceFlow />);
    
    fireEvent.change(screen.getByLabelText(/member id/i), {
      target: { value: 'M123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /check in/i }));

    await waitFor(() => {
      expect(screen.getByText(/check-in successful/i)).toBeInTheDocument();
    });
  });
});