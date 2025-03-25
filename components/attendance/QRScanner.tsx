import { Box, Text, VStack, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const toast = useToast();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (error) {
        setHasPermission(false);
        onError('Camera access denied');
        toast({
          title: 'Camera Error',
          description: 'Unable to access camera. Please check permissions.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    startCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [onError, toast]);

  return (
    <VStack spacing={4} align="center" w="full">
      <Text fontSize="lg" fontWeight="medium">
        Scan Service QR Code
      </Text>
      <Box
        data-testid="qr-scanner-viewport"
        position="relative"
        w="full"
        maxW="300px"
        h="300px"
        border="2px solid"
        borderColor="purple.500"
        borderRadius="md"
        overflow="hidden"
      >
        {hasPermission ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <VStack
            h="full"
            justify="center"
            p={4}
            bg="gray.100"
          >
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