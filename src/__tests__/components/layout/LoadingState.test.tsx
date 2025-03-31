import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { LoadingState } from './LoadingState';
import theme from '@/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('LoadingState', () => {
  it('renders children when not loading', () => {
    renderWithChakra(
      <LoadingState isLoading={false}>
        <div>Test Content</div>
      </LoadingState>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders loading spinner when loading', () => {
    renderWithChakra(
      <LoadingState isLoading>
        <div>Test Content</div>
      </LoadingState>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const CustomFallback = () => <div>Custom Loading UI</div>;
    renderWithChakra(
      <LoadingState isLoading fallback={<CustomFallback />}>
        <div>Test Content</div>
      </LoadingState>
    );
    expect(screen.getByText('Custom Loading UI')).toBeInTheDocument();
  });

  it('renders with overlay when overlay prop is true', () => {
    renderWithChakra(
      <LoadingState isLoading overlay>
        <div>Test Content</div>
      </LoadingState>
    );
    const overlay = screen.getByRole('status').parentElement;
    expect(overlay).toHaveStyle({
      position: 'absolute',
      backdropFilter: 'blur(2px)',
    });
  });

  it('respects custom spinner props', () => {
    renderWithChakra(
      <LoadingState
        isLoading
        spinnerSize="sm"
        spinnerColor="red.500"
        spinnerThickness="2px"
        spinnerSpeed="1s"
        spinnerLabel="Custom Label"
      >
        <div>Test Content</div>
      </LoadingState>
    );
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Custom Label');
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('respects custom minHeight', () => {
    renderWithChakra(
      <LoadingState isLoading minHeight="400px">
        <div>Test Content</div>
      </LoadingState>
    );
    const container = screen.getByRole('status').parentElement;
    expect(container).toHaveStyle({ minHeight: '400px' });
  });
});
