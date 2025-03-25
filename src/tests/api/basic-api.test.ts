import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

describe('Basic API Tests', () => {
  it('handles successful requests', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    // Mock your API handler here
    const handler = (req: NextApiRequest, res: NextApiResponse) => {
      res.status(200).json({ message: 'Success' });
    };

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });

  it('handles error cases', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {},
    });

    // Mock your API handler here
    const handler = (req: NextApiRequest, res: NextApiResponse) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({ error: 'Bad Request' });
        return;
      }
      res.status(200).json({ message: 'Success' });
    };

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });
});
