import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransitionProps, PageTransitionState } from './types';

const transitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isLoading,
  isError,
  error,
  onRetry,
  transition = 'fade',
  duration = 0.3,
}) => {
  const toast = useToast();
  const [state, setState] = useState<PageTransitionState>({
    isEntering: true,
    isExiting: false,
    hasError: false,
  });

  useEffect(() => {
    if (isError) {
      setState(prev => ({ ...prev, hasError: true }));
      toast({
        title: 'Error',
        description: error?.message,
        status: 'error',
        duration: 5000,
      });
    }
  }, [isError, error, toast]);

  const handleRetry = () => {
    setState(prev => ({ ...prev, hasError: false }));
    onRetry?.();
  };

  if (isError) {
    return (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Error
        </AlertTitle>
        <AlertDescription maxWidth="sm">{error?.message}</AlertDescription>
        {onRetry && (
          <Button colorScheme="red" variant="outline" mt={4} onClick={handleRetry}>
            Retry
          </Button>
        )}
      </Alert>
    );
  }

  return (
    <Box position="relative" minHeight="200px">
      {isLoading && (
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex={1}>
          <Spinner size="xl" color="brand.500" />
        </Box>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={window.location.pathname}
          initial={transitions[transition].initial}
          animate={transitions[transition].animate}
          exit={transitions[transition].exit}
          transition={{ duration }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};
