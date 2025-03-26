import { useState, useEffect } from 'react';
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
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { CopyIcon, DownloadIcon } from '@chakra-ui/icons';
import { encodeQRData } from '@/lib/qr';

interface QRCodeGeneratorProps {
  classId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeGenerator({ classId, isOpen, onClose }: QRCodeGeneratorProps) {
  const [qrData, setQrData] = useState<string>('');
  const [expiryTime, setExpiryTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen, classId]);

  const generateQRCode = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/attendance/qr/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId,
          expiryMinutes: 5,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const { data } = await response.json();
      const encodedData = encodeQRData(data);
      setQrData(encodedData);
      setExpiryTime(new Date(data.timestamp + data.expiryMinutes * 60 * 1000));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      toast({
        title: 'Success',
        description: 'QR code data copied to clipboard',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy QR code data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `attendance-qr-${classId}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Generate Attendance QR Code</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            {isLoading ? (
              <Text>Generating QR code...</Text>
            ) : (
              <>
                <Box p={4} bg="white" borderRadius="md">
                  <QRCodeSVG id="qr-code" value={qrData} size={256} level="H" includeMargin />
                </Box>
                {expiryTime && (
                  <Text fontSize="sm" color="gray.500">
                    Expires at: {expiryTime.toLocaleTimeString()}
                  </Text>
                )}
                <HStack spacing={4}>
                  <Button leftIcon={<CopyIcon />} onClick={copyToClipboard} size="sm">
                    Copy Data
                  </Button>
                  <IconButton
                    aria-label="Download QR code"
                    icon={<DownloadIcon />}
                    onClick={downloadQRCode}
                    size="sm"
                  />
                </HStack>
              </>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
