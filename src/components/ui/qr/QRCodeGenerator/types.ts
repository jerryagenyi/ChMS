export interface QRCodeGeneratorProps {
  /** Data to encode in the QR code */
  data: string;
  /** Size of the QR code in pixels */
  size?: number;
  /** Error correction level */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  /** Whether to include a download button */
  includeDownload?: boolean;
  /** Custom styles for the container */
  containerStyle?: React.CSSProperties;
  /** Custom styles for the QR code */
  qrStyle?: React.CSSProperties;
  /** Callback when QR code is generated */
  onGenerated?: (dataUrl: string) => void;
}

export interface QRCodeGeneratorState {
  dataUrl: string | null;
  error: Error | null;
  isGenerating: boolean;
} 