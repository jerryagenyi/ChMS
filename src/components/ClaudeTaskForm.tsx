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
  Select,
  HStack,
  Badge,
  Tooltip,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
} from '@chakra-ui/react';
import { ClaudeModel, TaskComplexity } from '@/lib/claude/types';

/**
 * ClaudeTaskForm provides a user interface for interacting with Claude AI.
 *
 * This component allows users to submit prompts to Claude and displays the responses.
 * It handles loading states, error handling, and provides feedback via toast notifications.
 */
export function ClaudeTaskForm() {
  // Form state
  const [prompt, setPrompt] = useState('');
  const [complexity, setComplexity] = useState<TaskComplexity>('low');
  const [model, setModel] = useState<ClaudeModel | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [responseStats, setResponseStats] = useState<{
    model?: ClaudeModel;
    tokensUsed?: number;
  } | null>(null);

  // UI utilities
  const toast = useToast();

  // Validation
  const isPromptEmpty = prompt.trim() === '';

  // Model descriptions for tooltips
  const modelDescriptions = {
    'claude-3-haiku-20240229': 'Fastest and most cost-effective model, good for most tasks',
    'claude-3-sonnet-20240229': 'More capable model for complex tasks, higher cost',
    'claude-3-opus-20240229': 'Most powerful model for critical tasks, highest cost',
  };

  // Complexity descriptions
  const complexityDescriptions = {
    low: 'Simple tasks like basic questions or formatting (uses Haiku)',
    medium: 'Moderate complexity tasks like explanations or summaries (uses Haiku)',
    high: 'Complex tasks requiring deeper analysis or creativity (uses Sonnet)',
    critical: 'Critical tasks requiring maximum capability (uses Opus)',
  };

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
    setResponseStats(null);

    try {
      // Prepare request payload
      const payload: any = {
        description: prompt,
        complexity: complexity,
      };

      // Only include model if manually selected
      if (model) {
        payload.model = model;
      }

      // Send request to API
      const response = await fetch('/api/claude/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Parse response
      const data = await response.json();

      // Handle success or error
      if (data.success) {
        setResult(data.data);

        // Store response stats
        setResponseStats({
          model: data.model,
          tokensUsed: data.tokensUsed,
        });

        toast({
          title: 'Task completed',
          description: `Used ${data.model || 'Claude'}`,
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
        <Text fontSize="sm" color="gray.600">
          Claude uses a cost-efficient model selection strategy based on task complexity.
        </Text>

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

            <HStack width="full" spacing={4}>
              <FormControl>
                <FormLabel>
                  <Tooltip label="Select the complexity of your task to use the appropriate model">
                    Task Complexity
                  </Tooltip>
                </FormLabel>
                <Select
                  value={complexity}
                  onChange={e => setComplexity(e.target.value as TaskComplexity)}
                  isDisabled={isLoading}
                >
                  <option value="low">Low - Simple tasks</option>
                  <option value="medium">Medium - Moderate tasks</option>
                  <option value="high">High - Complex tasks</option>
                  <option value="critical">Critical - Highest importance</option>
                </Select>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {complexityDescriptions[complexity]}
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>
                  <Tooltip label="Override the automatic model selection (optional)">
                    Model Override (Optional)
                  </Tooltip>
                </FormLabel>
                <Select
                  value={model}
                  onChange={e => setModel(e.target.value as ClaudeModel | '')}
                  isDisabled={isLoading}
                  placeholder="Auto-select based on complexity"
                >
                  <option value="claude-3-haiku-20240229">Claude 3 Haiku (Fastest)</option>
                  <option value="claude-3-sonnet-20240229">Claude 3 Sonnet (Balanced)</option>
                  <option value="claude-3-opus-20240229">Claude 3 Opus (Most Capable)</option>
                </Select>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {model
                    ? modelDescriptions[model as ClaudeModel]
                    : 'Let Claude choose the best model'}
                </Text>
              </FormControl>
            </HStack>

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
          <Box mt={4}>
            {responseStats && (
              <Box mb={4} p={3} borderRadius="md" bg="blue.50" _dark={{ bg: 'blue.900' }}>
                <StatGroup>
                  <Stat>
                    <StatLabel>Model Used</StatLabel>
                    <StatNumber>
                      <Badge
                        colorScheme={
                          responseStats.model === 'claude-3-opus-20240229'
                            ? 'purple'
                            : responseStats.model === 'claude-3-sonnet-20240229'
                            ? 'blue'
                            : 'green'
                        }
                      >
                        {responseStats.model
                          ? responseStats.model.replace('claude-3-', '').replace('-20240229', '')
                          : 'Unknown'}
                      </Badge>
                    </StatNumber>
                    <StatHelpText>Based on task complexity</StatHelpText>
                  </Stat>

                  {responseStats.tokensUsed && (
                    <Stat>
                      <StatLabel>Tokens Used</StatLabel>
                      <StatNumber>{responseStats.tokensUsed}</StatNumber>
                      <StatHelpText>Estimated usage</StatHelpText>
                    </Stat>
                  )}
                </StatGroup>
              </Box>
            )}

            <Box p={4} borderRadius="md" bg="gray.50" _dark={{ bg: 'gray.700' }}>
              <Heading size="sm" mb={2}>
                Response:
              </Heading>
              <Text whiteSpace="pre-wrap">{result}</Text>
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
