import React from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { AppError } from "../lib/errors";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage =
        this.state.error instanceof AppError
          ? this.state.error.message
          : "An unexpected error occurred";

      return (
        <Box p={8} textAlign="center">
          <VStack spacing={4}>
            <Heading size="lg">Something went wrong</Heading>
            <Text>{errorMessage}</Text>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Try again
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}
