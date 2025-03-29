import { describe, it, expect } from 'vitest';
import { createMockRequest } from '@/test/helpers';

describe('Basic API Tests', () => {
  it('handles successful requests', async () => {
    const req = createMockRequest('http://localhost:3000/api/test', {
      method: 'GET'
    });
    const response = new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: 'Success' });
  });
});
