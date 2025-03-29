import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Heading,
  Box,
  Text,
  useToast,
  VStack,
  HStack,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Event } from '@prisma/client';
import { EventCheckIn } from '@/components/events/EventCheckIn';

export default function EventCheckInPage() {
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

  const handleCheckIn = async (data: any) => {
    try {
      const response = await fetch(`/api/events/${eventId}/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to check in');
      }

      toast({
        title: 'Check-in successful',
        description: 'The attendee has been checked in successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to check in',
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
            Check-in for {event.name}
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
        </Box>

        <Tabs>
          <TabList>
            <Tab>QR Code</Tab>
            <Tab>Manual Check-in</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Box shadow="md" borderWidth="1px" borderRadius="lg" p={6}>
                <EventCheckIn eventId={eventId as string} onSubmit={handleCheckIn} />
              </Box>
            </TabPanel>

            <TabPanel>
              <Box shadow="md" borderWidth="1px" borderRadius="lg" p={6}>
                <Text mb={4}>Manual check-in form will be implemented here</Text>
                <Text color="gray.500">Coming soon...</Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}
