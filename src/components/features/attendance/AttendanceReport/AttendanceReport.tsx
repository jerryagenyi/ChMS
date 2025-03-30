import React, { useState, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Select,
  useToast,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from '@chakra-ui/react';
import { DownloadIcon, RefreshIcon, FilterIcon } from '@chakra-ui/icons';
import { AttendanceChart } from '../AttendanceChart';
import { AttendanceStats } from '../AttendanceStats';
import { AttendanceList } from '../AttendanceList';
import {
  AttendanceReportProps,
  AttendanceReportState,
  AttendanceSummary,
  AttendanceTrend,
} from './types';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { calculateAttendanceSummary, calculateAttendanceTrends } from '@/utils/attendance';

export const AttendanceReport: React.FC<AttendanceReportProps> = ({
  data,
  dateRange,
  isLoading,
  isError,
  error,
  onDateRangeChange,
  onExport,
  onRefresh,
}) => {
  const toast = useToast();
  const [state, setState] = useState<AttendanceReportState>({
    isExporting: false,
    error: null,
    selectedView: 'daily',
    filters: {},
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const summary = useMemo<AttendanceSummary>(() => {
    return calculateAttendanceSummary(data, state.filters);
  }, [data, state.filters]);

  const trends = useMemo<AttendanceTrend[]>(() => {
    return calculateAttendanceTrends(data, state.selectedView, state.filters);
  }, [data, state.selectedView, state.filters]);

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setState(prev => ({ ...prev, isExporting: true }));
      await onExport?.(format);
      toast({
        title: 'Export successful',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
      toast({
        title: 'Export failed',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setState(prev => ({ ...prev, isExporting: false }));
    }
  };

  const handleRefresh = () => {
    onRefresh?.();
  };

  if (isError) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error loading attendance report</AlertTitle>
        <AlertDescription>{error?.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Attendance Report</Heading>
        <HStack>
          <IconButton
            aria-label="Refresh"
            icon={<RefreshIcon />}
            onClick={handleRefresh}
            isLoading={isLoading}
          />
          <Menu>
            <MenuButton as={Button} leftIcon={<DownloadIcon />} isLoading={state.isExporting}>
              Export
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleExport('csv')}>CSV</MenuItem>
              <MenuItem onClick={() => handleExport('pdf')}>PDF</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>

      <HStack spacing={4}>
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} isDisabled={isLoading} />
        <Select
          value={state.selectedView}
          onChange={e =>
            setState(prev => ({
              ...prev,
              selectedView: e.target.value as 'daily' | 'weekly' | 'monthly',
            }))
          }
          isDisabled={isLoading}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Select>
        <Button leftIcon={<FilterIcon />} onClick={onOpen} isDisabled={isLoading}>
          Filters
        </Button>
      </HStack>

      {isLoading ? (
        <Skeleton height="200px" />
      ) : (
        <Tabs>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Details</Tab>
            <Tab>Trends</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <AttendanceStats
                  totalAttendance={summary.totalAttendance}
                  uniqueMembers={summary.uniqueMembers}
                  averageAttendance={summary.averageAttendance}
                  peakAttendance={summary.peakAttendance}
                />
                <AttendanceChart data={trends} type="line" title="Attendance Trends" />
              </VStack>
            </TabPanel>
            <TabPanel>
              <AttendanceList data={data} isLoading={isLoading} onRefresh={handleRefresh} />
            </TabPanel>
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <AttendanceChart data={trends} type="bar" title="Attendance Distribution" />
                <AttendanceChart data={trends} type="area" title="Attendance Growth" />
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </VStack>
  );
};
