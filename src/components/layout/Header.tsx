import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiBell, FiMenu, FiUser } from 'react-icons/fi';

export function Header() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box as="header" bg={bgColor} borderBottom="1px" borderColor={borderColor} px={4} py={3}>
      <Flex justify="space-between" align="center">
        <IconButton
          aria-label="Open menu"
          icon={<FiMenu />}
          variant="ghost"
          display={{ base: 'flex', md: 'none' }}
        />
        <HStack spacing={4}>
          <IconButton aria-label="Notifications" icon={<FiBell />} variant="ghost" />
          <Menu>
            <MenuButton as={IconButton} aria-label="User menu" icon={<FiUser />} variant="ghost" />
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}
