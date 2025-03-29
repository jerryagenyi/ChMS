import { useState } from 'react';
import {
  Container,
  Heading,
  Box,
  Text,
  VStack,
  HStack,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

interface EventReport {
  id: string;
  name: string;
  totalRegistrations: number;
  totalCheckIns: number;
  attendanceRate: number;
  date: string;
}

export default function EventReportsPage() {
  const [timeRange, setTimeRange] = useState('30days');
  const toast = useToast();
  const [reports, setReports] = useState<EventReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/reports?timeRange=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch reports',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/events/reports/export?timeRange=${timeRange}`);
      if (!response.ok) throw new Error('Failed to export reports');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `event-reports-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to export reports',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={4}>
            Event Reports
          </Heading>
          <Text color="gray.600">Analytics and insights for your events</Text>
        </Box>

        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          <GridItem>
            <Stat>
              <StatLabel>Total Events</StatLabel>
              <StatNumber>{reports.length}</StatNumber>
              <StatHelpText>Last {timeRange} days</StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Total Registrations</StatLabel>
              <StatNumber>
                {reports.reduce((sum, report) => sum + report.totalRegistrations, 0)}
              </StatNumber>
              <StatHelpText>Last {timeRange} days</StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Total Check-ins</StatLabel>
              <StatNumber>
                {reports.reduce((sum, report) => sum + report.totalCheckIns, 0)}
              </StatNumber>
              <StatHelpText>Last {timeRange} days</StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Average Attendance Rate</StatLabel>
              <StatNumber>
                {reports.length > 0
                  ? `${Math.round(
                      reports.reduce((sum, report) => sum + report.attendanceRate, 0) /
                        reports.length
                    )}%`
                  : '0%'}
              </StatNumber>
              <StatHelpText>Last {timeRange} days</StatHelpText>
            </Stat>
          </GridItem>
        </Grid>

        <HStack spacing={4}>
          <Select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            width="200px"
            aria-label="Time range"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </Select>
          <Button leftIcon={<DownloadIcon />} colorScheme="blue" onClick={handleExport}>
            Export CSV
          </Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Event Name</Th>
                <Th>Date</Th>
                <Th isNumeric>Registrations</Th>
                <Th isNumeric>Check-ins</Th>
                <Th isNumeric>Attendance Rate</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reports.map(report => (
                <Tr key={report.id}>
                  <Td>{report.name}</Td>
                  <Td>{new Date(report.date).toLocaleDateString()}</Td>
                  <Td isNumeric>{report.totalRegistrations}</Td>
                  <Td isNumeric>{report.totalCheckIns}</Td>
                  <Td isNumeric>
                    <Badge
                      colorScheme={
                        report.attendanceRate >= 80
                          ? 'green'
                          : report.attendanceRate >= 60
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {report.attendanceRate}%
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
}
