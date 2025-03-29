import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  useBreakpointValue,
  useColorModeValue,
  IconButton,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { PageLayoutProps, PageLayoutState } from './types';

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  header,
  footer,
  sidebar,
  sidebarWidth = '250px',
  maxWidth = '1200px',
  padding = '4',
  isSidebarCollapsed = false,
  onSidebarToggle,
}) => {
  const [state, setState] = useState<PageLayoutState>({
    isSidebarOpen: !isSidebarCollapsed,
    isMobile: false,
  });

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: !isSidebarCollapsed,
  });

  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    setState(prev => ({ ...prev, isMobile }));
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      onToggle();
    }
  }, [isMobile, onToggle]);

  const handleSidebarToggle = () => {
    onToggle();
    onSidebarToggle?.();
  };

  return (
    <Flex direction="column" minH="100vh" bg={bgColor}>
      {/* Header */}
      {header && (
        <Box
          as="header"
          position="sticky"
          top={0}
          zIndex="sticky"
          bg={bgColor}
          borderBottom="1px"
          borderColor={borderColor}
        >
          <Flex
            maxW={maxWidth}
            mx="auto"
            px={padding}
            py={4}
            align="center"
            justify="space-between"
          >
            {header}
            {sidebar && isMobile && (
              <IconButton
                aria-label="Toggle Sidebar"
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                onClick={handleSidebarToggle}
                variant="ghost"
                display={{ base: 'flex', md: 'none' }}
              />
            )}
          </Flex>
        </Box>
      )}

      {/* Main Content */}
      <Flex flex={1} position="relative">
        {/* Sidebar */}
        {sidebar && (
          <Collapse in={isOpen} animateOpacity>
            <Box
              as="aside"
              position={{ base: 'absolute', md: 'relative' }}
              top={0}
              left={0}
              bottom={0}
              w={{ base: '100%', md: sidebarWidth }}
              bg={bgColor}
              borderRight="1px"
              borderColor={borderColor}
              zIndex="sidebar"
            >
              <Box
                position="sticky"
                top={header ? '64px' : 0}
                h={{ base: 'auto', md: 'calc(100vh - 64px)' }}
                overflowY="auto"
                py={4}
              >
                {sidebar}
              </Box>
            </Box>
          </Collapse>
        )}

        {/* Main Content Area */}
        <Box as="main" flex={1} maxW={maxWidth} mx="auto" px={padding} py={8} w="100%">
          {children}
        </Box>
      </Flex>

      {/* Footer */}
      {footer && (
        <Box as="footer" bg={bgColor} borderTop="1px" borderColor={borderColor} py={8}>
          <Box maxW={maxWidth} mx="auto" px={padding}>
            {footer}
          </Box>
        </Box>
      )}
    </Flex>
  );
};
