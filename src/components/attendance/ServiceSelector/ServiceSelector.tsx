import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Select,
  Button,
  Text,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  IconButton,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { HiSearch, HiRefresh } from 'react-icons/hi';
import { ServiceSelectorProps, ServiceSelectorState, ServiceFilters } from './types';

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedServiceId,
  isLoading,
  isError,
  error,
  onServiceSelect,
  onRefresh,
  onFilterChange,
}) => {
  const toast = useToast();
  const [state, setState] = useState<ServiceSelectorState>({
    isRefreshing: false,
    error: null,
    filters: {},
    sortConfig: {
      key: null,
      direction: 'asc',
    },
  });

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setState(prev => ({ ...prev, isRefreshing: true }));
      try {
        await onRefresh();
        toast({
          title: 'Services refreshed',
          status: 'success',
          duration: 3000,
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err : new Error('Failed to refresh'),
        }));
        toast({
          title: 'Failed to refresh',
          description: err instanceof Error ? err.message : 'An error occurred',
          status: 'error',
          duration: 5000,
        });
      } finally {
        setState(prev => ({ ...prev, isRefreshing: false }));
      }
    }
  }, [onRefresh, toast]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<ServiceFilters>) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      setState(prev => ({ ...prev, filters: updatedFilters }));
      onFilterChange?.(updatedFilters);
    },
    [state.filters, onFilterChange]
  );

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      if (state.filters.type && service.type !== state.filters.type) {
        return false;
      }
      if (state.filters.date && service.date !== state.filters.date) {
        return false;
      }
      if (state.filters.isActive !== undefined && service.isActive !== state.filters.isActive) {
        return false;
      }
      if (
        state.filters.search &&
        !service.name.toLowerCase().includes(state.filters.search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [services, state.filters]);

  if (isError) {
    return (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Error
        </AlertTitle>
        <AlertDescription maxWidth="sm">{error?.message}</AlertDescription>
        {onRefresh && (
          <Button
            colorScheme="red"
            variant="outline"
            mt={4}
            onClick={handleRefresh}
            isLoading={state.isRefreshing}
          >
            Retry
          </Button>
        )}
      </Alert>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="xl" fontWeight="bold">
          Select Service
        </Text>
        {onRefresh && (
          <IconButton
            aria-label="Refresh"
            icon={<RefreshIcon />}
            onClick={handleRefresh}
            isLoading={state.isRefreshing}
          />
        )}
      </HStack>

      <HStack spacing={4}>
        <Input
          placeholder="Search services..."
          leftElement={<SearchIcon color="gray.400" />}
          onChange={e => handleFilterChange({ search: e.target.value })}
        />
        <Select
          title="Service Type Filter"
          aria-label="Service Type Filter"
          placeholder="Service Type"
          onChange={e => handleFilterChange({ type: e.target.value as Service['type'] })}
        >
          <option value="sunday">Sunday Service</option>
          <option value="wednesday">Wednesday Service</option>
          <option value="special">Special Service</option>
        </Select>
        <Input type="date" onChange={e => handleFilterChange({ date: e.target.value })} />
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Active Only</FormLabel>
          <Switch
            isChecked={state.filters.isActive}
            onChange={e => handleFilterChange({ isActive: e.target.checked })}
          />
        </FormControl>
      </HStack>

      <Box overflowY="auto" maxHeight="400px">
        {isLoading ? (
          <Box textAlign="center" py={8}>
            <Spinner />
          </Box>
        ) : (
          <VStack spacing={2} align="stretch">
            {filteredServices.map(service => (
              <Button
                key={service.id}
                variant={selectedServiceId === service.id ? 'solid' : 'outline'}
                colorScheme={selectedServiceId === service.id ? 'brand' : 'gray'}
                onClick={() => onServiceSelect(service.id)}
                justifyContent="space-between"
                textAlign="left"
                height="auto"
                py={3}
                px={4}
              >
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{service.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(service.date).toLocaleDateString()} - {service.type}
                  </Text>
                  {service.description && (
                    <Text fontSize="sm" color="gray.600">
                      {service.description}
                    </Text>
                  )}
                </VStack>
                <Text fontSize="sm" color={service.isActive ? 'green.500' : 'red.500'}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </Text>
              </Button>
            ))}
          </VStack>
        )}
      </Box>
    </VStack>
  );
};
