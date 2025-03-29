import { BoxProps } from '@chakra-ui/react';

export interface AttendanceDataPoint {
  date: Date;
  count: number;
  uniqueMembers: number;
}

export type ChartType = 'line' | 'bar' | 'area' | 'composed';

export interface ChartLegendItem {
  key: string;
  label: string;
  color: string;
  value: number;
}

export interface AttendanceChartProps {
  data: AttendanceDataPoint[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  onRefresh?: () => Promise<void>;
  containerProps?: BoxProps;
  showTooltips?: boolean;
  animate?: boolean;
  height?: number;
  width?: number;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
  chartType?: ChartType;
  showLegend?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  enableBrush?: boolean;
  onChartTypeChange?: (type: ChartType) => void;
  onZoomChange?: (domain: { start: number; end: number }) => void;
}

export interface AttendanceChartState {
  isRefreshing: boolean;
  error: Error | null;
  hoveredPoint: AttendanceDataPoint | null;
  zoomDomain: { start: number; end: number } | null;
  activeChartType: ChartType;
}

export interface ChartTooltipProps {
  data: AttendanceDataPoint;
  position: { x: number; y: number };
  visible: boolean;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
  onItemClick?: (key: string) => void;
  activeItems: string[];
} 