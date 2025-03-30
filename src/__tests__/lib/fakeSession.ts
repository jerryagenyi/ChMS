export const fakeSession = {
  user: {
    id: '1',
    email: 'dev@example.com',
    name: 'Development User',
    organisationId: '1',
    role: 'ADMIN'
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}; 