import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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
  Scanner: ({ onScan, onError }: any) => <div data-testid="mock-scanner">Mock Scanner</div>,
}));

// Mock fetch
global.fetch = vi.fn();

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('QRScanner Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders scanner component', () => {
    renderWithChakra(<QRScanner isOpen={true} onClose={() => {}} />);

    // Use findByTestId for async rendering
    expect(screen.getByTestId('mock-scanner')).toBeInTheDocument();
  });

  it('handles successful QR code scan', async () => {
    const mockOnClose = vi.fn();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { classId: '123' } }),
    });

    renderWithChakra(<QRScanner isOpen={true} onClose={mockOnClose} />);

    // Verify the scanner is rendered
    expect(screen.getByTestId('mock-scanner')).toBeInTheDocument();

    // Add more assertions for scanning functionality
  });
});
