'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
  Card,
  CardBody,
  Stack,
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  useToast,
  CardHeader,
  CardFooter,
} from '@chakra-ui/react';
import Dialog from '@/components/Dialog';
import { AddIcon, CalendarIcon, UserAddIcon, ChartBarIcon } from '@chakra-ui/icons';

interface DashboardStats {
  totalMembers: number;
  totalEvents: number;
  upcomingEvents: number;
  recentAttendance: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const toast = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    recentAttendance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [membersRes, eventsRes, attendanceRes] = await Promise.all([
          fetch('/api/members'),
          fetch('/api/events'),
          fetch('/api/attendance/report'),
        ]);

        if (!membersRes.ok || !eventsRes.ok || !attendanceRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [members, events, attendance] = await Promise.all([
          membersRes.json(),
          eventsRes.json(),
          attendanceRes.json(),
        ]);

        setStats({
          totalMembers: members.length,
          totalEvents: events.length,
          upcomingEvents: events.filter((e: any) => new Date(e.startDate) > new Date()).length,
          recentAttendance: attendance.length,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({ redirect: false });
      toast.success('Signed out successfully');
      router.replace('/auth/signin');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
      setShowConfirmDialog(false);
    }
  };

  if (status === 'loading') {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="4xl">
        <Card
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow="sm"
        >
          <CardBody>
            <Flex justify="space-between" align="center" mb={8}>
              <Stack>
                <Heading size="lg" color="purple.700">
                  Dashboard
                </Heading>
                <Text color="gray.600">Welcome back, {session.user?.name || 'User'}</Text>
              </Stack>
              <Button
                colorScheme="purple"
                variant="outline"
                onClick={() => setShowConfirmDialog(true)}
                isLoading={isSigningOut}
                loadingText="Signing out..."
              >
                Sign Out
              </Button>
            </Flex>

            <Box>
              <Text color="gray.600">Welcome to your church management system</Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <Stat>
                <StatLabel>Total Members</StatLabel>
                <StatNumber>{isLoading ? '...' : stats.totalMembers}</StatNumber>
                <StatHelpText>All time</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Total Events</StatLabel>
                <StatNumber>{isLoading ? '...' : stats.totalEvents}</StatNumber>
                <StatHelpText>All time</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Upcoming Events</StatLabel>
                <StatNumber>{isLoading ? '...' : stats.upcomingEvents}</StatNumber>
                <StatHelpText>Next 30 days</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Recent Attendance</StatLabel>
                <StatNumber>{isLoading ? '...' : stats.recentAttendance}</StatNumber>
                <StatHelpText>Last 7 days</StatHelpText>
              </Stat>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <Card>
                <CardHeader>
                  <HStack>
                    <CalendarIcon />
                    <Heading size="md">Events</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Text>Manage and track your church events</Text>
                </CardBody>
                <CardFooter>
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    onClick={() => router.push('/events/new')}
                  >
                    Create Event
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <HStack>
                    <UserAddIcon />
                    <Heading size="md">Members</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Text>Manage your church members</Text>
                </CardBody>
                <CardFooter>
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    onClick={() => router.push('/members/register')}
                  >
                    Register Member
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <HStack>
                    <ChartBarIcon />
                    <Heading size="md">Analytics</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Text>View insights and reports</Text>
                </CardBody>
                <CardFooter>
                  <Button
                    leftIcon={<ChartBarIcon />}
                    colorScheme="blue"
                    onClick={() => router.push('/analytics')}
                  >
                    View Reports
                  </Button>
                </CardFooter>
              </Card>
            </SimpleGrid>
          </CardBody>
        </Card>

        <Dialog
          isOpen={showConfirmDialog}
          onClose={() => !isSigningOut && setShowConfirmDialog(false)}
          title="Confirm Sign Out"
        >
          <Box>
            <Text mb={6}>Are you sure you want to sign out?</Text>
            <Flex justify="flex-end" gap={4}>
              <Button
                variant="ghost"
                onClick={() => setShowConfirmDialog(false)}
                isDisabled={isSigningOut}
              >
                Cancel
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleSignOut}
                isLoading={isSigningOut}
                loadingText="Signing out..."
              >
                Sign Out
              </Button>
            </Flex>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
}
