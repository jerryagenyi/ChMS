import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QRScanner } from './QRScanner';

// Mock getUserMedia
const mockGetUserMedia = jest.fn();
Object.defineProperty(global.navigator.mediaDevices, 'getUserMedia', {
  value: mockGetUserMedia,
});

describe('QRScanner', () => {
  const mockOnScan = jest.fn();
  const mockOnError = jest.fn();
  const mockStream = {
    getTracks: () => [{ stop: jest.fn() }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders scanner with preview', () => {
    render(
      <QRScanner onScan={mockOnScan} onError={mockOnError} isActive={false} showPreview={true} />
    );

    expect(screen.getByText('Camera not active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Scanning' })).toBeInTheDocument();
  });

  it('renders scanner without preview', () => {
    render(
      <QRScanner onScan={mockOnScan} onError={mockOnError} isActive={false} showPreview={false} />
    );

    expect(screen.queryByText('Camera not active')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Start Scanning' })).not.toBeInTheDocument();
  });

  it('starts scanning when isActive is true', async () => {
    mockGetUserMedia.mockResolvedValueOnce(mockStream);

    render(
      <QRScanner onScan={mockOnScan} onError={mockOnError} isActive={true} showPreview={true} />
    );

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: { facingMode: 'environment' },
      });
    });
  });

  it('handles camera access error', async () => {
    const error = new Error('Camera access denied');
    mockGetUserMedia.mockRejectedValueOnce(error);

    render(
      <QRScanner onScan={mockOnScan} onError={mockOnError} isActive={true} showPreview={true} />
    );

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(error);
      expect(screen.getByText('Camera access denied')).toBeInTheDocument();
    });
  });

  it('stops scanning when isActive becomes false', async () => {
    mockGetUserMedia.mockResolvedValueOnce(mockStream);

    const { rerender } = render(
      <QRScanner onScan={mockOnScan} onError={mockOnError} isActive={true} showPreview={true} />
    );

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalled();
    });

    rerender(
      <QRScanner onScan={mockOnScan} onError={mockOnError} isActive={false} showPreview={true} />
    );

    expect(screen.getByText('Camera not active')).toBeInTheDocument();
  });

  it('starts scanning when start button is clicked', async () => {
    mockGetUserMedia.mockResolvedValueOnce(mockStream);

    render(
      <QRScanner onScan={mockOnScan} onError={mockOnError} isActive={false} showPreview={true} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Start Scanning' }));

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalled();
    });
  });
});
