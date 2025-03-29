import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { organizationSchema, type OrganizationFormData } from '@/lib/schemas/organization';

export default function OrganizationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
  });

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create organization');
      }

      const result = await response.json();

      toast({
        title: 'Organization created',
        description: 'Your organization has been successfully created',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // You can add navigation here using Next.js router
      // router.push(`/organizations/${result.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create organization',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} width="100%" maxW="md">
      <VStack spacing={4}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Organization Name</FormLabel>
          <Input {...register('name')} placeholder="Enter organization name" />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea {...register('description')} placeholder="Enter organization description" />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.address}>
          <FormLabel>Address</FormLabel>
          <Input {...register('address')} placeholder="Enter organization address" />
          <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.phone}>
          <FormLabel>Phone Number</FormLabel>
          <Input {...register('phone')} placeholder="Enter phone number" type="tel" />
          <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input {...register('email')} placeholder="Enter organization email" type="email" />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <Button type="submit" colorScheme="blue" width="100%" isLoading={isLoading}>
          Create Organization
        </Button>
      </VStack>
    </Box>
  );
}
