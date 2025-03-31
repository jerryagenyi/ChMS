import { Suspense } from 'react';
import { Container, Heading, Text, VStack, Skeleton } from '@chakra-ui/react';
import OrganizationForm from '@/components/features/organization/OrganizationForm';

export default function NewOrganizationPage() {
  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Create New Organization</Heading>
        <Text color="gray.600">Fill in the details below to create your organization</Text>

        <Suspense fallback={<Skeleton height="400px" />}>
          <OrganizationForm />
        </Suspense>
      </VStack>
    </Container>
  );
}
