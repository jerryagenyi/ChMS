import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Permission, Role } from "../types/auth";
import { checkPermission, checkPermissions } from "../lib/auth/permissions";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

interface WithPermissionProps {
  requiredPermissions?: Permission[];
  requireAllPermissions?: boolean;
  allowedRoles?: Role[];
  fallback?: React.ReactNode;
}

export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithPermissionProps = {}
) {
  return function WithPermissionComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
      return (
        <Box p={8} textAlign="center">
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading...</Text>
          </VStack>
        </Box>
      );
    }

    if (!session?.user) {
      router.push("/auth/signin");
      return null;
    }

    const userRole = session.user.role as Role;

    // Check if user's role is allowed
    if (options.allowedRoles && !options.allowedRoles.includes(userRole)) {
      if (options.fallback) {
        return <>{options.fallback}</>;
      }
      return (
        <Box p={8} textAlign="center">
          <VStack spacing={4}>
            <Text fontSize="xl" fontWeight="bold">
              Access Denied
            </Text>
            <Text>Your role does not have access to this resource.</Text>
          </VStack>
        </Box>
      );
    }

    // Check if user has required permissions
    if (options.requiredPermissions) {
      const hasPermission = options.requireAllPermissions
        ? checkPermissions(userRole, options.requiredPermissions, true)
        : checkPermissions(userRole, options.requiredPermissions);

      if (!hasPermission) {
        if (options.fallback) {
          return <>{options.fallback}</>;
        }
        return (
          <Box p={8} textAlign="center">
            <VStack spacing={4}>
              <Text fontSize="xl" fontWeight="bold">
                Access Denied
              </Text>
              <Text>You do not have permission to view this content.</Text>
            </VStack>
          </Box>
        );
      }
    }

    return <WrappedComponent {...props} />;
  };
}
