import { Container, Heading, Box } from '@chakra-ui/react';
import { EventForm } from '@/components/events/EventForm';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';

export default function NewEventPage() {
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const event = await response.json();
      toast({
        title: 'Event created',
        description: 'The event has been created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.push(`/events/${event.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create event',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Heading size="lg" mb={6}>
        Create New Event
      </Heading>
      <Box shadow="md" borderWidth="1px" borderRadius="lg" p={6}>
        <EventForm onSubmit={handleSubmit} />
      </Box>
    </Container>
  );
}
