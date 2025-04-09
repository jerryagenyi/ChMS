import { ClaudeTaskMaster } from '@/lib/claude/taskmaster';
import { ClaudeClient } from '@/lib/claude/client';
import { Task } from '@/lib/claude/types';

// Mock the ClaudeClient
jest.mock('@/lib/claude/client', () => {
  return {
    ClaudeClient: jest.fn().mockImplementation(() => ({
      generateResponse: jest.fn().mockImplementation((prompt) => {
        if (prompt.includes('error')) {
          return Promise.resolve({
            success: false,
            error: 'Mock error response'
          });
        }
        return Promise.resolve({
          success: true,
          data: `Mock response for: ${prompt}`
        });
      })
    }))
  };
});

describe('ClaudeTaskMaster', () => {
  let taskMaster: ClaudeTaskMaster;
  
  beforeEach(() => {
    jest.clearAllMocks();
    taskMaster = new ClaudeTaskMaster({
      apiKey: 'test-api-key',
      model: 'claude-3-sonnet-20240229'
    });
  });
  
  describe('createTask', () => {
    it('creates a task with a unique ID', async () => {
      const task = await taskMaster.createTask('Test task');
      
      expect(task.id).toMatch(/^task_\d+_[a-z0-9]+$/);
      expect(task.description).toBe('Test task');
      expect(task.status).toBe('pending');
      expect(task.metadata).toBeUndefined();
    });
    
    it('creates a task with metadata', async () => {
      const metadata = { priority: 'high', category: 'test' };
      const task = await taskMaster.createTask('Test task with metadata', metadata);
      
      expect(task.description).toBe('Test task with metadata');
      expect(task.metadata).toEqual(metadata);
    });
  });
  
  describe('executeTask', () => {
    it('executes a task successfully', async () => {
      // Create a task first
      const task = await taskMaster.createTask('Test successful task');
      
      // Execute the task
      const result = await taskMaster.executeTask(task.id);
      
      // Verify the result
      expect(result.success).toBe(true);
      expect(result.data).toBe('Mock response for: Test successful task');
      
      // Verify the task was updated
      const updatedTask = taskMaster.getTask(task.id);
      expect(updatedTask?.status).toBe('completed');
      expect(updatedTask?.result).toBe('Mock response for: Test successful task');
    });
    
    it('handles task execution failure', async () => {
      // Create a task that will fail
      const task = await taskMaster.createTask('Test error task');
      
      // Mock the client to return an error
      const mockClient = require('@/lib/claude/client').ClaudeClient.mock.instances[0];
      mockClient.generateResponse.mockResolvedValueOnce({
        success: false,
        error: 'Mock error'
      });
      
      // Execute the task
      const result = await taskMaster.executeTask(task.id);
      
      // Verify the result
      expect(result.success).toBe(false);
      expect(result.error).toBe('Mock error');
      
      // Verify the task was updated
      const updatedTask = taskMaster.getTask(task.id);
      expect(updatedTask?.status).toBe('failed');
      expect(updatedTask?.error).toBe('Mock error');
    });
    
    it('returns error when task does not exist', async () => {
      const result = await taskMaster.executeTask('non-existent-task-id');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Task not found');
    });
  });
  
  describe('getTask', () => {
    it('returns a task by ID', async () => {
      const task = await taskMaster.createTask('Test get task');
      
      const retrievedTask = taskMaster.getTask(task.id);
      
      expect(retrievedTask).toEqual(task);
    });
    
    it('returns undefined for non-existent task', () => {
      const retrievedTask = taskMaster.getTask('non-existent-task-id');
      
      expect(retrievedTask).toBeUndefined();
    });
  });
  
  describe('getAllTasks', () => {
    it('returns all tasks', async () => {
      await taskMaster.createTask('Task 1');
      await taskMaster.createTask('Task 2');
      await taskMaster.createTask('Task 3');
      
      const allTasks = taskMaster.getAllTasks();
      
      expect(allTasks.length).toBe(3);
      expect(allTasks.map(task => task.description)).toEqual([
        'Task 1',
        'Task 2',
        'Task 3'
      ]);
    });
    
    it('returns empty array when no tasks exist', () => {
      const allTasks = taskMaster.getAllTasks();
      
      expect(allTasks).toEqual([]);
    });
  });
});
