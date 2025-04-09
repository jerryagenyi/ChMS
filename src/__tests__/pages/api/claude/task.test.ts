import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/claude/task';
import { ClaudeTaskMaster } from '@/lib/claude/taskmaster';

// Mock the ClaudeTaskMaster class
jest.mock('@/lib/claude/taskmaster', () => {
  return {
    ClaudeTaskMaster: jest.fn().mockImplementation(() => ({
      createTask: jest.fn().mockImplementation((description, metadata) => {
        return Promise.resolve({
          id: 'mock-task-id',
          description,
          status: 'pending',
          metadata
        });
      }),
      executeTask: jest.fn().mockImplementation((taskId) => {
        if (taskId === 'error-task-id') {
          return Promise.resolve({
            success: false,
            error: 'Task execution failed'
          });
        }
        return Promise.resolve({
          success: true,
          data: 'Mock task execution result'
        });
      }),
      getTask: jest.fn().mockImplementation((taskId) => {
        if (taskId === 'non-existent-task-id') {
          return undefined;
        }
        return {
          id: taskId,
          description: 'Mock task',
          status: 'completed',
          result: 'Mock result'
        };
      }),
      getAllTasks: jest.fn().mockReturnValue([
        { id: 'task-1', description: 'Task 1', status: 'completed' },
        { id: 'task-2', description: 'Task 2', status: 'pending' }
      ])
    }))
  };
});

// Mock environment variable
process.env.ANTHROPIC_API_KEY = 'mock-api-key';

// Create mock request and response objects
const createMockReq = (method: string, body?: any, query?: any): Partial<NextApiRequest> => ({
  method,
  body,
  query
});

const createMockRes = (): {
  res: Partial<NextApiResponse>;
  statusCode: { value: number };
  json: jest.Mock;
} => {
  const statusCode = { value: 200 };
  const json = jest.fn();
  
  const res = {
    status: jest.fn().mockImplementation((code) => {
      statusCode.value = code;
      return { json };
    }),
    json
  };
  
  return { res, statusCode, json };
};

describe('Claude Task API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('POST /api/claude/task', () => {
    it('creates and executes a task successfully', async () => {
      const req = createMockReq('POST', { description: 'Test task' });
      const { res, statusCode, json } = createMockRes();
      
      await handler(req as NextApiRequest, res as NextApiResponse);
      
      expect(statusCode.value).toBe(200);
      expect(json).toHaveBeenCalledWith({
        success: true,
        data: 'Mock task execution result'
      });
      
      // Verify the task was created and executed
      const taskMaster = (ClaudeTaskMaster as jest.Mock).mock.instances[0];
      expect(taskMaster.createTask).toHaveBeenCalledWith('Test task');
      expect(taskMaster.executeTask).toHaveBeenCalledWith('mock-task-id');
    });
    
    it('returns 400 when description is missing', async () => {
      const req = createMockReq('POST', {});
      const { res, statusCode, json } = createMockRes();
      
      await handler(req as NextApiRequest, res as NextApiResponse);
      
      expect(statusCode.value).toBe(400);
      expect(json).toHaveBeenCalledWith({ error: 'Description is required' });
    });
    
    it('handles task execution errors', async () => {
      // Mock the createTask to return a task with an ID that will cause executeTask to fail
      const taskMaster = (ClaudeTaskMaster as jest.Mock).mock.instances[0];
      taskMaster.createTask.mockResolvedValueOnce({
        id: 'error-task-id',
        description: 'Error task',
        status: 'pending'
      });
      
      const req = createMockReq('POST', { description: 'Error task' });
      const { res, statusCode, json } = createMockRes();
      
      await handler(req as NextApiRequest, res as NextApiResponse);
      
      expect(statusCode.value).toBe(200);
      expect(json).toHaveBeenCalledWith({
        success: false,
        error: 'Task execution failed'
      });
    });
  });
  
  describe('GET /api/claude/task', () => {
    it('returns all tasks when no taskId is provided', async () => {
      const req = createMockReq('GET');
      const { res, statusCode, json } = createMockRes();
      
      await handler(req as NextApiRequest, res as NextApiResponse);
      
      expect(statusCode.value).toBe(200);
      expect(json).toHaveBeenCalledWith([
        { id: 'task-1', description: 'Task 1', status: 'completed' },
        { id: 'task-2', description: 'Task 2', status: 'pending' }
      ]);
      
      // Verify getAllTasks was called
      const taskMaster = (ClaudeTaskMaster as jest.Mock).mock.instances[0];
      expect(taskMaster.getAllTasks).toHaveBeenCalled();
    });
    
    it('returns a specific task when taskId is provided', async () => {
      const req = createMockReq('GET', undefined, { taskId: 'task-123' });
      const { res, statusCode, json } = createMockRes();
      
      await handler(req as NextApiRequest, res as NextApiResponse);
      
      expect(statusCode.value).toBe(200);
      expect(json).toHaveBeenCalledWith({
        id: 'task-123',
        description: 'Mock task',
        status: 'completed',
        result: 'Mock result'
      });
      
      // Verify getTask was called with the correct ID
      const taskMaster = (ClaudeTaskMaster as jest.Mock).mock.instances[0];
      expect(taskMaster.getTask).toHaveBeenCalledWith('task-123');
    });
    
    it('returns 404 when task is not found', async () => {
      const req = createMockReq('GET', undefined, { taskId: 'non-existent-task-id' });
      const { res, statusCode, json } = createMockRes();
      
      await handler(req as NextApiRequest, res as NextApiResponse);
      
      expect(statusCode.value).toBe(404);
      expect(json).toHaveBeenCalledWith({ error: 'Task not found' });
    });
  });
  
  describe('Method not allowed', () => {
    it('returns 405 for unsupported methods', async () => {
      const req = createMockReq('PUT');
      const { res, statusCode, json } = createMockRes();
      
      await handler(req as NextApiRequest, res as NextApiResponse);
      
      expect(statusCode.value).toBe(405);
      expect(json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    });
  });
});
