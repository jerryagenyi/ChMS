import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import QRDisplay from '../attendance/QRDisplay';
import { generateQRCode, QRData } from '@/lib/attendance/qr';
import QRCode from 'qrcode';

// Mock the QR code generation function
vi.mock('@/lib/attendance/qr', () => ({
  generateQRCode: vi.fn(),
}));

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mockQrCode'),
  },
}));

describe('QRDisplay', () => {
  const mockQrUrl = 'data:image/png;base64,mockQrCode';
  const testData: QRData = {
    serviceId: '123',
    type: 'SERVICE',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generateQRCode).mockResolvedValue(mockQrUrl);
  });

  it('shows loading spinner initially', () => {
    render(<QRDisplay data={testData} />);
    expect(screen.getByTestId('qr-loading')).toBeInTheDocument();
  });

  it('displays QR code after generation', async () => {
    render(<QRDisplay data={testData} />);

    await waitFor(() => {
      expect(screen.getByTestId('qr-image')).toBeInTheDocument();
    });

    const qrImage = screen.getByTestId('qr-image');
    expect(qrImage).toHaveAttribute('src', mockQrUrl);
    expect(qrImage).toHaveAttribute('alt', 'QR Code');
  });

  it('handles QR code generation error', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(generateQRCode).mockRejectedValue(new Error('Generation failed'));

    render(<QRDisplay data={testData} />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Failed to generate QR code:', expect.any(Error));
    });

    consoleError.mockRestore();
  });

  it('respects custom size prop', async () => {
    const customSize = 400;
    render(<QRDisplay data={testData} size={customSize} />);

    await waitFor(() => {
      const qrImage = screen.getByTestId('qr-image');
      expect(qrImage).toHaveStyle({ width: `${customSize}px`, height: `${customSize}px` });
    });
  });

  it('renders with default size', async () => {
    render(<QRDisplay data={testData} />);

    const qrImage = await screen.findByTestId('qr-image');
    expect(qrImage).toBeInTheDocument();
    expect(qrImage).toHaveStyle({ width: '200px', height: '200px' });
  });

  it('displays error message when QR code generation fails', async () => {
    const mockQRCode = vi.mocked(QRCode);
    mockQRCode.toDataURL.mockRejectedValueOnce(new Error('QR code generation failed'));

    render(<QRDisplay data={testData} />);

    await waitFor(() => {
      expect(screen.getByText(/Error generating QR code/i)).toBeInTheDocument();
    });
  });
});
