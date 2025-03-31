import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Checkbox,
  Button,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';

interface ListItem {
  id: string;
  title: string;
  description?: string;
}

interface ListViewProps {
  items: ListItem[];
  onSelect?: (selectedIds: string[]) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  viewMode?: 'list' | 'grid';
}

export const ListView: React.FC<ListViewProps> = ({
  items,
  onSelect,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  viewMode = 'list',
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    onSelect?.(selectedIds);
  }, [selectedIds, onSelect]);

  const handleSelect = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const containerProps = {
    display: viewMode === 'grid' ? 'grid' : 'flex',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 4,
    flexDirection: 'column' as const,
    width: '100%',
    'data-testid': viewMode === 'grid' ? 'grid-container' : 'list-container',
  };

  return (
    <VStack spacing={4} align="stretch" width="100%">
      <Box {...containerProps}>
        {items.map(item => (
          <Box
            key={item.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            bg={bgColor}
            borderColor={borderColor}
            shadow="sm"
          >
            <HStack spacing={4}>
              {onSelect && (
                <Checkbox
                  isChecked={selectedIds.includes(item.id)}
                  onChange={() => handleSelect(item.id)}
                  aria-label={item.title}
                />
              )}
              <Box flex="1">
                <Text fontWeight="bold">{item.title}</Text>
                {item.description && <Text color="gray.600">{item.description}</Text>}
              </Box>
            </HStack>
          </Box>
        ))}
      </Box>
      {isLoading && <Spinner data-testid="loading-spinner" />}
      {hasMore && !isLoading && (
        <Button onClick={onLoadMore} isDisabled={isLoading} width="100%">
          Load More
        </Button>
      )}
    </VStack>
  );
};
