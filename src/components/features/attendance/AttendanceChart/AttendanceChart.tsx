import React, { useState, useMemo } from 'react';
import {
  Box,
  IconButton,
  Text,
  VStack,
  useToast,
  Tooltip as ChakraTooltip,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { AttendanceChartProps, AttendanceChartState, ChartTooltipProps } from './types';

const MotionBox = motion(Box);

const ChartTooltip: React.FC<ChartTooltipProps> = ({ data, position, visible }) => {
  if (!visible) return null;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      position="absolute"
      bg="white"
      p={3}
      borderRadius="md"
      boxShadow="md"
      zIndex={10}
      left={position.x}
      top={position.y}
    >
      <Text fontWeight="bold">{format(data.date, 'MMM d, yyyy')}</Text>
      <Text>Total: {data.count}</Text>
      <Text>Unique Members: {data.uniqueMembers}</Text>
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
}) => {
  const toast = useToast();
  const [state, setState] = useState<AttendanceChartState>({
    isRefreshing: false,
    error: null,
    hoveredPoint: null,
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

  if (isError) {
    return (
      <VStack spacing={4} p={4}>
        <Text color="red.500">Error loading attendance chart</Text>
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
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      {...containerProps}
    >
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <ChakraTooltip label="Refresh data">
          <IconButton
            aria-label="Refresh"
            icon={<RepeatIcon />}
            onClick={handleRefresh}
            isLoading={isLoading || state.isRefreshing}
          />
        </ChakraTooltip>
      </Box>
      <Box height={height} width={width}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            />
            <Line
              type="monotone"
              dataKey="uniqueMembers"
              stroke={`var(--chakra-colors-${colorScheme}-300)`}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={animate ? 1000 : 0}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <AnimatePresence>
        {state.hoveredPoint && (
          <ChartTooltip data={state.hoveredPoint} position={{ x: 0, y: 0 }} visible={true} />
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

export default AttendanceChart;

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
              name="Total Attendance"
            />
            <Line
              type="monotone"
              dataKey="uniqueMembers"
              stroke={`var(--chakra-colors-${colorScheme}-300)`}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Unique Members"
            />
          </LineChart>
        );
    }
  };

  if (isError) {
    return (
      <VStack spacing={4} p={4}>
        <Text color="red.500">Error loading attendance chart</Text>
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
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      {...containerProps}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <HStack spacing={4}>
          <Select
            size="sm"
            value={state.activeChartType}
            onChange={e => handleChartTypeChange(e.target.value as ChartType)}
            width="150px"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
            <option value="composed">Composed Chart</option>
          </Select>
          {enableZoom && (
            <HStack>
              <ChakraTooltip label="Zoom In">
                <IconButton
                  aria-label="Zoom In"
                  icon={<ZoomInIcon />}
                  size="sm"
                  onClick={() => handleZoomChange({ start: 0, end: 0.5 })}
                />
              </ChakraTooltip>
              <ChakraTooltip label="Zoom Out">
                <IconButton
                  aria-label="Zoom Out"
                  icon={<ZoomOutIcon />}
                  size="sm"
                  onClick={() => handleZoomChange({ start: 0, end: 1 })}
                />
              </ChakraTooltip>
            </HStack>
          )}
          {enablePan && (
            <ChakraTooltip label="Pan Mode">
              <IconButton
                aria-label="Pan Mode"
                icon={<PanIcon />}
                size="sm"
                onClick={() => {
                  /* Implement pan mode */
                }}
              />
            </ChakraTooltip>
          )}
        </HStack>
        <ChakraTooltip label="Refresh data">
          <IconButton
            aria-label="Refresh"
            icon={<RepeatIcon />}
            onClick={handleRefresh}
            isLoading={isLoading || state.isRefreshing}
          />
        </ChakraTooltip>
      </Box>
      <Box height={height} width={width}>
        <ResponsiveContainer>
          {renderChart()}
          {enableBrush && <Brush />}
        </ResponsiveContainer>
      </Box>
      {showLegend && <ChartLegend items={legendItems} activeItems={['count', 'uniqueMembers']} />}
      <AnimatePresence>
        {state.hoveredPoint && (
          <ChartTooltip data={state.hoveredPoint} position={{ x: 0, y: 0 }} visible={true} />
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

export default AttendanceChart;
