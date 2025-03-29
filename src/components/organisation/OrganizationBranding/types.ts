import { ReactNode } from 'react';

export interface OrganizationBrandingProps {
  /** Organization logo URL */
  organizationLogo?: string;
  /** Organization name */
  organizationName: string;
  /** Whether the organization has whitelabel license */
  hasWhitelabelLicense?: boolean;
  /** Custom footer text for whitelabeled organizations */
  customFooterText?: string;
  /** Custom copyright text for whitelabeled organizations */
  customCopyrightText?: string;
  /** Size of the logo */
  logoSize?: 'sm' | 'md' | 'lg';
  /** Whether to show the footer */
  showFooter?: boolean;
  /** Child components */
  children?: ReactNode;
}

export interface OrganizationBrandingContextType {
  organizationLogo?: string;
  organizationName: string;
  hasWhitelabelLicense: boolean;
  customFooterText?: string;
  customCopyrightText?: string;
  defaultProductName: string;
  defaultCopyrightText: string;
} 