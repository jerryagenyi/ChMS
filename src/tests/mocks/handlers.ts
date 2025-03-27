import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/auth/session', () => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  }),

  http.post('/api/auth/signin', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/organizations', () => {
    return HttpResponse.json([
      { id: '1', name: 'Test Org', role: 'ADMIN' },
    ]);
  }),

  // Add more handlers as needed
];