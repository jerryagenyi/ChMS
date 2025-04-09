import { ClaudeClient } from './client';
import { Task, TaskMasterConfig, TaskResult, TaskStatus } from './types';

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

  /**
   * Creates a new ClaudeTaskMaster instance.
   *
   * @param config - Configuration for the TaskMaster including API key and model
   */
  constructor(config: TaskMasterConfig) {
    this.client = new ClaudeClient(config.apiKey, config.model);
    this.tasks = new Map();
  }

  /**
   * Creates a new task with the given description and optional metadata.
   *
   * @param description - The description or prompt for Claude
   * @param metadata - Optional metadata to associate with the task
   * @returns A new Task object with a unique ID and 'pending' status
   */
  async createTask(description: string, metadata?: Record<string, any>): Promise<Task> {
    if (!description || description.trim() === '') {
      throw new Error('Task description cannot be empty');
    }

    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const task: Task = {
      id: taskId,
      description,
      status: 'pending',
      createdAt: new Date(),
      metadata
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
      const result = await this.client.generateResponse(task.description);

      if (result.success) {
        this.updateTaskStatus(task, 'completed');
        task.result = result.data;
        task.completedAt = new Date();
        return { success: true, data: result.data };
      } else {
        this.updateTaskStatus(task, 'failed');
        task.error = result.error;
        return { success: false, error: result.error, code: 'API_ERROR' };
      }
    } catch (error) {
      this.updateTaskStatus(task, 'failed');
      task.error = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: task.error, code: 'EXECUTION_ERROR' };
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
