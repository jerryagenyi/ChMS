import React, { useState, useEffect } from 'react';
import { Box, VStack, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import { ContentLayoutProps, ContentLayoutState } from './types';

export const ContentLayout: React.FC<ContentLayoutProps> = ({
  children,
  breadcrumbs,
  maxWidth = '1200px',
  padding = '4',
  spacing = '6',
  background,
  border,
  shadow,
}) => {
  const [state, setState] = useState<ContentLayoutState>({
    isScrolled: false,
    isMobile: false,
  });

  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    setState(prev => ({ ...prev, isMobile }));
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      setState(prev => ({
        ...prev,
        isScrolled: window.scrollY > 0,
      }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      bg={background || bgColor}
      border={border || '1px'}
      borderColor={borderColor}
      shadow={shadow || 'sm'}
      borderRadius="lg"
      overflow="hidden"
    >
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <Box
          px={padding}
          py={3}
          borderBottom="1px"
          borderColor={borderColor}
          bg={useColorModeValue('gray.50', 'gray.700')}
        >
          {breadcrumbs}
        </Box>
      )}

      {/* Content */}
      <Box px={padding} py={6} maxW={maxWidth} mx="auto" w="100%">
        <VStack spacing={spacing} align="stretch">
          {children}
        </VStack>
      </Box>
    </Box>
  );
};
