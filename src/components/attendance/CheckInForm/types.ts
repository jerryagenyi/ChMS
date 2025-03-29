import { FormControlProps, FormLabelProps, InputProps } from '@chakra-ui/react';
import { z } from 'zod';

export const checkInSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
  serviceId: z.string().min(1, 'Service is required'),
  location: z.string().min(1, 'Location is required'),
  notes: z.string().optional(),
});

export type CheckInFormData = z.infer<typeof checkInSchema>;

export interface Service {
  id: string;
  name: string;
  date: Date;
}

export interface Location {
  id: string;
  name: string;
  capacity?: number;
}

export interface CheckInFormProps {
  services: Service[];
  locations: Location[];
  onSubmit: (data: CheckInFormData) => Promise<void>;
  isLoading?: boolean;
  isDisabled?: boolean;
  defaultValues?: Partial<CheckInFormData>;
  formControlProps?: FormControlProps;
  formLabelProps?: FormLabelProps;
  inputProps?: InputProps;
}

export interface CheckInFormState {
  isSubmitting: boolean;
  error: Error | null;
  success: boolean;
} 