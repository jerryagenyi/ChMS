import { useState } from 'react';
import {
  Button,
  Textarea,
  VStack,
  Text,
  useToast,
  Box,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';

/**
 * ClaudeTaskForm provides a user interface for interacting with Claude AI.
 *
 * This component allows users to submit prompts to Claude and displays the responses.
 * It handles loading states, error handling, and provides feedback via toast notifications.
 */
export function ClaudeTaskForm() {
  // Form state
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI utilities
  const toast = useToast();

  // Validation
  const isPromptEmpty = prompt.trim() === '';

  /**
   * Handles form submission to the Claude API.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (isPromptEmpty) {
      setError('Please enter a question or task description');
      return;
    }

    // Reset state
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      // Send request to API
      const response = await fetch('/api/claude/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: prompt }),
      });

      // Parse response
      const data = await response.json();

      // Handle success or error
      if (data.success) {
        setResult(data.data);
        toast({
          title: 'Task completed',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setError(data.error || 'Unknown error occurred');
        toast({
          title: 'Error',
          description: data.error || 'Failed to process task',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process task');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process task',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} borderRadius="md" bg="white" boxShadow="sm">
      <VStack spacing={6} align="stretch">
        <Heading size="md">Ask Claude</Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!error && isPromptEmpty}>
              <FormLabel>Question or Task</FormLabel>
              <Textarea
                value={prompt}
                onChange={e => {
                  setPrompt(e.target.value);
                  if (e.target.value.trim() !== '') {
                    setError(null);
                  }
                }}
                placeholder="Enter your question or task description..."
                size="lg"
                minH="150px"
                isDisabled={isLoading}
              />
              {error && isPromptEmpty && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Processing..."
              width="full"
              isDisabled={isPromptEmpty}
            >
              Submit
            </Button>
          </VStack>
        </form>

        {error && !isPromptEmpty && (
          <Box
            mt={4}
            p={4}
            borderRadius="md"
            bg="red.50"
            color="red.600"
            _dark={{ bg: 'red.900', color: 'red.200' }}
          >
            <Heading size="sm" mb={2}>
              Error:
            </Heading>
            <Text>{error}</Text>
          </Box>
        )}

        {result && (
          <Box mt={4} p={4} borderRadius="md" bg="gray.50" _dark={{ bg: 'gray.700' }}>
            <Heading size="sm" mb={2}>
              Response:
            </Heading>
            <Text whiteSpace="pre-wrap">{result}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
