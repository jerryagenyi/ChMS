"use client";

import { Button, Icon } from "@chakra-ui/react";
import { FaQrcode } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface CheckInButtonProps {
  className?: string;
}

export default function CheckInButton({ className }: CheckInButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/check-in/scan");
  };

  return (
    <Button
      leftIcon={<Icon as={FaQrcode} />}
      colorScheme="purple"
      size="lg"
      onClick={handleClick}
      className={className}
      w="full"
      maxW="300px"
    >
      Scan to Check-in
    </Button>
  );
}