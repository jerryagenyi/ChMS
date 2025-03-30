import React from 'react';
import { render, screen } from '@testing-library/react';
import { OrganizationBranding, useOrganizationBranding } from './OrganizationBranding';

const TestChild = () => {
  const context = useOrganizationBranding();
  return <div data-testid="test-child">{context.organizationName}</div>;
};

describe('OrganizationBranding', () => {
  const defaultProps = {
    organizationName: 'Test Church',
  };

  it('renders with default product logo when no organization logo is provided', () => {
    render(
      <OrganizationBranding {...defaultProps}>
        <TestChild />
      </OrganizationBranding>
    );

    const logo = screen.getByAltText('Church Africa logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/images/church-africa-logo.png');
  });

  it('renders with organization logo when provided', () => {
    const orgLogo = 'https://example.com/logo.png';
    render(
      <OrganizationBranding {...defaultProps} organizationLogo={orgLogo}>
        <TestChild />
      </OrganizationBranding>
    );

    const logo = screen.getByAltText('Test Church logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', orgLogo);
  });

  it('renders footer with default copyright text', () => {
    render(
      <OrganizationBranding {...defaultProps}>
        <TestChild />
      </OrganizationBranding>
    );

    const copyrightText = screen.getByText(/© \d{4} Church Africa/);
    expect(copyrightText).toBeInTheDocument();
  });

  it('renders footer with custom copyright text for whitelabeled organizations', () => {
    const customCopyright = '© 2024 Custom Copyright';
    render(
      <OrganizationBranding
        {...defaultProps}
        hasWhitelabelLicense
        customCopyrightText={customCopyright}
      >
        <TestChild />
      </OrganizationBranding>
    );

    const copyrightText = screen.getByText(customCopyright);
    expect(copyrightText).toBeInTheDocument();
  });

  it('provides organization branding context to children', () => {
    render(
      <OrganizationBranding {...defaultProps}>
        <TestChild />
      </OrganizationBranding>
    );

    const child = screen.getByTestId('test-child');
    expect(child).toHaveTextContent('Test Church');
  });

  it('supports different logo sizes', () => {
    const { rerender } = render(
      <OrganizationBranding {...defaultProps} logoSize="sm">
        <TestChild />
      </OrganizationBranding>
    );
    expect(screen.getByAltText('Church Africa logo')).toHaveStyle({ height: '32px' });

    rerender(
      <OrganizationBranding {...defaultProps} logoSize="lg">
        <TestChild />
      </OrganizationBranding>
    );
    expect(screen.getByAltText('Church Africa logo')).toHaveStyle({ height: '64px' });
  });

  it('hides footer when showFooter is false', () => {
    render(
      <OrganizationBranding {...defaultProps} showFooter={false}>
        <TestChild />
      </OrganizationBranding>
    );

    expect(screen.queryByText(/© \d{4} Church Africa/)).not.toBeInTheDocument();
  });
});
