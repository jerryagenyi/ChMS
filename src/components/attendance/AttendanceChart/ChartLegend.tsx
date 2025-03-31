import React from 'react';
import { Box, Text, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChartLegendProps } from './types';

const MotionBox = motion(Box);

export const ChartLegend: React.FC<ChartLegendProps> = ({ items, onItemClick, activeItems }) => {
  return (
    <Box className="chart-legend">
      {items.map(item => {
        const isActive = activeItems.includes(item.key);
        return (
          <MotionBox
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Tooltip label={`Click to ${isActive ? 'hide' : 'show'} ${item.label} data`}>
              <button
                className={`chart-legend__item ${!isActive ? 'chart-legend__item--inactive' : ''}`}
                onClick={() => onItemClick?.(item.key)}
                aria-label={`${item.label} - ${isActive ? 'Visible' : 'Hidden'}`}
              >
                <Box className="chart-legend__color" bg={item.color} />
                <Text className="chart-legend__label">{item.label}</Text>
                <Text className="chart-legend__value">({item.value})</Text>
              </button>
            </Tooltip>
          </MotionBox>
        );
      })}
    </Box>
  );
};

export default ChartLegend;
