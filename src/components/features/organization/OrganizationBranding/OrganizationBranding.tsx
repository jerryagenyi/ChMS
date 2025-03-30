import React, { createContext, useContext } from 'react';
import { Box, Image, Text, VStack } from '@chakra-ui/react';
import { OrganizationBrandingProps, OrganizationBrandingContextType } from './types';

const OrganizationBrandingContext = createContext<OrganizationBrandingContextType | null>(null);

export const useOrganizationBranding = () => {
  const context = useContext(OrganizationBrandingContext);
  if (!context) {
    throw new Error('useOrganizationBranding must be used within an OrganizationBrandingProvider');
  }
  return context;
};

const DEFAULT_PRODUCT_NAME = 'Church Africa';
const DEFAULT_COPYRIGHT_TEXT = `© ${new Date().getFullYear()} Church Africa. All rights reserved.`;

export const OrganizationBranding: React.FC<OrganizationBrandingProps> = ({
  organizationLogo,
  organizationName,
  hasWhitelabelLicense = false,
  customFooterText,
  customCopyrightText,
  logoSize = 'md',
  showFooter = true,
  children,
}) => {
  const contextValue: OrganizationBrandingContextType = {
    organizationLogo,
    organizationName,
    hasWhitelabelLicense,
    customFooterText,
    customCopyrightText,
    defaultProductName: DEFAULT_PRODUCT_NAME,
    defaultCopyrightText: DEFAULT_COPYRIGHT_TEXT,
  };

  const getLogoSize = () => {
    switch (logoSize) {
      case 'sm':
        return '32px';
      case 'lg':
        return '64px';
      default:
        return '48px';
    }
  };

  return (
    <OrganizationBrandingContext.Provider value={contextValue}>
      <VStack spacing={4} align="center">
        {/* Logo */}
        <Box>
          {organizationLogo ? (
            <Image
              src={organizationLogo}
              alt={`${organizationName} logo`}
              height={getLogoSize()}
              width="auto"
              objectFit="contain"
            />
          ) : (
            <Image
              src="/images/church-africa-logo.png"
              alt={`${DEFAULT_PRODUCT_NAME} logo`}
              height={getLogoSize()}
              width="auto"
              objectFit="contain"
            />
          )}
        </Box>

        {/* Main Content */}
        {children}

        {/* Footer */}
        {showFooter && (
          <Box as="footer" py={4} textAlign="center">
            <Text fontSize="sm" color="gray.600">
              {hasWhitelabelLicense
                ? customCopyrightText || DEFAULT_COPYRIGHT_TEXT
                : DEFAULT_COPYRIGHT_TEXT}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {hasWhitelabelLicense
                ? customFooterText || `Powered by ${DEFAULT_PRODUCT_NAME}`
                : `Powered by ${DEFAULT_PRODUCT_NAME}`}
            </Text>
          </Box>
        )}
      </VStack>
    </OrganizationBrandingContext.Provider>
  );
};

export default OrganizationBranding;
