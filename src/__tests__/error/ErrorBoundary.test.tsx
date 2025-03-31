import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { AppError } from '@/lib/errors';

describe('Error Handling', () => {
  const ThrowError = () => {
    throw new AppError('TEST_ERROR', 'Test error message');
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('catches and displays errors appropriately', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/test error message/i)).toBeInTheDocument();
  });

  it('provides retry functionality', () => {
    const onReset = jest.fn();
    render(
      <ErrorBoundary onReset={onReset}>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText(/try again/i));
    expect(onReset).toHaveBeenCalled();
  });
});