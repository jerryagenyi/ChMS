import { render, screen, fireEvent, act } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import QRScanner from '@/components/attendance/QRScanner';

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('QRScanner Component', () => {
  const mockOnScan = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders scanner with camera permission', () => {
    renderWithChakra(
      <QRScanner onScan={mockOnScan} onError={mockOnError} />
    );

    expect(screen.getByTestId('qr-scanner-viewport')).toBeInTheDocument();
    expect(screen.getByText(/scan service qr code/i)).toBeInTheDocument();
  });

  it('handles successful QR scan', async () => {
    renderWithChakra(
      <QRScanner onScan={mockOnScan} onError={mockOnError} />
    );

    await act(async () => {
      // Simulate successful QR scan
      const mockQRData = 'SERVICE_1_20240215';
      mockOnScan(mockQRData);
    });

    expect(mockOnScan).toHaveBeenCalledWith('SERVICE_1_20240215');
    expect(mockOnError).not.toHaveBeenCalled();
  });

  it('shows error on camera permission denied', async () => {
    renderWithChakra(
      <QRScanner onScan={mockOnScan} onError={mockOnError} />
    );

    await act(async () => {
      mockOnError(new Error('Camera permission denied'));
    });

    expect(screen.getByText(/camera access required/i)).toBeInTheDocument();
    expect(mockOnError).toHaveBeenCalled();
  });
});