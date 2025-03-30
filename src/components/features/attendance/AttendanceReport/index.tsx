import { useEffect, useState } from 'react';
import {
  Box,
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
  HStack,
  Select,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
} from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';
import { DownloadIcon } from '@chakra-ui/icons';

interface MemberStats {
  member: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  stats: {
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    attendancePercentage: number;
  };
  attendance: Array<{
    id: string;
    date: string;
    status: string;
    notes?: string;
  }>;
}

interface AttendanceReport {
  class: {
    id: string;
    name: string;
    description: string;
  } | null;
  month: string;
  members: MemberStats[];
  overallStats: {
    totalDays: number;
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    averageAttendance: number;
  };
}

interface AttendanceReportProps {
  classId?: string;
}

export function AttendanceReport({ classId }: AttendanceReportProps) {
  const [report, setReport] = useState<AttendanceReport | null>(null);
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMember, setSelectedMember] = useState<MemberStats | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchReport();
  }, [classId, month]);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        month,
        ...(classId && { classId }),
      });

      const response = await fetch(`/api/attendance/reports?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance report');
      }

      const { data } = await response.json();
      setReport(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch attendance report',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!report) return;

    const csv = [
      ['Member', 'Present', 'Absent', 'Late', 'Attendance Rate'],
      ...report.members.map(member => [
        `${member.member.firstName} ${member.member.lastName}`,
        member.stats.present,
        member.stats.absent,
        member.stats.late,
        `${member.stats.attendancePercentage.toFixed(1)}%`,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-report-${month}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <Text>Loading report...</Text>;
  }

  if (!report) {
    return <Text>No report available</Text>;
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Heading size="md">
          {report.class ? `${report.class.name} - ` : ''}Attendance Report
        </Heading>
        <HStack spacing={4}>
          <Select
            width="200px"
            value={month}
            onChange={e => setMonth(e.target.value)}
            aria-label="Select month"
            title="Select month"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - i);
              return format(date, 'yyyy-MM');
            }).map(month => (
              <option key={month} value={month}>
                {format(parseISO(month), 'MMMM yyyy')}
              </option>
            ))}
          </Select>
          <Button leftIcon={<DownloadIcon />} onClick={handleExport} colorScheme="blue">
            Export CSV
          </Button>
        </HStack>
      </Box>

      <Card>
        <CardBody>
          <Heading size="sm" mb={4}>
            Overall Statistics
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            <Box>
              <Text fontWeight="bold">Total Days</Text>
              <Text>{report.overallStats.totalDays}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Present</Text>
              <Text>{report.overallStats.totalPresent}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Absent</Text>
              <Text>{report.overallStats.totalAbsent}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Average Attendance</Text>
              <Text>{report.overallStats.averageAttendance.toFixed(1)}%</Text>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Heading size="sm" mb={4}>
            Member Attendance
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Member</Th>
                <Th isNumeric>Present</Th>
                <Th isNumeric>Absent</Th>
                <Th isNumeric>Late</Th>
                <Th isNumeric>Attendance Rate</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {report.members.map(member => (
                <Tr key={member.member.id}>
                  <Td>
                    {member.member.firstName} {member.member.lastName}
                  </Td>
                  <Td isNumeric>{member.stats.present}</Td>
                  <Td isNumeric>{member.stats.absent}</Td>
                  <Td isNumeric>{member.stats.late}</Td>
                  <Td isNumeric>
                    <Badge
                      colorScheme={
                        member.stats.attendancePercentage > 80
                          ? 'green'
                          : member.stats.attendancePercentage > 60
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {member.stats.attendancePercentage.toFixed(1)}%
                    </Badge>
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedMember(member);
                        onOpen();
                      }}
                    >
                      View Details
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Attendance Details - {selectedMember?.member.firstName}{' '}
            {selectedMember?.member.lastName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th>Notes</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedMember?.attendance.map(record => (
                    <Tr key={record.id}>
                      <Td>{format(parseISO(record.date), 'PPP')}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            record.status === 'PRESENT'
                              ? 'green'
                              : record.status === 'LATE'
                              ? 'yellow'
                              : 'red'
                          }
                        >
                          {record.status}
                        </Badge>
                      </Td>
                      <Td>{record.notes || '-'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
