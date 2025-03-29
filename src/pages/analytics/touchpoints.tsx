import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

interface TouchpointAnalytics {
  totalVisitors: number;
  touchpointStats: {
    type: string;
    count: number;
    percentage: number;
  }[];
  sourceStats: {
    source: string;
    count: number;
    percentage: number;
  }[];
  monthlyStats: {
    month: string;
    visitors: number;
    touchpoints: {
      type: string;
      count: number;
    }[];
  }[];
}

export default function TouchpointAnalytics() {
  const { data: session } = useSession();
  const { data: analytics, error } = useSWR<TouchpointAnalytics>(
    session ? '/api/analytics/touchpoints' : null
  );

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (error) return <div>Failed to load analytics</div>;
  if (!analytics) return <div>Loading...</div>;

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={8}>Touchpoint Analytics</Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat bg={bgColor} p={4} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
          <StatLabel>Total Visitors</StatLabel>
          <StatNumber>{analytics.totalVisitors}</StatNumber>
          <StatHelpText>All time</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box mb={8}>
        <Heading size="md" mb={4}>
          Touchpoint Distribution
        </Heading>
        <Box h={400}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.touchpointStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3182CE" name="Visitors" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box mb={8}>
        <Heading size="md" mb={4}>
          Source Distribution
        </Heading>
        <Box h={400}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.sourceStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#38A169" name="Visitors" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Monthly Trends
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Month</Th>
              <Th>Total Visitors</Th>
              {analytics.touchpointStats.map(stat => (
                <Th key={stat.type}>{stat.type}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {analytics.monthlyStats.map(month => (
              <Tr key={month.month}>
                <Td>{month.month}</Td>
                <Td>{month.visitors}</Td>
                {month.touchpoints.map(touchpoint => (
                  <Td key={touchpoint.type}>{touchpoint.count}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
}
