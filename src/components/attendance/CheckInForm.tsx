import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
  FormErrorMessage,
  Box,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const checkInSchema = z.object({
  memberId: z.string().min(1, "Please select a member"),
  serviceId: z.string().min(1, "Please select a service"),
  notes: z.string().optional(),
});

type CheckInFormData = z.infer<typeof checkInSchema>;

interface Member {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

interface CheckInFormProps {
  members: Member[];
  services: Service[];
  onSubmit: (data: CheckInFormData) => void;
  isLoading?: boolean;
}

const CheckInForm: React.FC<CheckInFormProps> = ({
  members,
  services,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckInFormData>({
    resolver: zodResolver(checkInSchema),
  });

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full">
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!errors.memberId}>
          <FormLabel>Member</FormLabel>
          <Select
            placeholder="Select member"
            {...register("memberId")}
            data-testid="member-select"
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.memberId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.serviceId}>
          <FormLabel>Service</FormLabel>
          <Select
            placeholder="Select service"
            {...register("serviceId")}
            data-testid="service-select"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.serviceId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Notes (Optional)</FormLabel>
          <Input
            {...register("notes")}
            placeholder="Add any additional notes"
            data-testid="notes-input"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="purple"
          isLoading={isLoading}
          data-testid="submit-button"
        >
          Check In
        </Button>
      </VStack>
    </Box>
  );
};

export default CheckInForm;
