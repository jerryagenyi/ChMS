import React, { useState, useMemo } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Select,
  HStack,
  VStack,
  Text,
  Button,
  Spinner,
  Box,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon, RepeatIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import {
  AttendanceListProps,
  AttendanceListState,
  AttendanceFilters,
  AttendanceSort,
  AttendanceRecord,
} from './types';

export const AttendanceList: React.FC<AttendanceListProps> = ({
  records,
  isLoading = false,
  isError = false,
  error,
  onRefresh,
  onFilterChange,
  onSortChange,
  tableProps,
  containerProps,
}) => {
  const toast = useToast();
  const [state, setState] = useState<AttendanceListState>({
    filters: {},
    sort: { field: 'timestamp', direction: 'desc' },
    page: 1,
    pageSize: 10,
  });

  const handleFilterChange = (newFilters: Partial<AttendanceFilters>) => {
    const updatedFilters = { ...state.filters, ...newFilters };
    setState(prev => ({ ...prev, filters: updatedFilters }));
    onFilterChange?.(updatedFilters);
  };

  const handleSortChange = (field: keyof AttendanceRecord) => {
    const newSort: AttendanceSort = {
      field,
      direction: state.sort.field === field && state.sort.direction === 'asc' ? 'desc' : 'asc',
    };
    setState(prev => ({ ...prev, sort: newSort }));
    onSortChange?.(newSort);
  };

  const handleRefresh = async () => {
    try {
      await onRefresh?.();
      toast({
        title: 'Attendance list refreshed',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Failed to refresh attendance list',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const { serviceId, location, dateRange, searchTerm } = state.filters;

      if (serviceId && record.serviceId !== serviceId) return false;
      if (location && record.location !== location) return false;
      if (dateRange) {
        const recordDate = new Date(record.timestamp);
        if (recordDate < dateRange.start || recordDate > dateRange.end) return false;
      }
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          record.memberName.toLowerCase().includes(searchLower) ||
          record.serviceName.toLowerCase().includes(searchLower) ||
          record.location.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [records, state.filters]);

  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      const { field, direction } = state.sort;
      const aValue = a[field] ?? ''; // Use nullish coalescing to provide default value
      const bValue = b[field] ?? ''; // Use nullish coalescing to provide default value

      if (direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });
  }, [filteredRecords, state.sort]);

  const paginatedRecords = useMemo(() => {
    const start = (state.page - 1) * state.pageSize;
    return sortedRecords.slice(start, start + state.pageSize);
  }, [sortedRecords, state.page, state.pageSize]);

  if (isError) {
    return (
      <VStack spacing={4} p={4}>
        <Text color="red.500">Error loading attendance records</Text>
        {error && <Text fontSize="sm">{error.message}</Text>}
        <Button onClick={handleRefresh} leftIcon={<RepeatIcon />}>
          Try Again
        </Button>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
        <Input
          placeholder="Search by name, service, or location"
          value={state.filters.searchTerm || ''}
          onChange={e => handleFilterChange({ searchTerm: e.target.value })}
          maxW="300px"
        />
        <Select
          title="Service Filter"
          aria-label="Filter attendance by service"
          placeholder="Filter by service"
          value={state.filters.serviceId || ''}
          onChange={e => handleFilterChange({ serviceId: e.target.value })}
          maxW="200px"
        >
          {Array.from(new Set(records.map(r => r.serviceId))).map(serviceId => (
            <option key={serviceId} value={serviceId}>
              {records.find(r => r.serviceId === serviceId)?.serviceName}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Filter by location"
          value={state.filters.location || ''}
          onChange={e => handleFilterChange({ location: e.target.value })}
          maxW="200px"
        >
          {Array.from(new Set(records.map(r => r.location))).map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </Select>
        <IconButton
          aria-label="Refresh"
          icon={<RepeatIcon />}
          onClick={handleRefresh}
          isLoading={isLoading}
        />
      </HStack>

      <TableContainer {...containerProps}>
        <Table variant="simple" {...tableProps}>
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => handleSortChange('memberName')}>
                Member
                {state.sort.field === 'memberName' &&
                  (state.sort.direction === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
              </Th>
              <Th cursor="pointer" onClick={() => handleSortChange('serviceName')}>
                Service
                {state.sort.field === 'serviceName' &&
                  (state.sort.direction === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
              </Th>
              <Th cursor="pointer" onClick={() => handleSortChange('location')}>
                Location
                {state.sort.field === 'location' &&
                  (state.sort.direction === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
              </Th>
              <Th cursor="pointer" onClick={() => handleSortChange('timestamp')}>
                Date & Time
                {state.sort.field === 'timestamp' &&
                  (state.sort.direction === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
              </Th>
              <Th>Notes</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  <Spinner />
                </Td>
              </Tr>
            ) : paginatedRecords.length === 0 ? (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  No attendance records found
                </Td>
              </Tr>
            ) : (
              paginatedRecords.map(record => (
                <Tr key={record.id}>
                  <Td>{record.memberName}</Td>
                  <Td>{record.serviceName}</Td>
                  <Td>{record.location}</Td>
                  <Td>{format(new Date(record.timestamp), 'PPp')}</Td>
                  <Td>{record.notes || '-'}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <HStack justify="space-between">
        <Text>
          Showing {paginatedRecords.length} of {filteredRecords.length} records
        </Text>
        <HStack>
          <Button
            onClick={() => setState(prev => ({ ...prev, page: prev.page - 1 }))}
            isDisabled={state.page === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setState(prev => ({ ...prev, page: prev.page + 1 }))}
            isDisabled={state.page * state.pageSize >= filteredRecords.length}
          >
            Next
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
};

export default AttendanceList;
