import { ClaudeClient } from './client';
import { ClaudeModel, Task, TaskComplexity, TaskMasterConfig, TaskResult, TaskStatus } from './types';

/**
 * Interface for creating a task with complexity information.
 */
export interface TaskCreationInfo {
  /** The prompt or description sent to Claude */
  description: string;
  /** Complexity level of the task */
  complexity?: TaskComplexity;
  /** Additional metadata associated with the task */
  metadata?: Record<string, any>;
  /** Override the model selection strategy for this specific task */
  model?: ClaudeModel;
}

/**
 * ClaudeTaskMaster manages tasks for Claude AI interactions.
 *
 * This class provides functionality to create, execute, and manage tasks
 * that involve generating responses from Claude AI. It maintains a record
 * of all tasks and their statuses, allowing for tracking and retrieval.
 */
export class ClaudeTaskMaster {
  private client: ClaudeClient;
  private tasks: Map<string, Task>;
  private defaultModel: ClaudeModel;
  private modelStrategy: Record<TaskComplexity, ClaudeModel>;

  /**
   * Creates a new ClaudeTaskMaster instance.
   *
   * @param config - Configuration for the TaskMaster including API key and model strategy
   */
  constructor(config: TaskMasterConfig) {
    // Set default model strategy based on cost efficiency
    this.defaultModel = config.defaultModel || 'claude-3-haiku-20240229';

    // Initialize model selection strategy with defaults
    this.modelStrategy = {
      low: 'claude-3-haiku-20240229',      // Most cost-effective for simple tasks
      medium: 'claude-3-haiku-20240229',   // Still use Haiku for medium complexity
      high: 'claude-3-sonnet-20240229',    // Use Sonnet for complex tasks
      critical: 'claude-3-opus-20240229',  // Use Opus only for critical tasks
      ...config.modelStrategy              // Override with any user-provided strategy
    };

    // Initialize client with default model
    this.client = new ClaudeClient(config.apiKey, this.defaultModel);
    this.tasks = new Map();
  }

  /**
   * Selects the appropriate Claude model based on task complexity.
   *
   * @param taskInfo - The task information including complexity
   * @returns The selected Claude model ID
   */
  private selectModel(taskInfo: TaskCreationInfo): ClaudeModel {
    // If a specific model is requested, use that
    if (taskInfo.model) {
      return taskInfo.model;
    }

    // Otherwise select based on complexity
    const complexity = taskInfo.complexity || 'low';
    return this.modelStrategy[complexity];
  }

  /**
   * Creates a new task with the given description and optional metadata.
   *
   * @param taskInfo - The task information including description, complexity, and metadata
   * @returns A new Task object with a unique ID and 'pending' status
   */
  async createTask(taskInfo: TaskCreationInfo): Promise<Task> {
    const { description, metadata, complexity } = taskInfo;
    if (!description || description.trim() === '') {
      throw new Error('Task description cannot be empty');
    }

    const model = this.selectModel(taskInfo);
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const task: Task = {
      id: taskId,
      description,
      status: 'pending',
      createdAt: new Date(),
      metadata,
      complexity,
      model
    };

    this.tasks.set(taskId, task);
    return task;
  }

  /**
   * Executes a task by sending its description to Claude and recording the result.
   *
   * @param taskId - The ID of the task to execute
   * @returns A TaskResult object containing the success status and either data or error
   */
  /**
   * Executes a task by sending its description to Claude and recording the result.
   * Uses the model specified in the task or falls back to the default model.
   *
   * @param taskId - The ID of the task to execute
   * @returns A TaskResult object containing the success status and either data or error
   */
  async executeTask(taskId: string): Promise<TaskResult> {
    const task = this.tasks.get(taskId);
    if (!task) {
      return { success: false, error: 'Task not found', code: 'TASK_NOT_FOUND' };
    }

    // Don't re-execute completed tasks
    if (task.status === 'completed') {
      return { success: true, data: task.result };
    }

    // Don't execute failed tasks without explicit reset
    if (task.status === 'failed') {
      return { success: false, error: task.error || 'Task previously failed', code: 'TASK_FAILED' };
    }

    try {
      this.updateTaskStatus(task, 'in-progress');

      // Create a client with the task's model if specified
      const modelToUse = task.model || this.defaultModel;
      const clientForTask = new ClaudeClient(this.client.getApiKey(), modelToUse);

      // Execute the task with the appropriate model
      const result = await clientForTask.generateResponse(task.description);

      if (result.success) {
        this.updateTaskStatus(task, 'completed');
        task.result = result.data;
        task.completedAt = new Date();

        // Store tokens used if available (for cost tracking)
        if (result.tokensUsed) {
          task.tokensUsed = result.tokensUsed;
        }

        return {
          success: true,
          data: result.data,
          model: modelToUse,
          tokensUsed: result.tokensUsed
        };
      } else {
        this.updateTaskStatus(task, 'failed');
        task.error = result.error;
        return {
          success: false,
          error: result.error,
          code: 'API_ERROR',
          model: modelToUse
        };
      }
    } catch (error) {
      this.updateTaskStatus(task, 'failed');
      task.error = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: task.error,
        code: 'EXECUTION_ERROR',
        model: task.model || this.defaultModel
      };
    }
  }

  /**
   * Retrieves a task by its ID.
   *
   * @param taskId - The ID of the task to retrieve
   * @returns The task object or undefined if not found
   */
  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Retrieves all tasks.
   *
   * @returns An array of all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Resets a failed task to pending status so it can be executed again.
   *
   * @param taskId - The ID of the task to reset
   * @returns The reset task or undefined if not found
   */
  resetTask(taskId: string): Task | undefined {
    const task = this.tasks.get(taskId);
    if (!task) return undefined;

    if (task.status === 'failed') {
      this.updateTaskStatus(task, 'pending');
      task.error = undefined;
      task.result = undefined;
    }

    return task;
  }

  /**
   * Updates a task's status and records the timestamp of the status change.
   *
   * @param task - The task to update
   * @param status - The new status
   * @private
   */
  private updateTaskStatus(task: Task, status: TaskStatus): void {
    task.status = status;
    task.statusUpdatedAt = new Date();
  }
}
