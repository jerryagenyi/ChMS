import { Box, Flex, Icon, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { FiHome, FiUsers, FiCalendar, FiBarChart2 } from 'react-icons/fi';
import { useRouter } from 'next/router';

const navItems = [
  { name: 'Dashboard', icon: FiHome, href: '/' },
  { name: 'Members', icon: FiUsers, href: '/members' },
  { name: 'Services', icon: FiCalendar, href: '/services' },
  { name: 'Reports', icon: FiBarChart2, href: '/reports' },
];

export function Sidebar() {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeColor = useColorModeValue('brand.500', 'brand.200');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box
      as="nav"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      w={{ base: 'full', md: '64' }}
      h="100vh"
      pos="fixed"
      display={{ base: 'none', md: 'block' }}
    >
      <Flex direction="column" h="full">
        <Box p={4}>
          <Text fontSize="xl" fontWeight="bold">
            ChMS
          </Text>
        </Box>
        <Stack spacing={1} flex="1" p={4}>
          {navItems.map(item => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                display="flex"
                align="center"
                px={4}
                py={2}
                rounded="md"
                color={isActive ? activeColor : 'inherit'}
                bg={isActive ? hoverBg : 'transparent'}
                _hover={{ bg: hoverBg }}
              >
                <Icon as={item.icon} mr={3} />
                <Text>{item.name}</Text>
              </Link>
            );
          })}
        </Stack>
      </Flex>
    </Box>
  );
}
