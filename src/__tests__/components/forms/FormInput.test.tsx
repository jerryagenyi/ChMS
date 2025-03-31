import { render, screen, fireEvent } from '@testing-library/react';
import { FormInput } from '@/components/forms/FormInput';

describe('FormInput', () => {
  it('handles validation states correctly', async () => {
    render(<FormInput name="test" label="Test Input" error="This field is required" />);

    const input = screen.getByLabelText('Test Input');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders without error state', () => {
    render(<FormInput name="test" label="Test Input" />);

    const input = screen.getByLabelText('Test Input');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('handles user input correctly', () => {
    render(<FormInput name="test" label="Test Input" />);

    const input = screen.getByLabelText('Test Input');
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(input).toHaveValue('test value');
  });
});
