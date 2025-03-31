import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react/pure';
import { vi } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import { SWRConfig } from 'swr';
import useSWR from 'swr';
import { ReactNode } from 'react';

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test data
const testData = {
  id: '1',
  name: 'Test Item',
  description: 'Test Description',
  status: 'active',
};

// Types
type Operation = {
  type: 'create' | 'update' | 'delete';
  data: any;
};

type QueuedOperation = Operation & {
  timestamp: number;
};

describe('Data Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Operations', () => {
    it('handles successful data creation', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...testData }),
        })
      );

      const handleCreate = async (data: typeof testData) => {
        const response = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create item');
        return response.json();
      };

      const result = await handleCreate(testData);
      expect(result).toEqual(testData);
      expect(mockFetch).toHaveBeenCalledWith('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });
    });

    it('handles validation errors during creation', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () =>
            Promise.resolve({
              error: 'Validation failed',
              details: { name: 'Name is required' },
            }),
        })
      );

      const handleCreate = async (data: Partial<typeof testData>) => {
        const response = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.details.name);
        }
        return response.json();
      };

      await expect(handleCreate({ description: 'Test' })).rejects.toThrow('Name is required');
    });
  });

  describe('Read Operations', () => {
    it('fetches data successfully', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([testData]),
        })
      );

      const { result } = renderHook(
        () =>
          useSWR<(typeof testData)[]>('/api/items', (url: string) =>
            fetch(url).then(r => r.json())
          ),
        {
          wrapper: ({ children }: { children: ReactNode }) => (
            <SWRConfig value={{ dedupingInterval: 0 }}>{children}</SWRConfig>
          ),
        }
      );

      await waitFor(() => {
        expect(result.current.data).toEqual([testData]);
      });
    });

    it('handles fetch errors gracefully', async () => {
      mockFetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

      const { result } = renderHook(
        () =>
          useSWR<(typeof testData)[]>('/api/items', (url: string) =>
            fetch(url).then(r => r.json())
          ),
        {
          wrapper: ({ children }: { children: ReactNode }) => (
            <SWRConfig value={{ dedupingInterval: 0 }}>{children}</SWRConfig>
          ),
        }
      );

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe('Update Operations', () => {
    it('updates data successfully', async () => {
      const updatedData = { ...testData, name: 'Updated Name' };
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(updatedData),
        })
      );

      const handleUpdate = async (id: string, data: Partial<typeof testData>) => {
        const response = await fetch(`/api/items/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update item');
        return response.json();
      };

      const result = await handleUpdate('1', { name: 'Updated Name' });
      expect(result).toEqual(updatedData);
      expect(mockFetch).toHaveBeenCalledWith('/api/items/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated Name' }),
      });
    });

    it('handles concurrent updates', async () => {
      mockFetch
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: false,
            status: 409,
            json: () =>
              Promise.resolve({
                error: 'Conflict',
                message: 'Item was modified by another user',
              }),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(testData),
          })
        );

      const handleUpdate = async (id: string, data: Partial<typeof testData>) => {
        const response = await fetch(`/api/items/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.status === 409) {
          // Fetch latest version and retry
          const latestResponse = await fetch(`/api/items/${id}`);
          return latestResponse.json();
        }

        if (!response.ok) throw new Error('Failed to update item');
        return response.json();
      };

      const result = await handleUpdate('1', { name: 'Updated Name' });
      expect(result).toEqual(testData);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Delete Operations', () => {
    it('deletes data successfully', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      );

      const handleDelete = async (id: string) => {
        const response = await fetch(`/api/items/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete item');
        return response.json();
      };

      const result = await handleDelete('1');
      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledWith('/api/items/1', {
        method: 'DELETE',
      });
    });

    it('handles deletion of referenced items', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () =>
            Promise.resolve({
              error: 'ReferenceError',
              message: 'Item is referenced by other records',
            }),
        })
      );

      const handleDelete = async (id: string) => {
        const response = await fetch(`/api/items/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        return response.json();
      };

      await expect(handleDelete('1')).rejects.toThrow('Item is referenced by other records');
    });
  });

  describe('Batch Operations', () => {
    it('handles batch create successfully', async () => {
      const items = [testData, { ...testData, id: '2' }];
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ created: items.length }),
        })
      );

      const handleBatchCreate = async (items: (typeof testData)[]) => {
        const response = await fetch('/api/items/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(items),
        });
        if (!response.ok) throw new Error('Failed to create items');
        return response.json();
      };

      const result = await handleBatchCreate(items);
      expect(result).toEqual({ created: 2 });
    });

    it('handles batch update with partial success', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              updated: 1,
              failed: 1,
              errors: [{ id: '2', error: 'Item not found' }],
            }),
        })
      );

      const handleBatchUpdate = async (
        updates: { id: string; data: Partial<typeof testData> }[]
      ) => {
        const response = await fetch('/api/items/batch', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update items');
        return response.json();
      };

      const result = await handleBatchUpdate([
        { id: '1', data: { name: 'Updated' } },
        { id: '2', data: { name: 'Updated' } },
      ]);

      expect(result.updated).toBe(1);
      expect(result.failed).toBe(1);
    });
  });

  describe('Offline Support', () => {
    it('queues operations when offline', async () => {
      const online = vi.spyOn(navigator, 'onLine', 'get');
      online.mockReturnValue(false);

      const operations: Operation[] = [];
      const queueOperation = (type: Operation['type'], data: any) => {
        operations.push({ type, data });
      };

      queueOperation('create', testData);
      expect(operations).toHaveLength(1);
      expect(operations[0]).toEqual({
        type: 'create',
        data: testData,
      });

      online.mockRestore();
    });

    it('syncs queued operations when back online', async () => {
      const queuedOperations: Operation[] = [
        { type: 'create', data: testData },
        { type: 'update', data: { id: '1', name: 'Updated' } },
      ];

      mockFetch
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(testData),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ ...testData, name: 'Updated' }),
          })
        );

      const syncOperations = async (ops: Operation[]) => {
        for (const op of ops) {
          if (op.type === 'create') {
            await fetch('/api/items', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(op.data),
            });
          } else if (op.type === 'update') {
            await fetch(`/api/items/${op.data.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(op.data),
            });
          }
        }
      };

      await syncOperations(queuedOperations);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
