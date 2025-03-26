import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import QRScanner from '../QRScanner';
import { Html5QrcodeScanner } from 'html5-qrcode';

// Mock html5-qrcode
vi.mock('html5-qrcode', () => ({
  Html5QrcodeScanner: vi.fn().mockImplementation(() => {
    return {
      render: vi.fn(),
      clear: vi.fn(),
    };
  }),
}));

describe('QRScanner', () => {
  const mockOnScan = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the scanner container', () => {
    render(<QRScanner onScan={mockOnScan} onError={mockOnError} />);
    const container = screen.getByTestId('qr-scanner-viewport');
    expect(container).toBeInTheDocument();
  });

  it('initializes the scanner with correct parameters', () => {
    render(<QRScanner onScan={mockOnScan} onError={mockOnError} />);
    expect(Html5QrcodeScanner).toHaveBeenCalledWith(
      expect.any(String),
      { fps: expect.any(Number), qrbox: expect.any(Object) },
      false
    );
  });
});
