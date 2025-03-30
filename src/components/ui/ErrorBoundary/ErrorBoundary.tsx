import React from 'react';
import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  VStack,
  Text,
  Code,
  useToast,
} from '@chakra-ui/react';
import { ErrorBoundaryProps, ErrorBoundaryState } from './types';

const DefaultFallback: React.FC<{
  error: Error;
  errorInfo: React.ErrorInfo;
  onReset: () => void;
}> = ({ error, errorInfo, onReset }) => (
  <Alert
    status="error"
    variant="subtle"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    height="auto"
    py={8}
  >
    <AlertIcon boxSize="40px" mr={0} />
    <AlertTitle mt={4} mb={1} fontSize="lg">
      Something went wrong
    </AlertTitle>
    <AlertDescription maxWidth="sm">{error.message}</AlertDescription>
    <VStack mt={4} spacing={2} align="stretch" width="100%">
      <Text fontSize="sm" fontWeight="bold">
        Component Stack:
      </Text>
      <Code p={2} borderRadius="md" fontSize="xs" whiteSpace="pre-wrap">
        {errorInfo.componentStack}
      </Code>
      <Button colorScheme="red" variant="outline" onClick={onReset} mt={4}>
        Try again
      </Button>
    </VStack>
  </Alert>
);

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <DefaultFallback
          error={this.state.error!}
          errorInfo={this.state.errorInfo!}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
