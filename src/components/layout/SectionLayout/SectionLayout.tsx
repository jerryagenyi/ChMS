import React, { useState } from 'react';
import { Box, VStack, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { SectionLayoutProps, SectionLayoutState } from './types';

const variantStyles = {
  default: {
    bg: 'transparent',
    border: 'none',
    shadow: 'none',
  },
  subtle: {
    bg: 'gray.50',
    border: 'none',
    shadow: 'none',
  },
  elevated: {
    bg: 'white',
    border: 'none',
    shadow: 'md',
  },
  bordered: {
    bg: 'white',
    border: '1px',
    shadow: 'none',
  },
};

export const SectionLayout: React.FC<SectionLayoutProps> = ({
  children,
  title,
  description,
  spacing = '6',
  padding = '6',
  background,
  border,
  shadow,
  variant = 'default',
}) => {
  const [state, setState] = useState<SectionLayoutState>({
    isHovered: false,
    isFocused: false,
  });

  const styles = variantStyles[variant];
  const bgColor = useColorModeValue(styles.bg, 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const titleColor = useColorModeValue('gray.900', 'white');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      bg={background || bgColor}
      border={border || styles.border}
      borderColor={borderColor}
      shadow={shadow || styles.shadow}
      borderRadius="lg"
      p={padding}
      transition="all 0.2s"
      onMouseEnter={() => setState(prev => ({ ...prev, isHovered: true }))}
      onMouseLeave={() => setState(prev => ({ ...prev, isHovered: false }))}
      onFocus={() => setState(prev => ({ ...prev, isFocused: true }))}
      onBlur={() => setState(prev => ({ ...prev, isFocused: false }))}
      _hover={variant === 'elevated' ? { shadow: 'lg' } : undefined}
      _focusWithin={variant === 'elevated' ? { shadow: 'lg' } : undefined}
    >
      <VStack spacing={spacing} align="stretch">
        {(title || description) && (
          <Box>
            {title && (
              <Heading as="h2" size="lg" color={titleColor} mb={description ? 2 : 0}>
                {title}
              </Heading>
            )}
            {description && (
              <Text color={descriptionColor} fontSize="md">
                {description}
              </Text>
            )}
          </Box>
        )}
        {children}
      </VStack>
    </Box>
  );
};
