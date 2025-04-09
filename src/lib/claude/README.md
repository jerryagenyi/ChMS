# Claude Taskmaster

The Claude Taskmaster is a robust implementation for managing AI tasks using Anthropic's Claude API. It provides a structured way to create, execute, and track tasks that involve generating responses from Claude.

## Model Selection Strategy

The Taskmaster implements a cost-efficient model selection strategy that automatically chooses the appropriate Claude model based on task complexity:

- **Low/Medium Complexity**: Uses Claude 3 Haiku (most cost-effective)
- **High Complexity**: Uses Claude 3 Sonnet (balanced performance/cost)
- **Critical Tasks**: Uses Claude 3 Opus (highest capability)

This approach optimizes for both cost and performance. See [model-selection-strategy.md](./model-selection-strategy.md) for details.

## Core Components

### ClaudeTaskMaster

The `ClaudeTaskMaster` class manages tasks for Claude AI interactions. It provides functionality to:

- Create tasks with unique IDs
- Execute tasks by sending prompts to Claude
- Track task status ('pending', 'in-progress', 'completed', 'failed')
- Retrieve tasks by ID or get all tasks
- Reset failed tasks for retry
- Select appropriate Claude model based on task complexity
- Track token usage for cost monitoring

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
- Displaying responses
- Handling loading states and errors
- Providing feedback via toast notifications

## Task Management Features

The Taskmaster implements several key features for effective task management:

1. **Unique Task IDs**: Each task has a unique identifier for tracking and retrieval
2. **Status Tracking**: Tasks progress through different statuses (pending → in-progress → completed/failed)
3. **Metadata Support**: Tasks can include arbitrary metadata for additional context
4. **Error Handling**: Comprehensive error handling with specific error codes
5. **Timestamp Tracking**: Creation and completion times are recorded for each task

## Usage

### Basic Usage with Complexity

```typescript
// Create a task with complexity information
const task = await taskMaster.createTask({
  description: 'Explain quantum computing in simple terms',
  complexity: 'medium', // Will use Claude 3 Haiku by default
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

### With Metadata and Model Override

```typescript
// Create a task with metadata and specific model
const task = await taskMaster.createTask({
  description: 'Summarize this article',
  complexity: 'high', // Would normally use Sonnet
  model: 'claude-3-opus-20240229', // Override to use Opus
  metadata: {
    priority: 'high',
    category: 'content',
    source: 'user-request',
  },
});
```

### Resetting Failed Tasks

```typescript
// Reset a failed task to try again
const resetTask = taskMaster.resetTask(failedTaskId);
if (resetTask) {
  const result = await taskMaster.executeTask(resetTask.id);
  // Process result...
}
```

## Error Handling

The Taskmaster uses specific error codes to help with programmatic error handling:

- `TASK_NOT_FOUND`: The requested task doesn't exist
- `TASK_FAILED`: The task previously failed and needs to be reset
- `API_ERROR`: An error occurred in the Claude API
- `EXECUTION_ERROR`: An error occurred during task execution
- `VALIDATION_ERROR`: Input validation failed

## Implementation Details

The Taskmaster is implemented with TypeScript and follows best practices for:

- Type safety
- Error handling
- Documentation
- Testing

## Future Enhancements

Potential enhancements for the Taskmaster include:

1. Task persistence (database storage)
2. Task queuing for rate limiting
3. Batch task processing
4. Advanced prompt templating
5. Response streaming
6. Task cancellation
