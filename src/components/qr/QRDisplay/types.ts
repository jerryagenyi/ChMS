export interface QRDisplayProps {
  /** QR code data URL */
  dataUrl: string;
  /** Size of the QR code in pixels */
  size?: number;
  /** Whether to show a loading state */
  isLoading?: boolean;
  /** Whether to show an error state */
  error?: Error | null;
  /** Custom styles for the container */
  containerStyle?: React.CSSProperties;
  /** Custom styles for the QR code */
  qrStyle?: React.CSSProperties;
  /** Whether to show a download button */
  includeDownload?: boolean;
  /** Custom alt text for the QR code */
  altText?: string;
}

export interface QRDisplayState {
  isDownloading: boolean;
  error: Error | null;
} 