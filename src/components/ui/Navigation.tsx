import {
  Box,
  Button,
  Flex,
  Link,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Icon,
} from '@chakra-ui/react';
import { RiMenuLine } from 'react-icons/ri';
import type { IconType } from 'react-icons';

interface Route {
  path: string;
  label: string;
  children?: Route[];
}

interface NavigationProps {
  routes: Route[];
  currentPath?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ routes, currentPath }) => {
  const { isOpen, onToggle } = useDisclosure();

  const renderMenuItem = (route: Route) => {
    if (route.children) {
      return (
        <Menu key={route.path}>
          <MenuButton as={Button} variant="ghost">
            {route.label}
          </MenuButton>
          <MenuList>
            {route.children.map(child => (
              <MenuItem key={child.path}>{child.label}</MenuItem>
            ))}
          </MenuList>
        </Menu>
      );
    }

    return (
      <Link
        key={route.path}
        href={route.path}
        p={2}
        aria-current={currentPath === route.path ? 'page' : undefined}
      >
        {route.label}
      </Link>
    );
  };

  return (
    <Box as="nav">
      <Flex display={{ base: 'flex', md: 'none' }}>
        <IconButton
          aria-label="Toggle navigation"
          icon={<Icon as={RiMenuLine as IconType} />}
          onClick={onToggle}
        />
      </Flex>

      <Box
        display={{ base: isOpen ? 'block' : 'none', md: 'flex' }}
        role={isOpen ? 'menu' : undefined}
      >
        {routes.map(renderMenuItem)}
      </Box>
    </Box>
  );
};
