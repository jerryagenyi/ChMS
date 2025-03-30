import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Text,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckInFormProps, CheckInFormState, checkInSchema, type CheckInFormData } from './types';

export const CheckInForm: React.FC<CheckInFormProps> = ({
  services,
  locations,
  onSubmit,
  isLoading = false,
  isDisabled = false,
  defaultValues,
  formControlProps,
  formLabelProps,
  inputProps,
}) => {
  const toast = useToast();
  const [state, setState] = useState<CheckInFormState>({
    isSubmitting: false,
    error: null,
    success: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckInFormData>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      memberId: '',
      serviceId: '',
      location: '',
      notes: '',
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (data: CheckInFormData) => {
    try {
      setState(prev => ({ ...prev, isSubmitting: true, error: null, success: false }));
      await onSubmit(data);
      setState(prev => ({ ...prev, success: true }));
      reset();
      toast({
        title: 'Check-in successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check in');
      setState(prev => ({ ...prev, error }));
      toast({
        title: 'Check-in failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!errors.memberId} {...formControlProps}>
          <FormLabel {...formLabelProps}>Member ID</FormLabel>
          <Input
            {...register('memberId')}
            placeholder="Enter member ID"
            isDisabled={isDisabled || state.isSubmitting}
            {...inputProps}
          />
          <FormErrorMessage>{errors.memberId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.serviceId} {...formControlProps}>
          <FormLabel {...formLabelProps}>Service</FormLabel>
          <Select
            {...register('serviceId')}
            placeholder="Select service"
            isDisabled={isDisabled || state.isSubmitting}
            {...inputProps}
          >
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - {new Date(service.date).toLocaleDateString()}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.serviceId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.location} {...formControlProps}>
          <FormLabel {...formLabelProps}>Location</FormLabel>
          <Select
            {...register('location')}
            placeholder="Select location"
            isDisabled={isDisabled || state.isSubmitting}
            {...inputProps}
          >
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
                {location.capacity && ` (Capacity: ${location.capacity})`}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
        </FormControl>

        <FormControl {...formControlProps}>
          <FormLabel {...formLabelProps}>Notes (Optional)</FormLabel>
          <Textarea
            {...register('notes')}
            placeholder="Add any additional notes"
            isDisabled={isDisabled || state.isSubmitting}
            {...inputProps}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isLoading || state.isSubmitting}
          isDisabled={isDisabled || state.isSubmitting}
          loadingText="Checking in..."
        >
          Check In
        </Button>

        {state.error && (
          <Text color="red.500" fontSize="sm">
            {state.error.message}
          </Text>
        )}
      </VStack>
    </form>
  );
};

export default CheckInForm;
