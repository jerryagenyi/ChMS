import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Heading, Box, Text, useToast, VStack, HStack, Badge } from '@chakra-ui/react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Event } from '@prisma/client';
import { EventRegistration } from '@/components/events/EventRegistration';

export default function EventRegistrationPage() {
  const router = useRouter();
  const { eventId } = router.query;
  const toast = useToast();
  const { data: event, error } = useSWR<Event>(eventId ? `/api/events/${eventId}` : null, fetcher);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error loading event',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  if (!event && !error) {
    return <Text>Loading...</Text>;
  }

  if (error || !event) {
    return <Text color="red.500">Error loading event</Text>;
  }

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to register for event');
      }

      toast({
        title: 'Registration successful',
        description: 'You have been registered for the event.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.push(`/events/${eventId}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to register for event',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={4}>
            Register for {event.name}
          </Heading>
          <HStack spacing={4} mb={4}>
            <Badge colorScheme={event.isPublic ? 'green' : 'orange'}>
              {event.isPublic ? 'Public' : 'Private'}
            </Badge>
            {event.capacity && <Badge colorScheme="blue">Capacity: {event.capacity}</Badge>}
          </HStack>
          <Text color="gray.600" mb={4}>
            {new Date(event.startDate).toLocaleDateString()}
            {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
          </Text>
          {event.venue && (
            <Text color="gray.600" mb={4}>
              Venue: {event.venue}
            </Text>
          )}
          {event.description && (
            <Text color="gray.700" mb={4}>
              {event.description}
            </Text>
          )}
        </Box>

        <Box shadow="md" borderWidth="1px" borderRadius="lg" p={6}>
          <EventRegistration eventId={eventId as string} onSubmit={handleSubmit} />
        </Box>
      </VStack>
    </Container>
  );
}
