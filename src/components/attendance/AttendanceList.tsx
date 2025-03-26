import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  useToast,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Attendance {
  id: string;
  memberId: string;
  member: {
    firstName: string;
    lastName: string;
  };
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

interface AttendanceListProps {
  classId: string;
}

export function AttendanceList({ classId }: AttendanceListProps) {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(`/api/attendance?classId=${classId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch attendance records');
        }
        const data = await response.json();
        setAttendance(data.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        toast({
          title: 'Error',
          description: 'Failed to fetch attendance records',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [classId, toast]);

  const getStatusColor = (status: Attendance['status']) => {
    switch (status) {
      case 'present':
        return 'green';
      case 'absent':
        return 'red';
      case 'late':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="xl" />
        <Text>Loading attendance records...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="red.50" borderRadius="md">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (attendance.length === 0) {
    return (
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text color="gray.500">No attendance records found</Text>
      </Box>
    );
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Member</Th>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th>Notes</Th>
          </Tr>
        </Thead>
        <Tbody>
          {attendance.map(record => (
            <Tr key={record.id}>
              <Td>
                {record.member.firstName} {record.member.lastName}
              </Td>
              <Td>{format(new Date(record.date), 'PPp')}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(record.status)}>{record.status}</Badge>
              </Td>
              <Td>{record.notes || '-'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
