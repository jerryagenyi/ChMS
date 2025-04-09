/**
 * Available Claude models.
 */
export type ClaudeModel = 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240229';

/**
 * Task complexity levels for model selection.
 */
export type TaskComplexity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Configuration options for the ClaudeTaskMaster.
 */
export interface TaskMasterConfig {
  /** Anthropic API key */
  apiKey: string;
  /** Default Claude model to use */
  defaultModel?: ClaudeModel;
  /** Maximum tokens to generate in the response */
  maxTokens?: number;
  /** Model selection strategy configuration */
  modelStrategy?: {
    low?: ClaudeModel;
    medium?: ClaudeModel;
    high?: ClaudeModel;
    critical?: ClaudeModel;
  };
  /** Rate limit configuration (requests per minute) */
  rateLimit?: number;
}

/**
 * Possible statuses for a task.
 */
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';

/**
 * Represents a task to be executed by Claude.
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** The prompt or description sent to Claude */
  description: string;
  /** Current status of the task */
  status: TaskStatus;
  /** Result returned from Claude (if successful) */
  result?: any;
  /** Error message (if failed) */
  error?: string;
  /** Additional metadata associated with the task */
  metadata?: Record<string, any>;
  /** When the task was created */
  createdAt?: Date;
  /** When the task was completed */
  completedAt?: Date;
  /** When the task status was last updated */
  statusUpdatedAt?: Date;
  /** Complexity level of the task */
  complexity?: TaskComplexity;
  /** Claude model used for this task */
  model?: ClaudeModel;
  /** Tokens used for this task (for cost tracking) */
  tokensUsed?: number;
  /** Priority level of the task (1-5, 1 being highest) */
  priority?: number;
  /** Progress of the task (0-1) */
  progress?: number;
  /** Progress callback for long-running tasks */
  onProgress?: (progress: number) => void;
}

/**
 * Error codes for task execution failures.
 */
export type TaskErrorCode =
  | 'TASK_NOT_FOUND'
  | 'TASK_FAILED'
  | 'API_ERROR'
  | 'EXECUTION_ERROR'
  | 'VALIDATION_ERROR'
  | 'TASK_RUNNING'
  | 'TASK_CANCELLED';

/**
 * Result of a task execution.
 */
export interface TaskResult<T = any> {
  /** Whether the task was successful */
  success: boolean;
  /** The data returned from the task (if successful) */
  data?: T;
  /** Error message (if unsuccessful) */
  error?: string;
  /** Error code for programmatic handling */
  code?: TaskErrorCode;
  /** The Claude model used for this task */
  model?: ClaudeModel;
  /** Estimated number of tokens used (for cost tracking) */
  tokensUsed?: number;
}
