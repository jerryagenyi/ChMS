import { act } from '@testing-library/react';

export const measurePerformance = async (fn: () => void): Promise<{ duration: number }> => {
  const start = performance.now();
  await act(async () => {
    await fn();
  });
  const duration = performance.now() - start;
  return { duration };
};

export const createMockAttendance = (override = {}) => ({
  id: 'test-id',
  memberId: 'member-id',
  serviceId: 'service-id',
  timestamp: new Date(),
  status: 'PRESENT',
  ...override,
});

export const setupIndexedDB = async () => {
  // IndexedDB mock setup for offline tests
  const indexedDB = {
    databases: [] as any[],
    open: jest.fn(),
  };
  global.indexedDB = indexedDB as any;
};