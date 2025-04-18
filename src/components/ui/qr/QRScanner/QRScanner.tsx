import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import '@/styles/components/qr/QRScanner.css';

export const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onError,
  isActive = true,
  errorMessage = 'Failed to access camera',
  showPreview = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<QRScannerState>({
    isScanning: false,
    error: null,
    lastScannedData: null,
  });

  useEffect(() => {
    if (isActive) {
      startScanning();
    } else {
      stopScanning();
    }
    return () => stopScanning();
  }, [isActive]);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setState(prev => ({ ...prev, isScanning: true, error: null }));
    } catch (error) {
      const err = error instanceof Error ? error : new Error(errorMessage);
      setState(prev => ({ ...prev, error: err }));
      onError?.(err);
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setState(prev => ({ ...prev, isScanning: false }));
  };

  const handleVideoRef = (element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element) {
      element.play().catch(error => {
        const err = error instanceof Error ? error : new Error(errorMessage);
        setState(prev => ({ ...prev, error: err }));
        onError?.(err);
      });
    }
  };

  return (
    <VStack className="qr-scanner-container" spacing={4}>
      {showPreview && (
        <Box className="qr-scanner-viewport">
          <video ref={handleVideoRef} className="qr-scanner-video" playsInline />
          {!state.isScanning && (
            <Box className="qr-scanner-error">
              <Text>Camera not active</Text>
              <Button onClick={startScanning} mt={2}>
                Start Scanning
              </Button>
            </Box>
          )}
        </Box>
      )}
      {state.error && (
        <Text color="red.500" textAlign="center">
          {state.error.message}
        </Text>
      )}
    </VStack>
  );
};

export default QRScanner;
