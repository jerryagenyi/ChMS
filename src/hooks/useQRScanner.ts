import { useState, useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';

interface UseQRScannerProps {
  onScan: (data: string) => void;
  onError: (error: string) => void;
  enabled: boolean;
}

export function useQRScanner({ onScan, onError, enabled }: UseQRScannerProps) {
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsActive(false);
  };

  const startCamera = async () => {
    if (!videoRef.current || !enabled) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      scannerRef.current = new QrScanner(
        videoRef.current,
        result => {
          onScan(result.data);
          stopCamera(); // Automatically stop camera after successful scan
        },
        {
          preferredCamera: 'environment',
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scannerRef.current.start();
      setIsActive(true);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Camera access failed');
      stopCamera();
    }
  };

  useEffect(() => {
    if (enabled) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [enabled]);

  return {
    isActive,
    videoRef,
    startCamera,
    stopCamera
  };
}