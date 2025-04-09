# Claude Taskmaster

A robust implementation for managing AI tasks using Anthropic's Claude API. This taskmaster provides a structured way to create, execute, and track tasks that involve generating responses from Claude.

## Installation & Setup

### 1. Dependencies

```bash
# Install the Anthropic SDK
npm install @anthropic-ai/sdk
# or
yarn add @anthropic-ai/sdk

# Install Chakra UI if not already installed (for UI components)
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
# or
yarn add @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

### 2. Environment Variables

Create or update your `.env.local` file:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. API Endpoint

Create an API endpoint for Claude tasks:

```typescript
// pages/api/claude/task.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { ClaudeTaskMaster } from '@/lib/claude/taskmaster';
import { TaskResult } from '@/lib/claude/types';

// Initialize the TaskMaster with the API key and model selection strategy
const taskMaster = new ClaudeTaskMaster({
  defaultModel: 'claude-3-haiku-20240229',
  modelStrategy: {
    low: 'claude-3-haiku-20240229',      // Most cost-effective for simple tasks
    medium: 'claude-3-haiku-20240229',   // Still use Haiku for medium complexity
    high: 'claude-3-sonnet-20240229',    // Use Sonnet for complex tasks
    critical: 'claude-3-opus-20240229'   // Use Opus only for critical tasks
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await handlePostRequest(req, res);
  } else if (req.method === 'GET') {
    await handleGetRequest(req, res);
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { description, metadata, complexity, model } = req.body;

  if (!description) {
    return res.status(400).json({
      error: 'Description is required',
      code: 'VALIDATION_ERROR'
    });
  }

  try {
    // Create a new task with complexity information
    const task = await taskMaster.createTask({
      description,
      complexity,
      metadata,
      model
    });

    // Execute the task
    const result = await taskMaster.executeTask(task.id);

    // Return the result
    return res.status(200).json(result);
  } catch (error) {
    console.error('Task execution error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process task',
      code: 'EXECUTION_ERROR'
    } as TaskResult);
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { taskId } = req.query;

  if (taskId) {
    // Get a specific task
    const task = taskMaster.getTask(taskId as string);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        code: 'TASK_NOT_FOUND'
      });
    }
    return res.status(200).json({ success: true, data: task });
  } else {
    // Get all tasks
    const tasks = taskMaster.getAllTasks();
    return res.status(200).json({ success: true, data: tasks });
  }
}
```

### 4. UI Component

Create a UI component for interacting with Claude:

```tsx
// components/ClaudeTaskForm.tsx
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
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { ClaudeModel, TaskComplexity } from '@/lib/claude/types';

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
        complexity: complexity
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
          tokensUsed: data.tokensUsed
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
                  onChange={(e) => setComplexity(e.target.value as TaskComplexity)}
                  isDisabled={isLoading}
                >
                  <option value="low">Low - Simple tasks</option>
                  <option value="medium">Medium - Moderate tasks</option>
                  <option value="high">High - Complex tasks</option>
                  <option value="critical">Critical - Highest importance</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>
                  <Tooltip label="Override the automatic model selection (optional)">
                    Model Override (Optional)
                  </Tooltip>
                </FormLabel>
                <Select
                  value={model}
                  onChange={(e) => setModel(e.target.value as ClaudeModel | '')}
                  isDisabled={isLoading}
                  placeholder="Auto-select based on complexity"
                >
                  <option value="claude-3-haiku-20240229">Claude 3 Haiku (Fastest)</option>
                  <option value="claude-3-sonnet-20240229">Claude 3 Sonnet (Balanced)</option>
                  <option value="claude-3-opus-20240229">Claude 3 Opus (Most Capable)</option>
                </Select>
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
                      <Badge colorScheme={
                        responseStats.model === 'claude-3-opus-20240229' ? 'purple' :
                        responseStats.model === 'claude-3-sonnet-20240229' ? 'blue' : 'green'
                      }>
                        {responseStats.model ? responseStats.model.replace('claude-3-', '').replace('-20240229', '') : 'Unknown'}
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
```

### 5. Import and Initialize

```typescript
// pages/your-page.tsx
import { ClaudeTaskForm } from '@/components/ClaudeTaskForm';

export default function YourPage() {
  return (
    <div>
      <h1>Ask Claude</h1>
      <ClaudeTaskForm />
    </div>
  );
}

// Or initialize TaskMaster directly
import { ClaudeTaskMaster } from '@/lib/claude/taskmaster';

const taskMaster = new ClaudeTaskMaster({
  defaultModel: 'claude-3-haiku-20240229',
  modelStrategy: {
    low: 'claude-3-haiku-20240229',
    medium: 'claude-3-haiku-20240229',
    high: 'claude-3-sonnet-20240229',
    critical: 'claude-3-opus-20240229'
  },
  rateLimit: 10 // requests per minute
});
```

### 6. Testing Setup

For testing, you should mock the Anthropic SDK:

```typescript
// In your test file
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: 'Mock response' }],
      }),
    },
  }));
});
```

## Model Selection Strategy

The Taskmaster implements a cost-efficient model selection strategy that automatically chooses the appropriate Claude model based on task complexity:

- **Low/Medium Complexity**: Uses Claude 3 Haiku (most cost-effective)
- **High Complexity**: Uses Claude 3 Sonnet (balanced performance/cost)
- **Critical Tasks**: Uses Claude 3 Opus (highest capability)

This approach optimizes for both cost and performance by using more powerful (and expensive) models only when necessary.

## Basic Usage

### Creating and Executing Tasks

```typescript
import { ClaudeTaskMaster } from '@/lib/claude/taskmaster';

// Initialize the TaskMaster
const taskMaster = new ClaudeTaskMaster();

// Create a task with complexity information
const task = await taskMaster.createTask({
  description: "Explain quantum computing in simple terms",
  complexity: "medium" // Will use Claude 3 Haiku by default
});

// Execute the task
const result = await taskMaster.executeTask(task.id);

// Check the result
if (result.success) {
  console.log(result.data); // Claude's response
  console.log(`Model used: ${result.model}`); // Model that was used
  console.log(`Tokens used: ${result.tokensUsed}`); // Estimated token usage
} else {
  console.error(result.error); // Error message
}
```

### Using the UI Component

```tsx
import { ClaudeTaskForm } from '@/components/ClaudeTaskForm';

function MyPage() {
  return (
    <div>
      <h1>Ask Claude</h1>
      <ClaudeTaskForm />
    </div>
  );
}
```

## Core Components

### ClaudeTaskMaster

The `ClaudeTaskMaster` class manages tasks for Claude AI interactions. It provides functionality to:

- Create tasks with unique IDs
- Execute tasks by sending prompts to Claude
- Track task status ('pending', 'in-progress', 'completed', 'failed', 'cancelled')
- Retrieve tasks by ID or get all tasks
- Reset failed tasks for retry
- Select appropriate Claude model based on task complexity
- Track token usage for cost monitoring
- Process tasks in batches with priority handling
- Implement rate limiting to prevent API throttling
- Track progress for long-running tasks

### ClaudeClient

The `ClaudeClient` class handles communication with the Anthropic Claude API. It:

- Manages authentication with the API
- Formats requests according to the API requirements
- Processes responses from the API
- Handles errors gracefully
- Estimates token usage for cost tracking

### API Endpoint

The `/api/claude/task` endpoint provides a RESTful interface for:

- Creating and executing tasks (POST)
- Retrieving tasks (GET)

### UI Component

The `ClaudeTaskForm` component provides a user-friendly interface for:

- Submitting prompts to Claude
- Selecting task complexity
- Optionally overriding the model selection
- Displaying responses with model and token usage information
- Handling loading states and errors
- Providing feedback via toast notifications

## Advanced Usage

### Model Selection Strategy

```typescript
// Create a task with specific complexity
const task = await taskMaster.createTask({
  description: "Analyze this research paper on quantum computing",
  complexity: "high" // Will use Claude 3 Sonnet
});

// Override the model selection
const task = await taskMaster.createTask({
  description: "What's the capital of France?",
  complexity: "low",
  model: "claude-3-opus-20240229" // Force using Opus
});
```

### Batch Processing

Execute multiple tasks efficiently with built-in rate limiting and priority handling:

```typescript
// Create multiple tasks
const task1 = await taskMaster.createTask({
  description: "Task 1",
  complexity: "low",
  priority: 1 // Highest priority
});

const task2 = await taskMaster.createTask({
  description: "Task 2",
  complexity: "medium",
  priority: 2
});

// Execute tasks in batch (respects priorities and rate limits)
const results = await taskMaster.executeTasks([task1.id, task2.id]);
```

### Task Management

```typescript
// Get a specific task
const task = taskMaster.getTask(taskId);

// Get all tasks
const allTasks = taskMaster.getAllTasks();

// Reset a failed task
const resetTask = taskMaster.resetTask(failedTaskId);

// Cancel a running task
const cancelled = await taskMaster.cancelTask(runningTaskId);
```

### Progress Tracking

```typescript
// Create a task with progress tracking
const task = await taskMaster.createTask({
  description: "Complex analysis task",
  complexity: "high",
  onProgress: (progress) => {
    console.log(`Task progress: ${progress * 100}%`);
    // Update UI with progress
  }
});
```

## Task Management Features

The Taskmaster implements several key features for effective task management:

1. **Unique Task IDs**: Each task has a unique identifier for tracking and retrieval
2. **Status Tracking**: Tasks progress through different statuses (pending → in-progress → completed/failed/cancelled)
3. **Metadata Support**: Tasks can include arbitrary metadata for additional context
4. **Error Handling**: Comprehensive error handling with specific error codes
5. **Timestamp Tracking**: Creation and completion times are recorded for each task
6. **Rate Limiting**: Prevents API throttling by controlling request frequency
7. **Batch Processing**: Efficiently processes multiple tasks with priority handling
8. **Progress Tracking**: Monitors and reports progress for long-running tasks

## Example Use Cases

### AI-Powered Content Generation

```typescript
const task = await taskMaster.createTask({
  description: "Write a blog post about artificial intelligence trends in 2024",
  complexity: "high",
  metadata: { type: "blog", category: "technology" }
});
```

### Question Answering System

```typescript
const task = await taskMaster.createTask({
  description: `Answer the following question: ${userQuestion}`,
  complexity: "medium",
  metadata: { source: "user-query", userId: user.id }
});
```

### Data Analysis

```typescript
const task = await taskMaster.createTask({
  description: `Analyze this dataset and provide insights: ${JSON.stringify(data)}`,
  complexity: "critical",
  priority: 1
});
```

### With Metadata and Model Override

```typescript
// Create a task with metadata and specific model
const task = await taskMaster.createTask({
  description: "Summarize this article",
  complexity: "high", // Would normally use Sonnet
  model: "claude-3-opus-20240229", // Override to use Opus
  metadata: { 
    priority: "high",
    category: "content",
    source: "user-request"
  }
});
```

## Best Practices

1. **Start with Low Complexity**
   - Default to low complexity for most tasks
   - Only increase complexity when necessary for better cost efficiency

2. **Use Batch Processing for Multiple Tasks**
   - Group similar tasks together
   - Assign appropriate priorities

3. **Implement Progress Tracking for Long-Running Tasks**
   - Provide feedback to users during execution
   - Handle UI updates based on progress

4. **Handle Errors Gracefully**
   - Check for specific error codes
   - Implement retry logic for transient failures

5. **Monitor Token Usage**
   - Track costs through the tokensUsed property
   - Optimize prompts to reduce token consumption

## Error Handling

The Taskmaster uses specific error codes to help with programmatic error handling:

- `TASK_NOT_FOUND`: The requested task doesn't exist
- `TASK_FAILED`: The task previously failed and needs to be reset
- `API_ERROR`: An error occurred in the Claude API
- `EXECUTION_ERROR`: An error occurred during task execution
- `VALIDATION_ERROR`: Input validation failed
- `TASK_RUNNING`: The task is already running
- `TASK_CANCELLED`: The task was cancelled

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure ANTHROPIC_API_KEY is set correctly
   - Check for API key expiration or usage limits

2. **Rate Limiting**
   - Adjust the rateLimit configuration if you're hitting API limits
   - Use batch processing to manage multiple requests efficiently

3. **Model Selection Issues**
   - Verify that the complexity levels are set correctly
   - Check the modelStrategy configuration

4. **Task Execution Failures**
   - Check the error code and message for specific issues
   - Use resetTask to retry failed tasks

### Debugging Tips

```typescript
// Enable detailed logging
console.log(JSON.stringify(task, null, 2));

// Check task status and error
const task = taskMaster.getTask(taskId);
console.log(`Status: ${task.status}, Error: ${task.error}`);

// Monitor token usage
const result = await taskMaster.executeTask(taskId);
console.log(`Tokens used: ${result.tokensUsed}`);
```

## Implementation Details

The Taskmaster is implemented with TypeScript and follows best practices for:

- Type safety
- Error handling
- Documentation
- Testing
- Rate limiting
- Batch processing
- Progress tracking

## Further Reading

- [Claude Model Selection Strategy](./model-selection-strategy.md)
- [Claude API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Anthropic's Claude Models Overview](https://www.anthropic.com/claude)
