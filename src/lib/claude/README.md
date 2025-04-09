# Claude Taskmaster

The Claude Taskmaster is a robust implementation for managing AI tasks using Anthropic's Claude API. It provides a structured way to create, execute, and track tasks that involve generating responses from Claude.

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

Create a `.env.local` file in your project root directory (same level as `package.json`) with:

```env
ANTHROPIC_API_KEY=your_api_key_here  # Get this from https://console.anthropic.com
```

You can also copy the example configuration from `.env.example` in your project root:

```bash
cp .env.example .env.local
```

Then update the `ANTHROPIC_API_KEY` value in your `.env.local` file.

For production deployments (e.g., Vercel), add `ANTHROPIC_API_KEY` to your environment variables in your deployment platform's settings.

### 3. Required Files Structure

```
src/
  ├── lib/
  │   └── claude/
  │       ├── client.ts      # Claude API client
  │       ├── taskmaster.ts  # Task management implementation
  │       └── types.ts       # TypeScript types
  ├── pages/
  │   └── api/
  │       └── claude/
  │           └── task.ts    # API endpoint
  └── components/
      └── ClaudeTaskForm.tsx # UI component
```

### 4. API Key Security

- Never commit your API key to version control
- Use environment variables for all sensitive data
- In production, use secure secret management
- For Vercel deployment, add `ANTHROPIC_API_KEY` to your project's Environment Variables

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
  apiKey: process.env.ANTHROPIC_API_KEY as string,
  defaultModel: 'claude-3-haiku-20240229', // optional
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

### Models and Their Characteristics

| Model               | Strengths                                   | Use Cases                                               | Relative Cost |
| ------------------- | ------------------------------------------- | ------------------------------------------------------- | ------------- |
| **Claude 3 Haiku**  | Fast, cost-effective, good for most tasks   | Simple questions, formatting, basic summaries           | $ (Lowest)    |
| **Claude 3 Sonnet** | More capable, balanced performance          | Complex analysis, creative tasks, detailed explanations | $$ (Medium)   |
| **Claude 3 Opus**   | Most powerful, highest reasoning capability | Critical tasks, deep expertise, complex reasoning       | $$$ (Highest) |

### Task Complexity Levels

1. **Low**: Simple tasks like basic questions or formatting

   - Example: "What's the capital of France?"
   - Default model: Claude 3 Haiku

2. **Medium**: Moderate complexity tasks like summaries or simple analysis

   - Example: "Summarize the key points of this article"
   - Default model: Claude 3 Haiku

3. **High**: Complex tasks requiring deeper analysis or specialized knowledge

   - Example: "Analyze the implications of this research paper"
   - Default model: Claude 3 Sonnet

4. **Critical**: Highest importance tasks requiring maximum capability
   - Example: "Debug this complex algorithm and suggest optimizations"
   - Default model: Claude 3 Opus

### Default Strategy Implementation

```typescript
// Default model selection strategy
this.modelStrategy = {
  low: 'claude-3-haiku-20240229', // Most cost-effective for simple tasks
  medium: 'claude-3-haiku-20240229', // Still use Haiku for medium complexity
  high: 'claude-3-sonnet-20240229', // Use Sonnet for complex tasks
  critical: 'claude-3-opus-20240229', // Use Opus only for critical tasks
};
```

This approach optimizes for both cost and performance by using more powerful (and expensive) models only when necessary.

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

### Usage Examples

1. Basic Task Creation

```tsx
import { TaskMaster } from '@/lib/claude/components/TaskMaster';

function MyPage() {
  return (
    <TaskMaster
      onTaskComplete={result => console.log('Task completed:', result)}
      initialPrompt="Help me write a prayer for Sunday service"
    />
  );
}
```

2. Custom Task Form with System Prompt

```tsx
import { TaskMaster } from '@/lib/claude/components/TaskMaster';

function SermonHelper() {
  const systemPrompt = `You are a helpful assistant for creating sermon outlines.
    Focus on biblical accuracy and clear structure.`;

  return (
    <TaskMaster
      systemPrompt={systemPrompt}
      initialPrompt="Create an outline for a sermon on John 3:16"
      showResponseInMarkdown={true}
    />
  );
}
```

3. Integration with Church Events

```tsx
import { TaskMaster } from '@/lib/claude/components/TaskMaster';

function EventPlanner() {
  const handleTaskComplete = async result => {
    await saveToDatabase(result);
    notifyTeam(result);
  };

  return (
    <TaskMaster
      onTaskComplete={handleTaskComplete}
      initialPrompt="Plan a youth ministry event for next month"
      autoSubmit={false} // Allow editing before submission
    />
  );
}
```

### Church-Specific Examples

// ... existing church examples ...

### Generic Usage Examples

1. Content Generation

```tsx
import { TaskMaster } from '@/lib/claude/components/TaskMaster';

function BlogPostGenerator() {
  const systemPrompt = `You are a professional content writer.
    Create engaging, SEO-optimized content with proper headings and structure.`;

  return (
    <TaskMaster
      systemPrompt={systemPrompt}
      initialPrompt="Write a blog post about sustainable living practices"
      showResponseInMarkdown={true}
      maxTokens={2000}
    />
  );
}
```

2. Code Review Assistant

```tsx
import { TaskMaster } from '@/lib/claude/components/TaskMaster';

function CodeReviewHelper() {
  const handleReview = async result => {
    await createGitHubComment(result);
    updateReviewStatus();
  };

  return (
    <TaskMaster
      systemPrompt="You are a senior developer reviewing code. Focus on best practices, security, and performance."
      onTaskComplete={handleReview}
      showCodeBlocks={true}
      model="claude-3-sonnet-20240229" // Using more capable model for code review
    />
  );
}
```

3. Data Analysis

```tsx
import { TaskMaster } from '@/lib/claude/components/TaskMaster';

function DataAnalyzer() {
  const [data, setData] = useState<string>('');

  return (
    <TaskMaster
      systemPrompt="You are a data analyst. Provide insights and visualizations using markdown tables and charts."
      initialPrompt={`Analyze this dataset and provide key insights:\n${data}`}
      showResponseInMarkdown={true}
      streamResponse={true}
      onProgress={partial => updateProgressBar(partial)}
    />
  );
}
```

4. Customer Support Helper

```tsx
import { TaskMaster } from '@/lib/claude/components/TaskMaster';

function SupportAssistant() {
  return (
    <TaskMaster
      systemPrompt="You are a helpful customer support agent. Be empathetic and solution-focused."
      initialPrompt="Draft a response to this customer inquiry about a refund"
      temperature={0.7} // Slightly more creative for human-like responses
      onTaskComplete={async result => {
        await updateTicket(result);
        sendEmailDraft(result);
      }}
    />
  );
}
```

5. Language Translation

```tsx
import { TaskMaster } from '@/lib/claude/components/TaskMaster';

function TranslationTool() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');

  return (
    <TaskMaster
      systemPrompt={`You are a professional translator. 
        Translate from ${sourceLang} to ${targetLang} maintaining context and nuance.`}
      initialPrompt="Translate this text while preserving formatting"
      preserveFormatting={true}
      onError={error => showTranslationError(error)}
    />
  );
}
```

### Troubleshooting

1. API Key Issues

   - Ensure `.env.local` is in the project root
   - Verify API key is valid at https://console.anthropic.com
   - Check for any whitespace in the API key
   - For production: verify environment variables in deployment platform

2. Response Formatting

   - If markdown isn't rendering: check `showResponseInMarkdown` prop
   - For code blocks: ensure proper language tags (e.g., ```typescript)
   - Long responses: use `maxTokens` prop to limit length

3. Common Errors

   ```typescript
   // Error: API key not found
   // Solution: Check .env.local file
   ANTHROPIC_API_KEY = your_api_key_here;

   // Error: Response timeout
   // Solution: Increase timeout in client config
   const client = new ClaudeClient({
     apiKey: process.env.ANTHROPIC_API_KEY,
     timeout: 60000, // 60 seconds
   });
   ```

4. Performance Tips
   - Use `autoSubmit={false}` for long prompts
   - Enable `streamResponse` for faster perceived performance
   - Implement error boundaries for graceful failure handling
