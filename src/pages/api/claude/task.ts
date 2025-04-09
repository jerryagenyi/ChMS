import { NextApiRequest, NextApiResponse } from 'next';
import { ClaudeTaskMaster } from '@/lib/claude/taskmaster';
import { TaskResult } from '@/lib/claude/types';

/**
 * Validates that required environment variables are set.
 * This is called when the API route is first loaded.
 */
function validateEnvironment() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
  }
}

// Validate environment on module initialization
validateEnvironment();

// Initialize the TaskMaster with the API key
const taskMaster = new ClaudeTaskMaster({
  apiKey: process.env.ANTHROPIC_API_KEY as string,
  model: 'claude-3-sonnet-20240229'
});

/**
 * API handler for Claude task operations.
 *
 * Supports:
 * - POST: Create and execute a new task
 * - GET: Retrieve a specific task or all tasks
 */
/**
 * Handles POST requests to create and execute a new task.
 */
async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { description, metadata } = req.body;

  if (!description) {
    return res.status(400).json({
      error: 'Description is required',
      code: 'VALIDATION_ERROR'
    });
  }

  try {
    // Create a new task
    const task = await taskMaster.createTask(description, metadata);

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

/**
 * Handles GET requests to retrieve tasks.
 */
async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { taskId } = req.query;

  // If a specific task ID is provided, return that task
  if (taskId && typeof taskId === 'string') {
    const task = taskMaster.getTask(taskId);
    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
        code: 'TASK_NOT_FOUND'
      });
    }
    return res.status(200).json(task);
  }

  // Otherwise, return all tasks
  const tasks = taskMaster.getAllTasks();
  return res.status(200).json(tasks);
}

/**
 * Main API handler that routes requests to the appropriate handler function.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return handlePostRequest(req, res);
  } else if (req.method === 'GET') {
    return handleGetRequest(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  }
}
