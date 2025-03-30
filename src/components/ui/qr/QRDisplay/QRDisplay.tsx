import React, { useState } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { QRDisplayProps, QRDisplayState } from './types';

export const QRDisplay: React.FC<QRDisplayProps> = ({
  dataUrl,
  size = 256,
  isLoading = false,
  error = null,
  containerStyle,
  qrStyle,
  includeDownload = true,
  altText = 'QR Code',
}) => {
  const [state, setState] = useState<QRDisplayState>({
    isDownloading: false,
    error: null,
  });

  const handleDownload = async () => {
    try {
      setState(prev => ({ ...prev, isDownloading: true, error: null }));

      // Create a temporary link element
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = dataUrl;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setState(prev => ({ ...prev, isDownloading: false }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to download QR code');
      setState(prev => ({ ...prev, error, isDownloading: false }));
    }
  };

  if (isLoading) {
    return (
      <VStack spacing={4} style={containerStyle}>
        <Text>Loading QR code...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack spacing={4} style={containerStyle}>
        <Text color="red.500">{error.message}</Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} style={containerStyle}>
      <Box
        style={qrStyle}
        as="img"
        src={dataUrl}
        alt={altText}
        width={size}
        height={size}
        borderRadius="md"
      />
      {includeDownload && (
        <Button
          onClick={handleDownload}
          colorScheme="blue"
          isLoading={state.isDownloading}
          loadingText="Downloading..."
        >
          Download QR Code
        </Button>
      )}
      {state.error && (
        <Text color="red.500" fontSize="sm">
          {state.error.message}
        </Text>
      )}
    </VStack>
  );
};

export default QRDisplay;
