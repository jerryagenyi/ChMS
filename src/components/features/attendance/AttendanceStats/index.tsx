'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Select,
  VStack,
  Heading,
  useToast,
  Card,
  CardBody,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AttendanceStats {
  totalAttendance: number;
  attendanceByStatus: Array<{
    status: string;
    _count: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    total: number;
    present: number;
    absent: number;
    late: number;
  }>;
  topMembers: Array<{
    memberId: string;
    _count: number;
    member: {
      firstName: string;
      lastName: string;
    };
  }>;
  dateRange: {
    start: string;
    end: string;
  };
}

interface AttendanceStatsProps {
  classId?: string;
}

export function AttendanceStats({ classId }: AttendanceStatsProps) {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [months, setMonths] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchStats();
  }, [classId, months]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        months: months.toString(),
        ...(classId && { classId }),
      });

      const response = await fetch(`/api/attendance/stats?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance stats');
      }

      const { data } = await response.json();
      setStats(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch attendance statistics',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Text>Loading statistics...</Text>;
  }

  if (!stats) {
    return <Text>No statistics available</Text>;
  }

  const presentCount = stats.attendanceByStatus.find(s => s.status === 'PRESENT')?._count || 0;
  const absentCount = stats.attendanceByStatus.find(s => s.status === 'ABSENT')?._count || 0;
  const lateCount = stats.attendanceByStatus.find(s => s.status === 'LATE')?._count || 0;

  const attendanceRate = stats.totalAttendance ? (presentCount / stats.totalAttendance) * 100 : 0;

  const chartData = {
    labels: stats.monthlyTrends.map(trend => format(new Date(trend.month), 'MMM yyyy')),
    datasets: [
      {
        label: 'Present',
        data: stats.monthlyTrends.map(trend => trend.present),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Absent',
        data: stats.monthlyTrends.map(trend => trend.absent),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Late',
        data: stats.monthlyTrends.map(trend => trend.late),
        borderColor: 'rgb(255, 205, 86)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Attendance Trends',
      },
    },
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Heading size="md">Attendance Statistics</Heading>
        <Select
          width="200px"
          value={months}
          onChange={e => setMonths(Number(e.target.value))}
          aria-label="Select time period"
        >
          <option value={1}>Last Month</option>
          <option value={3}>Last 3 Months</option>
          <option value={6}>Last 6 Months</option>
          <option value={12}>Last 12 Months</option>
        </Select>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <Stat>
          <StatLabel>Total Attendance</StatLabel>
          <StatNumber>{stats.totalAttendance}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {attendanceRate.toFixed(1)}% attendance rate
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Present</StatLabel>
          <StatNumber>{presentCount}</StatNumber>
          <StatHelpText>
            {((presentCount / stats.totalAttendance) * 100).toFixed(1)}% of total
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Absent</StatLabel>
          <StatNumber>{absentCount}</StatNumber>
          <StatHelpText>
            {((absentCount / stats.totalAttendance) * 100).toFixed(1)}% of total
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Late</StatLabel>
          <StatNumber>{lateCount}</StatNumber>
          <StatHelpText>
            {((lateCount / stats.totalAttendance) * 100).toFixed(1)}% of total
          </StatHelpText>
        </Stat>
      </SimpleGrid>

      <Card>
        <CardBody>
          <Line data={chartData} options={chartOptions} />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Heading size="sm" mb={4}>
            Top Members by Attendance
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Member</Th>
                <Th isNumeric>Present Days</Th>
                <Th>Attendance Rate</Th>
              </Tr>
            </Thead>
            <Tbody>
              {stats.topMembers.map(member => (
                <Tr key={member.memberId}>
                  <Td>
                    {member.member.firstName} {member.member.lastName}
                  </Td>
                  <Td isNumeric>{member._count}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        (member._count / stats.totalAttendance) * 100 > 80
                          ? 'green'
                          : (member._count / stats.totalAttendance) * 100 > 60
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {((member._count / stats.totalAttendance) * 100).toFixed(1)}%
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </VStack>
  );
}
