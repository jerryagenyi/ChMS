"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  useToast,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";

export default function PasswordSetup() {
  const { data: session } = useSession();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const toast = useToast();
  const { onClose } = useDisclosure();

  useEffect(() => {
    // Only check if we need to show the password setup if there's a session
    if (session?.user) {
      const checkPasswordStatus = async () => {
        try {
          const res = await fetch("/api/auth/check-password-status");
          const data = await res.json();
          // Only show if user logged in with Google AND doesn't have a password
          setShouldShow(data.needsPassword === true);
        } catch (error) {
          console.error("Failed to check password status:", error);
          setShouldShow(false);
        }
      };

      checkPasswordStatus();
    }
  }, [session]);

  // Don't render anything if we shouldn't show the component
  if (!shouldShow) return null;

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast({
          title: "Password set successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setShouldShow(false);
        onClose();
      } else {
        toast({
          title: "Failed to set password",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box position="fixed" bottom="4" right="4" zIndex="popover">
      <Popover placement="top-end">
        <PopoverTrigger>
          <IconButton
            aria-label="Set backup password"
            icon={<LockIcon />}
            colorScheme="purple"
            variant="solid"
            size="md"
            rounded="full"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <Heading size="sm">Want a backup login option?</Heading>
          </PopoverHeader>
          <PopoverBody>
            <Text fontSize="sm" mb={3}>
              Set up an email password for additional access to your account.
            </Text>
            <form onSubmit={handleSetPassword}>
              <HStack spacing={2}>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  size="sm"
                />
                <Button
                  type="submit"
                  colorScheme="purple"
                  size="sm"
                  isLoading={isLoading}
                  loadingText="Setting..."
                >
                  Set
                </Button>
              </HStack>
            </form>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
