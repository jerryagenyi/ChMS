'use client';

import { useEffect, useState } from 'react';
import { Box, Image, Spinner } from '@chakra-ui/react';
import { generateQRCode, QRData } from '@/lib/attendance/qr';

interface QRDisplayProps {
  data: QRData;
  size?: number;
}

export default function QRDisplay({ data, size = 200 }: QRDisplayProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generateCode = async () => {
      try {
        setIsLoading(true);
        setError('');
        const url = await generateQRCode(data);
        setQrUrl(url);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
        setError('Error generating QR code');
      } finally {
        setIsLoading(false);
      }
    };

    generateCode();
  }, [data]);

  if (isLoading) {
    return (
      <Box
        data-testid="qr-loading"
        width={size}
        height={size}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        data-testid="qr-error"
        width={size}
        height={size}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="red.500"
      >
        {error}
      </Box>
    );
  }

  return qrUrl ? (
    <Image data-testid="qr-image" src={qrUrl} alt="QR Code" width={size} height={size} />
  ) : null;
}
