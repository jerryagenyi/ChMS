"use client";

import React, { useEffect, useRef } from "react";
import { VStack, Text, Box } from "@chakra-ui/react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onError: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    scannerRef.current = new Html5QrcodeScanner(
      "qr-scanner",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current.render(onScan, (error) => {
      if (error) {
        onError(error.toString());
      }
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [onScan, onError]);

  return (
    <VStack spacing={4}>
      <Text fontSize="lg">Scan Service QR Code</Text>
      <Box
        data-testid="qr-scanner-viewport"
        width="100%"
        maxWidth="500px"
        height="300px"
        position="relative"
      >
        <div id="qr-scanner">
          <VStack spacing={2}>
            <Text color="gray.500">Camera access required for QR scanning</Text>
          </VStack>
        </div>
      </Box>
    </VStack>
  );
}
