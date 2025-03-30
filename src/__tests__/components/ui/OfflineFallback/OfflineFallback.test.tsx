import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { OfflineFallback } from './OfflineFallback';
import theme from '@/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('OfflineFallback', () => {
  const originalNavigator = { ...window.navigator };

  beforeEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        onLine: true,
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
    });
  });

  it('renders children when online', () => {
    renderWithChakra(
      <OfflineFallback>
        <div>Test Content</div>
      </OfflineFallback>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders fallback when offline', () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        onLine: false,
      },
    });

    renderWithChakra(
      <OfflineFallback>
        <div>Test Content</div>
      </OfflineFallback>
    );
    expect(
      screen.getByText('You are currently offline. Please check your internet connection.')
    ).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        onLine: false,
      },
    });

    renderWithChakra(
      <OfflineFallback fallback={<div>Custom Fallback</div>}>
        <div>Test Content</div>
      </OfflineFallback>
    );
    expect(screen.getByText('Custom Fallback')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        onLine: false,
      },
    });

    renderWithChakra(
      <OfflineFallback message="Custom Message">
        <div>Test Content</div>
      </OfflineFallback>
    );
    expect(screen.getByText('Custom Message')).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        onLine: false,
      },
    });

    const onRetry = jest.fn();
    renderWithChakra(
      <OfflineFallback onRetry={onRetry}>
        <div>Test Content</div>
      </OfflineFallback>
    );
    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });

  it('renders custom retry label', () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        onLine: false,
      },
    });

    renderWithChakra(
      <OfflineFallback onRetry={() => {}} retryLabel="Try Again">
        <div>Test Content</div>
      </OfflineFallback>
    );
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('renders custom icon', () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        onLine: false,
      },
    });

    renderWithChakra(
      <OfflineFallback icon={<div>Custom Icon</div>}>
        <div>Test Content</div>
      </OfflineFallback>
    );
    expect(screen.getByText('Custom Icon')).toBeInTheDocument();
  });

  it('handles online/offline events', () => {
    const { rerender } = renderWithChakra(
      <OfflineFallback>
        <div>Test Content</div>
      </OfflineFallback>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    // Simulate offline
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        onLine: false,
      },
    });
    window.dispatchEvent(new Event('offline'));
    rerender(
      <ChakraProvider theme={theme}>
        <OfflineFallback>
          <div>Test Content</div>
        </OfflineFallback>
      </ChakraProvider>
    );
    expect(
      screen.getByText('You are currently offline. Please check your internet connection.')
    ).toBeInTheDocument();

    // Simulate online
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        onLine: true,
      },
    });
    window.dispatchEvent(new Event('online'));
    rerender(
      <ChakraProvider theme={theme}>
        <OfflineFallback>
          <div>Test Content</div>
        </OfflineFallback>
      </ChakraProvider>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
