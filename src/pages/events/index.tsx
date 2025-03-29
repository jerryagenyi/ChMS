import { useState } from 'react';
import {
  Container,
  Heading,
  Box,
  Text,
  VStack,
  HStack,
  Select,
  Input,
  Button,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  useToast,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  isPublic: boolean;
  capacity: number;
  totalRegistrations: number;
}

export default function EventsDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch events',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'upcoming' && new Date(event.startDate) > new Date()) ||
      (filter === 'past' && new Date(event.endDate) < new Date());
    return matchesSearch && matchesFilter;
  });

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <HStack justify="space-between" mb={4}>
            <Box>
              <Heading size="lg">Events</Heading>
              <Text color="gray.600">Manage and track your church events</Text>
            </Box>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={() => router.push('/events/new')}
            >
              Create Event
            </Button>
          </HStack>

          <HStack spacing={4} mb={6}>
            <Box position="relative" flex={1}>
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                pl={10}
              />
              <SearchIcon
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                color="gray.400"
              />
            </Box>
            <Select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              width="200px"
              aria-label="Filter events by date"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past Events</option>
            </Select>
          </HStack>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredEvents.map(event => (
            <Card key={event.id}>
              <CardHeader>
                <HStack justify="space-between">
                  <Heading size="md">{event.name}</Heading>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<HamburgerIcon />}
                      variant="ghost"
                      aria-label="More options"
                    />
                    <MenuList>
                      <MenuItem onClick={() => router.push(`/events/${event.id}`)}>
                        View Details
                      </MenuItem>
                      <MenuItem onClick={() => router.push(`/events/${event.id}/check-in`)}>
                        Check-in
                      </MenuItem>
                      <MenuItem onClick={() => router.push(`/events/${event.id}/register`)}>
                        Register
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
                <HStack spacing={2} mt={2}>
                  <Badge colorScheme={event.isPublic ? 'green' : 'orange'}>
                    {event.isPublic ? 'Public' : 'Private'}
                  </Badge>
                  {event.capacity && (
                    <Badge colorScheme="blue">
                      {event.totalRegistrations}/{event.capacity}
                    </Badge>
                  )}
                </HStack>
              </CardHeader>
              <CardBody>
                <Text noOfLines={2} color="gray.600">
                  {event.description}
                </Text>
                <VStack align="stretch" mt={4} spacing={1}>
                  <Text fontSize="sm">
                    <strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()}
                    {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                  </Text>
                  {event.venue && (
                    <Text fontSize="sm">
                      <strong>Venue:</strong> {event.venue}
                    </Text>
                  )}
                </VStack>
              </CardBody>
              <CardFooter>
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => router.push(`/events/${event.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
