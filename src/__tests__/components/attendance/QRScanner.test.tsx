import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import QRScanner from '@/components/attendance/QRScanner';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

// Mock the Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the Scanner component
vi.mock('@yudiel/react-qr-scanner', () => ({
  Scanner: ({ onScan, onError }: any) => (
    <div data-testid="mock-scanner" onClick={() => onScan('mock-qr-data')}>
      Mock Scanner
      <button onClick={() => onError('Camera access denied')}>Trigger Error</button>
    </div>
  ),
}));

// Mock fetch
global.fetch = vi.fn();

// Mock toast
const mockToast = vi.fn();
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => mockToast,
  };
});

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('QRScanner Component', () => {
  const mockOnScan = vi.fn();
  const mockOnError = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
    (global.fetch as jest.Mock).mockClear();
    mockToast.mockClear();
    mockOnScan.mockClear();
    mockOnError.mockClear();
    mockOnClose.mockClear();
  });

  // 1. Component rendering
  it('renders scanner component with correct structure', () => {
    renderWithChakra(
      <QRScanner isOpen={true} onClose={mockOnClose} onScan={mockOnScan} onError={mockOnError} />
    );

    expect(screen.getByText('Scan Service QR Code')).toBeInTheDocument();
    expect(screen.getByTestId('mock-scanner')).toBeInTheDocument();
    expect(screen.getByTestId('qr-scanner-viewport')).toBeInTheDocument();
  });

  // 2. Camera access handling
  it('handles camera access denial', async () => {
    renderWithChakra(
      <QRScanner isOpen={true} onClose={mockOnClose} onScan={mockOnScan} onError={mockOnError} />
    );

    const errorButton = screen.getByText('Trigger Error');
    await act(() => errorButton.click());

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Scanner Error',
      description: 'Camera access denied',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    expect(mockOnError).toHaveBeenCalledWith('Camera access denied');
  });

  // 3. QR code detection and 4. Success callback
  it('handles successful QR code scan and validation', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { classId: '123' } }),
    });

    renderWithChakra(
      <QRScanner isOpen={true} onClose={mockOnClose} onScan={mockOnScan} onError={mockOnError} />
    );

    const scanner = screen.getByTestId('mock-scanner');
    await act(() => scanner.click()); // Triggers onScan with 'mock-qr-data'

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/attendance/qr/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrData: 'mock-qr-data' }),
      });
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'QR code validated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      expect(mockPush).toHaveBeenCalledWith('/attendance/class/123');
      expect(mockOnScan).toHaveBeenCalledWith('mock-qr-data');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // 5. Error handling
  it('handles QR code validation error', async () => {
    const error = 'Invalid QR code';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error }),
    });

    renderWithChakra(
      <QRScanner isOpen={true} onClose={mockOnClose} onScan={mockOnScan} onError={mockOnError} />
    );

    const scanner = screen.getByTestId('mock-scanner');
    await act(() => scanner.click());

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      expect(mockOnError).toHaveBeenCalledWith(error);
    });
  });

  // 6. Loading states
  it('handles loading state during validation', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    (global.fetch as jest.Mock).mockReturnValueOnce(promise);

    renderWithChakra(
      <QRScanner isOpen={true} onClose={mockOnClose} onScan={mockOnScan} onError={mockOnError} />
    );

    const scanner = screen.getByTestId('mock-scanner');
    await act(() => scanner.click());

    // Verify that a second scan attempt is ignored while validating
    await act(() => scanner.click());
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Resolve the validation
    await act(async () => {
      resolvePromise!({
        ok: true,
        json: () => Promise.resolve({ data: { classId: '123' } }),
      });
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // 7. Permission handling
  it('handles network errors during validation', async () => {
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    renderWithChakra(
      <QRScanner isOpen={true} onClose={mockOnClose} onScan={mockOnScan} onError={mockOnError} />
    );

    const scanner = screen.getByTestId('mock-scanner');
    await act(() => scanner.click());

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Network error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      expect(mockOnError).toHaveBeenCalledWith('Network error');
    });
  });
});
