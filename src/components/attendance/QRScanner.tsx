import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  useToast,
  Box,
  IconButton,
} from '@chakra-ui/react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { CloseIcon, PauseIcon, PlayIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRScanner({ isOpen, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleScan = async (result: string | null) => {
    if (!result) return;

    try {
      setIsValidating(true);
      const response = await fetch('/api/attendance/qr/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrData: result,
        }),
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

      // Navigate to attendance page
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

  const handleError = (error: Error) => {
    console.error('QR Scanner error:', error);
    toast({
      title: 'Error',
      description: 'Failed to access camera',
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
                <QrScanner
                  onDecode={handleScan}
                  onError={handleError}
                  constraints={{
                    facingMode: 'environment',
                  }}
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
              <IconButton
                aria-label={isScanning ? 'Pause scanner' : 'Resume scanner'}
                icon={isScanning ? <PauseIcon /> : <PlayIcon />}
                onClick={() => setIsScanning(!isScanning)}
                position="absolute"
                top={2}
                right={2}
                colorScheme="blue"
                size="sm"
                isDisabled={isValidating}
              />
            </Box>
            <Text fontSize="sm" color="gray.500">
              Position the QR code within the frame
            </Text>
            <Button
              leftIcon={<CloseIcon />}
              onClick={onClose}
              variant="ghost"
              size="sm"
              isDisabled={isValidating}
            >
              Close
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
