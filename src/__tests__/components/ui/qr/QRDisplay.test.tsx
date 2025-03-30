import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QRDisplay from './QRDisplay';

describe('QRDisplay', () => {
  const mockDataUrl = 'data:image/png;base64,mock-qr-code';

  beforeEach(() => {
    // Mock document.createElement and related methods
    const mockLink = {
      download: '',
      href: '',
      click: jest.fn(),
    };
    document.createElement = jest.fn().mockReturnValue(mockLink);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  it('renders loading state', () => {
    render(<QRDisplay dataUrl={mockDataUrl} isLoading={true} />);
    expect(screen.getByText('Loading QR code...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const error = new Error('Failed to load QR code');
    render(<QRDisplay dataUrl={mockDataUrl} error={error} />);
    expect(screen.getByText('Failed to load QR code')).toBeInTheDocument();
  });

  it('renders QR code image', () => {
    render(<QRDisplay dataUrl={mockDataUrl} />);
    const img = screen.getByAltText('QR Code');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockDataUrl);
  });

  it('renders with custom size', () => {
    const size = 128;
    render(<QRDisplay dataUrl={mockDataUrl} size={size} />);
    const img = screen.getByAltText('QR Code');
    expect(img).toHaveAttribute('width', size.toString());
    expect(img).toHaveAttribute('height', size.toString());
  });

  it('renders with custom alt text', () => {
    const altText = 'Custom QR Code';
    render(<QRDisplay dataUrl={mockDataUrl} altText={altText} />);
    expect(screen.getByAltText(altText)).toBeInTheDocument();
  });

  it('includes download button by default', () => {
    render(<QRDisplay dataUrl={mockDataUrl} />);
    expect(screen.getByText('Download QR Code')).toBeInTheDocument();
  });

  it('hides download button when includeDownload is false', () => {
    render(<QRDisplay dataUrl={mockDataUrl} includeDownload={false} />);
    expect(screen.queryByText('Download QR Code')).not.toBeInTheDocument();
  });

  it('handles download button click', async () => {
    render(<QRDisplay dataUrl={mockDataUrl} />);
    const downloadButton = screen.getByText('Download QR Code');

    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(document.body.appendChild).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalled();
    });
  });

  it('handles download error', async () => {
    // Mock document.createElement to throw an error
    document.createElement = jest.fn().mockImplementation(() => {
      throw new Error('Download failed');
    });

    render(<QRDisplay dataUrl={mockDataUrl} />);
    const downloadButton = screen.getByText('Download QR Code');

    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(screen.getByText('Download failed')).toBeInTheDocument();
    });
  });

  it('applies custom styles', () => {
    const containerStyle = { backgroundColor: 'red' };
    const qrStyle = { border: '1px solid black' };

    render(<QRDisplay dataUrl={mockDataUrl} containerStyle={containerStyle} qrStyle={qrStyle} />);

    const container = screen.getByRole('img').parentElement;
    expect(container).toHaveStyle(containerStyle);
    expect(screen.getByRole('img')).toHaveStyle(qrStyle);
  });
});
