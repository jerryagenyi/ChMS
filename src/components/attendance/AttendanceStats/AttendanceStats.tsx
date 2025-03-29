import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  IconButton,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { AttendanceStatsProps, AttendanceStatsState, StatCardProps } from './types';

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  isLoading = false,
  isError = false,
  error,
  ...statProps
}) => {
  return (
    <Stat {...statProps}>
      <StatLabel>{label}</StatLabel>
      {isLoading ? (
        <StatNumber>Loading...</StatNumber>
      ) : isError ? (
        <StatNumber color="red.500">Error</StatNumber>
      ) : (
        <StatNumber>{value}</StatNumber>
      )}
      {error && (
        <StatHelpText color="red.500" fontSize="sm">
          {error.message}
        </StatHelpText>
      )}
    </Stat>
  );
};

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  totalAttendance,
  uniqueMembers,
  averageAttendance,
  peakAttendance,
  isLoading = false,
  isError = false,
  error,
  onRefresh,
  containerProps,
  statProps,
}) => {
  const toast = useToast();
  const [state, setState] = useState<AttendanceStatsState>({
    isRefreshing: false,
    error: null,
  });

  const handleRefresh = async () => {
    try {
      setState(prev => ({ ...prev, isRefreshing: true, error: null }));
      await onRefresh?.();
      toast({
        title: 'Stats refreshed',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to refresh stats');
      setState(prev => ({ ...prev, error }));
      toast({
        title: 'Failed to refresh stats',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setState(prev => ({ ...prev, isRefreshing: false }));
    }
  };

  if (isError) {
    return (
      <VStack spacing={4} p={4}>
        <Text color="red.500">Error loading attendance statistics</Text>
        {error && <Text fontSize="sm">{error.message}</Text>}
        <IconButton
          aria-label="Refresh"
          icon={<RepeatIcon />}
          onClick={handleRefresh}
          isLoading={state.isRefreshing}
        />
      </VStack>
    );
  }

  return (
    <Box {...containerProps}>
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <IconButton
          aria-label="Refresh"
          icon={<RepeatIcon />}
          onClick={handleRefresh}
          isLoading={isLoading || state.isRefreshing}
        />
      </Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard
          label="Total Attendance"
          value={totalAttendance}
          isLoading={isLoading}
          {...statProps}
        />
        <StatCard
          label="Unique Members"
          value={uniqueMembers}
          isLoading={isLoading}
          {...statProps}
        />
        <StatCard
          label="Average Attendance"
          value={averageAttendance}
          isLoading={isLoading}
          {...statProps}
        />
        <StatCard
          label="Peak Attendance"
          value={peakAttendance}
          isLoading={isLoading}
          {...statProps}
        />
      </SimpleGrid>
    </Box>
  );
};

export default AttendanceStats;
