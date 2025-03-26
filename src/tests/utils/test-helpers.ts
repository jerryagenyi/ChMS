import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';

export const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

export const mockServices = [
  { id: '1', name: 'Sunday Morning', startTime: '09:00', status: 'ACTIVE' },
  { id: '2', name: 'Sunday Evening', startTime: '18:00', status: 'ACTIVE' },
  { id: '3', name: 'Wednesday', startTime: '19:00', status: 'SCHEDULED' }
];

export const mockStats = {
  totalAttendees: 150,
  newVisitors: 12,
  departments: [
    { name: 'Main Service', count: 100 },
    { name: 'Children', count: 50 }
  ]
};
