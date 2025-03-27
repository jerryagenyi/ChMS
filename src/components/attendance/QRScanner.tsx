import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  useToast,
  Box,
} from '@chakra-ui/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/navigation';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRScanner({ isOpen, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Scan Attendance QR Code</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Box position="relative" width="100%" height="300px">
              {isScanning ? (
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{
                    facingMode: 'environment',
                  }}
                  paused={!isScanning || isValidating}
                />
              ) : (
                <Box
                  width="100%"
                  height="100%"
                  bg="gray.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text>Scanner paused</Text>
                </Box>
              )}
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
