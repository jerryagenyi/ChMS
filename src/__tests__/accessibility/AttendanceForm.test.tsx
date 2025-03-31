import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AttendanceForm } from '@/components/attendance/AttendanceForm';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('meets WCAG standards', async () => {
    const { container } = render(<AttendanceForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper keyboard navigation', () => {
    render(<AttendanceForm />);

    const form = screen.getByRole('form');
    const inputs = form.querySelectorAll('input, button');

    inputs.forEach(input => {
      expect(input).toHaveAttribute('tabindex');
    });
  });

  it('provides proper aria labels', () => {
    render(<AttendanceForm />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toHaveAttribute('aria-label');

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveAttribute('aria-label');
    });
  });

  it('ensures all select elements have accessible names', () => {
    render(<AttendanceForm />);

    const selects = screen.getAllByRole('combobox');
    selects.forEach(select => {
      expect(select).toHaveAttribute('aria-label');
      expect(select).toHaveAttribute('id');
      const label = screen.getByLabelText(select.getAttribute('aria-label') || '');
      expect(label).toBeInTheDocument();
    });
  });
});
