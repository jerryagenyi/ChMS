import React from 'react';
import { HStack, Box, Text, IconButton, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChartLegendProps } from './types';

const MotionBox = motion(Box);

export const ChartLegend: React.FC<ChartLegendProps> = ({ items, onItemClick, activeItems }) => {
  return (
    <HStack spacing={4} wrap="wrap" justify="center" mt={4}>
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
            <Tooltip label={`Click to ${isActive ? 'hide' : 'show'}`}>
              <IconButton
                aria-label={`Toggle ${item.label}`}
                size="sm"
                variant="ghost"
                onClick={() => onItemClick?.(item.key)}
                opacity={isActive ? 1 : 0.5}
                _hover={{ opacity: 1 }}
              >
                <HStack spacing={2}>
                  <Box
                    w={3}
                    h={3}
                    borderRadius="sm"
                    bg={item.color}
                    border="1px solid"
                    borderColor="gray.200"
                  />
                  <Text fontSize="sm">{item.label}</Text>
                  <Text fontSize="sm" color="gray.500">
                    ({item.value})
                  </Text>
                </HStack>
              </IconButton>
            </Tooltip>
          </MotionBox>
        );
      })}
    </HStack>
  );
};

export default ChartLegend;
