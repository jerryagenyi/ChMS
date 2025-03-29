import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QRCodeGenerator } from './QRCodeGenerator';

// Mock QRCode.toDataURL
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,test'),
}));

describe('QRCodeGenerator', () => {
  const mockData = 'test-data';
  const mockOnGenerated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state while generating QR code', () => {
    render(<QRCodeGenerator data={mockData} />);
    expect(screen.getByText('Generating QR code...')).toBeInTheDocument();
  });

  it('renders QR code when generation is complete', async () => {
    render(<QRCodeGenerator data={mockData} />);

    await waitFor(() => {
      const qrCode = screen.getByAltText('QR Code');
      expect(qrCode).toBeInTheDocument();
      expect(qrCode).toHaveAttribute('src', 'data:image/png;base64,test');
    });
  });

  it('renders error message when generation fails', async () => {
    const error = new Error('Generation failed');
    jest.spyOn(require('qrcode'), 'toDataURL').mockRejectedValueOnce(error);

    render(<QRCodeGenerator data={mockData} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to generate QR code')).toBeInTheDocument();
    });
  });

  it('calls onGenerated callback when QR code is generated', async () => {
    render(<QRCodeGenerator data={mockData} onGenerated={mockOnGenerated} />);

    await waitFor(() => {
      expect(mockOnGenerated).toHaveBeenCalledWith('data:image/png;base64,test');
    });
  });

  it('renders download button when includeDownload is true', async () => {
    render(<QRCodeGenerator data={mockData} includeDownload={true} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Download QR Code' })).toBeInTheDocument();
    });
  });

  it('does not render download button when includeDownload is false', async () => {
    render(<QRCodeGenerator data={mockData} includeDownload={false} />);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Download QR Code' })).not.toBeInTheDocument();
    });
  });

  it('handles download button click', async () => {
    const mockCreateElement = jest.fn().mockReturnValue({
      download: '',
      href: '',
      click: jest.fn(),
    });
    document.createElement = mockCreateElement as any;

    render(<QRCodeGenerator data={mockData} />);

    await waitFor(() => {
      const downloadButton = screen.getByRole('button', { name: 'Download QR Code' });
      fireEvent.click(downloadButton);
      expect(mockCreateElement).toHaveBeenCalledWith('a');
    });
  });

  it('regenerates QR code when data changes', async () => {
    const { rerender } = render(<QRCodeGenerator data="initial" />);
    await waitFor(() => {
      expect(require('qrcode').toDataURL).toHaveBeenCalledWith('initial', expect.any(Object));
    });

    rerender(<QRCodeGenerator data="updated" />);
    await waitFor(() => {
      expect(require('qrcode').toDataURL).toHaveBeenCalledWith('updated', expect.any(Object));
    });
  });
});
