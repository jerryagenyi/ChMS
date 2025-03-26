"use client";

import { Box, VStack } from "@chakra-ui/react";
import CheckInButton from "@/components/attendance/CheckInButton";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function DashboardPage() {
  const isMobile = useIsMobile();

  return (
    <Box p={4}>
      <VStack spacing={6} align="center">
        {isMobile && <CheckInButton />}
        {/* Other dashboard content */}
      </VStack>
    </Box>
  );
}