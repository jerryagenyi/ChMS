export interface QRScannerProps {
  /** Callback when QR code is successfully scanned */
  onScan: (data: string) => void;
  /** Callback when scanning fails */
  onError?: (error: Error) => void;
  /** Whether the scanner is active */
  isActive?: boolean;
  /** Custom error message */
  errorMessage?: string;
  /** Whether to show the camera preview */
  showPreview?: boolean;
  /** Custom styles for the scanner container */
  containerStyle?: React.CSSProperties;
}

export interface QRScannerState {
  isScanning: boolean;
  error: Error | null;
  lastScannedData: string | null;
} 