import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Heading,
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Divider,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Event } from '@prisma/client';
import { EditIcon, CheckIcon, UserAddIcon, ChartBarIcon } from '@chakra-ui/icons';

export default function EventDetailsPage() {
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

  const handleEdit = () => {
    router.push(`/events/${eventId}/edit`);
  };

  const handleRegister = () => {
    router.push(`/events/${eventId}/register`);
  };

  const handleCheckIn = () => {
    router.push(`/events/${eventId}/check-in`);
  };

  const handleViewReports = () => {
    router.push(`/events/${eventId}/reports`);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header Section */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <Heading size="lg">{event.name}</Heading>
            <HStack spacing={4}>
              <Button
                leftIcon={<EditIcon />}
                colorScheme="blue"
                variant="outline"
                onClick={handleEdit}
              >
                Edit Event
              </Button>
              <Button leftIcon={<UserAddIcon />} colorScheme="green" onClick={handleRegister}>
                Register
              </Button>
              <Button leftIcon={<CheckIcon />} colorScheme="purple" onClick={handleCheckIn}>
                Check-in
              </Button>
              <Button leftIcon={<ChartBarIcon />} colorScheme="teal" onClick={handleViewReports}>
                Reports
              </Button>
            </HStack>
          </HStack>

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

        <Divider />

        {/* Tabs Section */}
        <Tabs>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Registrations</Tab>
            <Tab>Check-ins</Tab>
            <Tab>Reports</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                  <Heading size="md" mb={4}>
                    Event Overview
                  </Heading>
                  <Text>Registration count: 0</Text>
                  <Text>Check-in count: 0</Text>
                  <Text>Capacity used: 0%</Text>
                </Box>
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                  <Heading size="md" mb={4}>
                    Registrations
                  </Heading>
                  <Text>No registrations yet</Text>
                </Box>
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                  <Heading size="md" mb={4}>
                    Check-ins
                  </Heading>
                  <Text>No check-ins yet</Text>
                </Box>
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                  <Heading size="md" mb={4}>
                    Reports
                  </Heading>
                  <Text>No reports available yet</Text>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}
