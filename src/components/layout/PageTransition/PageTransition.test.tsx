import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { PageTransition } from './PageTransition';
import { theme } from '@/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('PageTransition', () => {
  it('renders children', () => {
    renderWithChakra(
      <PageTransition>
        <div>Test Content</div>
      </PageTransition>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    renderWithChakra(
      <PageTransition isLoading>
        <div>Test Content</div>
      </PageTransition>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const error = new Error('Test error');
    renderWithChakra(
      <PageTransition isError error={error}>
        <div>Test Content</div>
      </PageTransition>
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it('handles retry', () => {
    const onRetry = jest.fn();
    const error = new Error('Test error');
    renderWithChakra(
      <PageTransition isError error={error} onRetry={onRetry}>
        <div>Test Content</div>
      </PageTransition>
    );
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });

  it('applies different transitions', () => {
    const { rerender } = renderWithChakra(
      <PageTransition transition="fade">
        <div>Test Content</div>
      </PageTransition>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    rerender(
      <ChakraProvider theme={theme}>
        <PageTransition transition="slide">
          <div>Test Content</div>
        </PageTransition>
      </ChakraProvider>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    rerender(
      <ChakraProvider theme={theme}>
        <PageTransition transition="scale">
          <div>Test Content</div>
        </PageTransition>
      </ChakraProvider>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('uses custom duration', () => {
    renderWithChakra(
      <PageTransition duration={0.5}>
        <div>Test Content</div>
      </PageTransition>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
