import { vi } from 'vitest';

export const createMockRequest = (options = {}) => {
  return {
    json: () => Promise.resolve(options),
    headers: new Headers(),
    ...options,
  };
};

export const createMockResponse = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    headers: new Headers(),
  };
  return res;
};

export const createMockContext = (options = {}) => {
  return {
    params: {},
    req: createMockRequest(),
    res: createMockResponse(),
    ...options,
  };
};