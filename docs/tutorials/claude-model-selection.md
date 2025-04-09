# Claude Model Selection Strategy Tutorial

This tutorial explains how to use the Claude model selection strategy in your application to optimize for both cost and performance.

## Introduction

Claude offers three main models with different capabilities and cost profiles:

- **Claude 3 Haiku**: Fastest and most cost-effective
- **Claude 3 Sonnet**: More capable with balanced performance/cost
- **Claude 3 Opus**: Most powerful but highest cost

Our implementation uses a smart model selection strategy that automatically chooses the appropriate model based on task complexity, optimizing for both cost and performance.

## Basic Principles

The strategy follows these principles:

1. **Start with Haiku**: Use the most cost-effective model (Haiku) for most tasks
2. **Upgrade when needed**: Use more powerful models only when the task complexity requires it
3. **Allow overrides**: Let users manually select a specific model when needed

## Using the Model Selection in Your Code

### Creating Tasks with Complexity

When creating a task, specify its complexity to trigger the appropriate model selection:

```typescript
import { ClaudeTaskMaster } from '@/lib/claude/taskmaster';
import { TaskComplexity } from '@/lib/claude/types';

// Initialize the TaskMaster
const taskMaster = new ClaudeTaskMaster({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Create a task with low complexity (will use Haiku)
const simpleTask = await taskMaster.createTask({
  description: "What's the capital of France?",
  complexity: "low"
});

// Create a task with high complexity (will use Sonnet)
const complexTask = await taskMaster.createTask({
  description: "Analyze the implications of this research paper on quantum computing",
  complexity: "high"
});

// Create a critical task (will use Opus)
const criticalTask = await taskMaster.createTask({
  description: "Debug this complex algorithm and suggest optimizations",
  complexity: "critical"
});
```

### Overriding the Model Selection

You can override the automatic model selection by explicitly specifying a model:

```typescript
// Override to use Opus for a task that would normally use Haiku
const task = await taskMaster.createTask({
  description: "What's the capital of France?",
  complexity: "low",
  model: "claude-3-opus-20240229" // Override to use Opus
});
```

### Tracking Model Usage and Costs

The task execution result includes information about which model was used and estimated token usage:

```typescript
const result = await taskMaster.executeTask(task.id);

if (result.success) {
  console.log(`Response: ${result.data}`);
  console.log(`Model used: ${result.model}`);
  console.log(`Estimated tokens: ${result.tokensUsed}`);
}
```

## Using the UI Component

The `ClaudeTaskForm` component allows users to:

1. Enter their prompt or question
2. Select the task complexity
3. Optionally override the model selection

The component automatically displays which model was used and the estimated token usage after receiving a response.

## Customizing the Model Selection Strategy

You can customize the model selection strategy when initializing the `ClaudeTaskMaster`:

```typescript
const taskMaster = new ClaudeTaskMaster({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: "claude-3-haiku-20240229",
  modelStrategy: {
    // Custom strategy - use Sonnet for medium complexity and above
    low: "claude-3-haiku-20240229",
    medium: "claude-3-sonnet-20240229",
    high: "claude-3-sonnet-20240229",
    critical: "claude-3-opus-20240229"
  }
});
```

## Best Practices

1. **Default to Low Complexity**: Start with low complexity for most tasks and increase only when needed
2. **Monitor Token Usage**: Keep track of token usage to understand costs
3. **Use Opus Sparingly**: Reserve the most powerful model for truly critical tasks
4. **Test Different Models**: Experiment with different models to find the optimal balance for your specific use cases

## Cost Optimization Tips

1. **Batch Similar Tasks**: Group similar tasks together to avoid switching models
2. **Pre-process Inputs**: Simplify and focus inputs to reduce token usage
3. **Use System Prompts**: Well-crafted system prompts can improve results with less powerful models
4. **Cache Common Responses**: Store responses for frequently asked questions

## Conclusion

The Claude model selection strategy provides an optimal balance between cost and performance by using the most appropriate model for each task based on its complexity. By defaulting to the most cost-effective model (Haiku) and only using more powerful models when necessary, you can achieve significant cost savings while still delivering high-quality results.
