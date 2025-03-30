import React from 'react';
import { Box, Grid, Heading, Text, Select, Flex, useColorModeValue } from '@chakra-ui/react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, description }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const changeColor = change && change > 0 ? 'green.500' : 'red.500';

  return (
    <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="sm">
      <Text fontSize="sm" color={textColor} mb={2}>
        {title}
      </Text>
      <Heading size="lg" mb={2}>
        {value}
      </Heading>
      {change && (
        <Text fontSize="sm" color={changeColor}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </Text>
      )}
      {description && (
        <Text fontSize="sm" color={textColor} mt={2}>
          {description}
        </Text>
      )}
    </Box>
  );
};

interface AnalyticsDashboardProps {
  organizationId: string;
  timeRange?: 'day' | 'week' | 'month' | 'year';
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  organizationId,
  timeRange = 'month',
}) => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', organizationId, timeRange],
    queryFn: async () => {
      const response = await fetch(
        `/api/analytics?organizationId=${organizationId}&timeRange=${timeRange}`
      );
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
  });

  if (isLoading) {
    return <Box>Loading analytics...</Box>;
  }

  const attendanceData = {
    labels:
      analytics?.attendance?.dates?.map((date: string) => format(new Date(date), 'MMM d')) || [],
    datasets: [
      {
        label: 'Service Attendance',
        data: analytics?.attendance?.counts || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const visitorData = {
    labels: ['New', 'Returning', 'Converted'],
    datasets: [
      {
        label: 'Visitor Statistics',
        data: [
          analytics?.visitors?.new || 0,
          analytics?.visitors?.returning || 0,
          analytics?.visitors?.converted || 0,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
      },
    ],
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Analytics Dashboard</Heading>
        <Select
          w="200px"
          value={timeRange}
          onChange={e => {
            // Handle time range change
          }}
          aria-label="Select time range"
        >
          <option value="day">Last 24 Hours</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last 12 Months</option>
        </Select>
      </Flex>

      <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
        <MetricCard
          title="Total Attendance"
          value={analytics?.totals?.attendance || 0}
          change={analytics?.changes?.attendance}
          description="Total service attendance this period"
        />
        <MetricCard
          title="New Visitors"
          value={analytics?.totals?.newVisitors || 0}
          change={analytics?.changes?.newVisitors}
          description="First-time visitors this period"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${analytics?.totals?.conversionRate || 0}%`}
          change={analytics?.changes?.conversionRate}
          description="Visitor to member conversion"
        />
        <MetricCard
          title="Member Engagement"
          value={`${analytics?.totals?.engagement || 0}%`}
          change={analytics?.changes?.engagement}
          description="Active member participation"
        />
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Box p={6} bg={useColorModeValue('white', 'gray.700')} borderRadius="lg" boxShadow="sm">
          <Heading size="md" mb={4}>
            Attendance Trends
          </Heading>
          <Box h="300px">
            <Line
              data={attendanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </Box>
        </Box>

        <Box p={6} bg={useColorModeValue('white', 'gray.700')} borderRadius="lg" boxShadow="sm">
          <Heading size="md" mb={4}>
            Visitor Statistics
          </Heading>
          <Box h="300px">
            <Bar
              data={visitorData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};
