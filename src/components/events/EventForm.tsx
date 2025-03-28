import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Switch,
  VStack,
  useToast,
} from '@chakra-ui/react';

interface EventFormData {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  venue?: string;
  capacity?: number;
  isPublic: boolean;
}

interface EventFormProps {
  onSubmit: (data: EventFormData) => Promise<void>;
  initialData?: Partial<EventFormData>;
  isEdit?: boolean;
}

export const EventForm = ({ onSubmit, initialData, isEdit = false }: EventFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: initialData,
  });

  const onSubmitHandler = async (data: EventFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      toast({
        title: `Event ${isEdit ? 'updated' : 'created'} successfully`,
        status: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmitHandler)}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Event Name</FormLabel>
          <Input {...register('name', { required: 'Event name is required' })} />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea {...register('description')} />
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.startDate}>
          <FormLabel>Start Date & Time</FormLabel>
          <Input
            type="datetime-local"
            {...register('startDate', { required: 'Start date is required' })}
          />
        </FormControl>

        <FormControl>
          <FormLabel>End Date & Time</FormLabel>
          <Input type="datetime-local" {...register('endDate')} />
        </FormControl>

        <FormControl>
          <FormLabel>Venue</FormLabel>
          <Input {...register('venue')} />
        </FormControl>

        <FormControl>
          <FormLabel>Capacity</FormLabel>
          <NumberInput>
            <NumberInputField {...register('capacity', { valueAsNumber: true })} />
          </NumberInput>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Public Event</FormLabel>
          <Switch {...register('isPublic')} defaultChecked />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isLoading}
          loadingText={isEdit ? 'Updating...' : 'Creating...'}
        >
          {isEdit ? 'Update Event' : 'Create Event'}
        </Button>
      </VStack>
    </Box>
  );
};
