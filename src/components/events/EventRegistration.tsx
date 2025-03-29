import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { VisitorTouchpointSelector } from '@/components/visitor/VisitorTouchpointSelector';

interface RegistrationFormData {
  guestType: 'MEMBER' | 'VISITOR';
  memberId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  dietaryRestrictions?: string;
  notes?: string;
  touchpoint?: {
    touchpoint: string;
    source: string;
  };
}

interface EventRegistrationProps {
  eventId: string;
  onSubmit: (data: RegistrationFormData) => Promise<void>;
}

export const EventRegistration = ({ eventId, onSubmit }: EventRegistrationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [guestType, setGuestType] = useState<'MEMBER' | 'VISITOR'>('VISITOR');
  const [touchpoint, setTouchpoint] = useState<{ touchpoint: string; source: string }>({
    touchpoint: '',
    source: '',
  });
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>();

  const onSubmitHandler = async (data: RegistrationFormData) => {
    try {
      setIsLoading(true);
      await onSubmit({ ...data, guestType, touchpoint });
      toast({
        title: 'Registration successful',
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
        <FormControl as="fieldset">
          <FormLabel as="legend">Registration Type</FormLabel>
          <RadioGroup
            value={guestType}
            onChange={(value: 'MEMBER' | 'VISITOR') => setGuestType(value)}
          >
            <Stack direction="row">
              <Radio value="MEMBER">Church Member</Radio>
              <Radio value="VISITOR">Guest</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        {guestType === 'MEMBER' ? (
          <FormControl isRequired isInvalid={!!errors.memberId}>
            <FormLabel>Member ID</FormLabel>
            <Input {...register('memberId', { required: 'Member ID is required' })} />
          </FormControl>
        ) : (
          <>
            <FormControl isRequired isInvalid={!!errors.firstName}>
              <FormLabel>First Name</FormLabel>
              <Input {...register('firstName', { required: 'First name is required' })} />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.lastName}>
              <FormLabel>Last Name</FormLabel>
              <Input {...register('lastName', { required: 'Last name is required' })} />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...register('email', { required: 'Email is required' })} />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input type="tel" {...register('phone')} />
            </FormControl>

            <FormControl>
              <FormLabel>Organization</FormLabel>
              <Input {...register('organization')} />
            </FormControl>

            <FormControl>
              <FormLabel>Dietary Restrictions</FormLabel>
              <Input {...register('dietaryRestrictions')} />
            </FormControl>

            <FormControl>
              <FormLabel>Additional Notes</FormLabel>
              <Textarea {...register('notes')} />
            </FormControl>

            <VisitorTouchpointSelector
              value={touchpoint}
              onChange={setTouchpoint}
              isRequired
            />
          </>
        )}

        <Button type="submit" colorScheme="blue" isLoading={isLoading} loadingText="Registering...">
          Register for Event
        </Button>
      </VStack>
    </Box>
  );
};
