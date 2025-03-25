import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';

export const mockSession = {
  user: {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'MEMBER'
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString()
};

export const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <SessionProvider session={mockSession}>
      <ChakraProvider>{component}</ChakraProvider>
    </SessionProvider>
  );
};

export const mockPrismaResponse = {
  service: {
    id: '1',
    name: 'Sunday Service',
    startTime: new Date('2024-02-15T09:00:00Z'),
    endTime: new Date('2024-02-15T11:00:00Z'),
    status: 'ACTIVE',
    locationId: 'loc1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  checkIn: {
    id: '1',
    memberId: '1',
    serviceId: '1',
    type: 'INDIVIDUAL',
    timestamp: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
};