import React, { useState, useMemo } from 'react';
import {
  Box,
  IconButton,
  Text,
  VStack,
  HStack,
  useToast,
  Tooltip as ChakraTooltip,
  Select,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { RepeatIcon, AddIcon, MinusIcon, DragHandleIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine,
  Brush,
} from 'recharts';
import { format } from 'date-fns';
import { AttendanceChartProps, AttendanceChartState, ChartTooltipProps, ChartType } from './types';
import { ChartLegend } from './ChartLegend';

const MotionBox = motion(Box);

const ChartTooltip: React.FC<ChartTooltipProps> = ({ data, position, visible }) => {
  if (!visible) return null;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="attendance-chart__tooltip"
      left={position.x}
      top={position.y}
      role="tooltip"
      aria-label={`Attendance data for ${format(data.date, 'MMM d, yyyy')}`}
    >
      <Text className="attendance-chart__tooltip-title">{format(data.date, 'MMM d, yyyy')}</Text>
      <Text className="attendance-chart__tooltip-text">Total: {data.count}</Text>
      <Text className="attendance-chart__tooltip-text">Unique Members: {data.uniqueMembers}</Text>
    </MotionBox>
  );
};

export const AttendanceChart: React.FC<AttendanceChartProps> = ({
  data,
  isLoading = false,
  isError = false,
  error,
  onRefresh,
  containerProps,
  showTooltips = true,
  animate = true,
  height = 400,
  width = '100%',
  colorScheme = 'blue',
  chartType = 'line',
  showLegend = true,
  enableZoom = false,
  enablePan = false,
  enableBrush = false,
  onChartTypeChange,
  onZoomChange,
}) => {
  const toast = useToast();
  const [state, setState] = useState<AttendanceChartState>({
    isRefreshing: false,
    error: null,
    hoveredPoint: null,
    zoomDomain: null,
    activeChartType: chartType,
  });

  const chartData = useMemo(() => {
    return data.map(point => ({
      ...point,
      date: format(point.date, 'MMM d'),
      fullDate: point.date,
    }));
  }, [data]);

  const handleRefresh = async () => {
    try {
      setState(prev => ({ ...prev, isRefreshing: true, error: null }));
      await onRefresh?.();
      toast({
        title: 'Chart data refreshed',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to refresh chart data');
      setState(prev => ({ ...prev, error }));
      toast({
        title: 'Failed to refresh chart data',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setState(prev => ({ ...prev, isRefreshing: false }));
    }
  };

  const handleChartTypeChange = (type: ChartType) => {
    setState(prev => ({ ...prev, activeChartType: type }));
    onChartTypeChange?.(type);
  };

  const handleZoomChange = (domain: { start: number; end: number }) => {
    setState(prev => ({ ...prev, zoomDomain: domain }));
    onZoomChange?.(domain);
  };

  const legendItems = [
    {
      key: 'count',
      label: 'Total Attendance',
      color: `var(--chakra-colors-${colorScheme}-500)`,
      value: 0,
    },
    {
      key: 'uniqueMembers',
      label: 'Unique Members',
      color: `var(--chakra-colors-${colorScheme}-300)`,
      value: 0,
    },
  ];

  if (isError) {
    return (
      <VStack spacing={4} p={4}>
        <Text color="red.500">Error loading attendance chart</Text>
        {error && <Text fontSize="sm">{error.message}</Text>}
        <IconButton
          aria-label="Refresh attendance data"
          icon={<RepeatIcon />}
          onClick={handleRefresh}
          isLoading={state.isRefreshing}
        />
      </VStack>
    );
  }

  const commonProps = {
    data: chartData,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  const renderChart = () => {
    switch (state.activeChartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            {showTooltips && <Tooltip />}
            <Bar
              dataKey="count"
              fill={`var(--chakra-colors-${colorScheme}-500)`}
              name="Total Attendance"
            />
            <Bar
              dataKey="uniqueMembers"
              fill={`var(--chakra-colors-${colorScheme}-300)`}
              name="Unique Members"
            />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            {showTooltips && <Tooltip />}
            <Area
              type="monotone"
              dataKey="count"
              stroke={`var(--chakra-colors-${colorScheme}-500)`}
              fill={`var(--chakra-colors-${colorScheme}-500)`}
              name="Total Attendance"
            />
            <Area
              type="monotone"
              dataKey="uniqueMembers"
              stroke={`var(--chakra-colors-${colorScheme}-300)`}
              fill={`var(--chakra-colors-${colorScheme}-300)`}
              name="Unique Members"
            />
          </AreaChart>
        );
      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            {showTooltips && <Tooltip />}
            <Bar
              dataKey="count"
              fill={`var(--chakra-colors-${colorScheme}-500)`}
              name="Total Attendance"
            />
            <Line
              type="monotone"
              dataKey="uniqueMembers"
              stroke={`var(--chakra-colors-${colorScheme}-300)`}
              name="Unique Members"
            />
            <ReferenceLine y={0} stroke="#000" />
          </ComposedChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            {showTooltips && <Tooltip />}
            <Line
              type="monotone"
              dataKey="count"
              stroke={`var(--chakra-colors-${colorScheme}-500)`}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={animate ? 1000 : 0}
              name="Total Attendance"
            />
            <Line
              type="monotone"
              dataKey="uniqueMembers"
              stroke={`var(--chakra-colors-${colorScheme}-300)`}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={animate ? 1000 : 0}
              name="Unique Members"
            />
          </LineChart>
        );
    }
  };

  return (
    <Box
      {...containerProps}
      position="relative"
      height={height}
      width={width}
      className="attendance-chart"
      role="region"
      aria-label="Attendance chart"
    >
      <HStack spacing={4} mb={4} justify="space-between">
        <FormControl>
          <FormLabel htmlFor="chart-type">Chart Type</FormLabel>
          <Select
            title="Chart Type"
            aria-label="Select chart type"
            id="chart-type"
            value={state.activeChartType}
            onChange={e => handleChartTypeChange(e.target.value as ChartType)}
            size="sm"
            width="150px"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
            <option value="composed">Composed Chart</option>
          </Select>
        </FormControl>
        <HStack>
          {enableZoom && (
            <>
              <IconButton
                aria-label="Zoom in"
                icon={<AddIcon />}
                size="sm"
                onClick={() => handleZoomChange({ start: 0, end: 100 })}
              />
              <IconButton
                aria-label="Zoom out"
                icon={<MinusIcon />}
                size="sm"
                onClick={() => handleZoomChange({ start: 0, end: 100 })}
              />
            </>
          )}
          {enablePan && (
            <IconButton
              aria-label="Pan chart"
              icon={<DragHandleIcon />}
              size="sm"
              onClick={() => {}}
            />
          )}
          <IconButton
            aria-label="Refresh chart data"
            icon={<RepeatIcon />}
            size="sm"
            onClick={handleRefresh}
            isLoading={state.isRefreshing}
          />
        </HStack>
      </HStack>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
      {showLegend && (
        <ChartLegend
          items={legendItems}
          onItemClick={key => {}}
          activeItems={['count', 'uniqueMembers']}
        />
      )}
    </Box>
  );
};

export default AttendanceChart;
