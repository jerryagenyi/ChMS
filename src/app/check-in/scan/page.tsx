"use client";

import { Box, VStack, Button, useToast } from "@chakra-ui/react";
import QRScanner from "@/components/attendance/QRScanner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ScanPage() {
  const router = useRouter();
  const toast = useToast();
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = async (result: string) => {
    setIsScanning(false);
    try {
      // Handle the QR code result
      // Add your check-in logic here
      toast({
        title: "Check-in successful",
        status: "success",
        duration: 3000,
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Check-in failed",
        description: "Please try again",
        status: "error",
        duration: 3000,
      });
      setIsScanning(true);
    }
  };

  const handleError = (error: string) => {
    toast({
      title: "Scanner Error",
      description: error,
      status: "error",
      duration: 3000,
    });
  };

  return (
    <Box p={4}>
      <VStack spacing={6}>
        {isScanning && (
          <QRScanner onScan={handleScan} onError={handleError} />
        )}
        <Button
          colorScheme="gray"
          onClick={() => router.push("/dashboard")}
        >
          Cancel
        </Button>
      </VStack>
    </Box>
  );
}