"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
  Card,
  CardBody,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import Dialog from "@/components/Dialog";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [status, router]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({ redirect: false });
      toast.success("Signed out successfully");
      router.replace("/auth/signin");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
      setShowConfirmDialog(false);
    }
  };

  if (status === "loading") {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="4xl">
        <Card
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow="sm"
        >
          <CardBody>
            <Flex justify="space-between" align="center" mb={8}>
              <Stack>
                <Heading size="lg" color="purple.700">
                  Dashboard
                </Heading>
                <Text color="gray.600">
                  Welcome back, {session.user?.name || "User"}
                </Text>
              </Stack>
              <Button
                colorScheme="purple"
                variant="outline"
                onClick={() => setShowConfirmDialog(true)}
                isLoading={isSigningOut}
                loadingText="Signing out..."
              >
                Sign Out
              </Button>
            </Flex>

            {/* Add your dashboard content here */}
            <Box>
              <Text color="gray.600">Your dashboard content goes here...</Text>
            </Box>
          </CardBody>
        </Card>

        <Dialog
          isOpen={showConfirmDialog}
          onClose={() => !isSigningOut && setShowConfirmDialog(false)}
          title="Confirm Sign Out"
        >
          <Box>
            <Text mb={6}>Are you sure you want to sign out?</Text>
            <Flex justify="flex-end" gap={4}>
              <Button
                variant="ghost"
                onClick={() => setShowConfirmDialog(false)}
                isDisabled={isSigningOut}
              >
                Cancel
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleSignOut}
                isLoading={isSigningOut}
                loadingText="Signing out..."
              >
                Sign Out
              </Button>
            </Flex>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
}
