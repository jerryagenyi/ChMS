import { Box, Text, VStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import '@/styles/components/QRScanner.css';

interface QRScannerProps {
  onScan: (qrData: string) => void;
  onError: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const toast = useToast();
  const router = useRouter();

  const handleScan = async (qrData: string) => {
    if (!qrData || isValidating) return;

    try {
      setIsValidating(true);
      const response = await fetch('/api/attendance/qr/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate QR code');
      }

      toast({
        title: 'Success',
        description: 'QR code validated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      router.push(`/attendance/class/${data.data.classId}`);
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to validate QR code',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleError = (error: string) => {
    toast({
      title: 'Scanner Error',
      description: error,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <VStack className="qr-scanner-container" spacing={4}>
      <Text fontSize="lg" fontWeight="medium">
        Scan Service QR Code
      </Text>
      <Box data-testid="qr-scanner-viewport" className="qr-scanner-viewport">
        {hasPermission ? (
          <video className="qr-scanner-video" ref={videoRef} autoPlay playsInline />
        ) : (
          <VStack className="qr-scanner-error">
            <Text textAlign="center" color="gray.600">
              Camera access required for QR scanning
            </Text>
          </VStack>
        )}
      </Box>
    </VStack>
  );
};

export default QRScanner;
