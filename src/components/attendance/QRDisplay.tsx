"use client";

import { useEffect, useState } from "react";
import { Box, Image, Spinner } from "@chakra-ui/react";
import { generateQRCode } from "@/lib/attendance/qr";

interface QRDisplayProps {
  data: string;
  size?: number;
}

export default function QRDisplay({ data, size = 250 }: QRDisplayProps) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateCode = async () => {
      try {
        setIsLoading(true);
        const url = await generateQRCode(data);
        setQrUrl(url);
      } catch (error) {
        console.error("Failed to generate QR code:", error);
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

  return qrUrl ? (
    <Image
      data-testid="qr-image"
      src={qrUrl}
      alt="QR Code"
      width={size}
      height={size}
    />
  ) : null;
}
