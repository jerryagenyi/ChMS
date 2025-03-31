import React, { useEffect, useState } from 'react';
import { Box, Button, VStack } from '@chakra-ui/react';
import '@/styles/components/qr/QRCodeGenerator.css';
import QRCode from 'qrcode';
import { QRCodeGeneratorProps, QRCodeGeneratorState } from './types';

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  data,
  size = 256,
  includeDownload = true,
  onGenerated,
}) => {
  const [state, setState] = useState<QRCodeGeneratorState>({
    dataUrl: null,
    error: null,
    isGenerating: false,
  });

  useEffect(() => {
    generateQRCode();
  }, [data, size]);

  const generateQRCode = async () => {
    try {
      setState(prev => ({ ...prev, isGenerating: true, error: null }));
      const dataUrl = await QRCode.toDataURL(data, {
        width: size,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setState(prev => ({ ...prev, dataUrl, isGenerating: false }));
      onGenerated?.(dataUrl);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate QR code');
      setState(prev => ({ ...prev, error: err, isGenerating: false }));
    }
  };

  const handleDownload = () => {
    if (!state.dataUrl) return;

    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = state.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <VStack className="qr-code-container">
      {state.isGenerating ? (
        <Text>Generating QR code...</Text>
      ) : state.error ? (
        <Text color="red.500">{state.error.message}</Text>
      ) : state.dataUrl ? (
        <>
          <Box
            className="qr-code-preview"
            as="img"
            src={state.dataUrl}
            alt="QR Code"
            width={size}
            height={size}
            borderRadius="md"
          />
          {includeDownload && (
            <div className="qr-code-actions">
              <Button onClick={handleDownload}>Download</Button>
            </div>
          )}
        </>
      ) : (
        <Text>No data to generate QR code</Text>
      )}
    </VStack>
  );
};

export default QRCodeGenerator;
