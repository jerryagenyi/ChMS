import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { PageLayout } from './PageLayout';
import theme from '@/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('PageLayout', () => {
  it('renders children', () => {
    renderWithChakra(
      <PageLayout>
        <div>Test Content</div>
      </PageLayout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders header', () => {
    renderWithChakra(
      <PageLayout header={<div>Test Header</div>}>
        <div>Test Content</div>
      </PageLayout>
    );
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('renders footer', () => {
    renderWithChakra(
      <PageLayout footer={<div>Test Footer</div>}>
        <div>Test Content</div>
      </PageLayout>
    );
    expect(screen.getByText('Test Footer')).toBeInTheDocument();
  });

  it('renders sidebar', () => {
    renderWithChakra(
      <PageLayout sidebar={<div>Test Sidebar</div>}>
        <div>Test Content</div>
      </PageLayout>
    );
    expect(screen.getByText('Test Sidebar')).toBeInTheDocument();
  });

  it('toggles sidebar on mobile', () => {
    renderWithChakra(
      <PageLayout sidebar={<div>Test Sidebar</div>}>
        <div>Test Content</div>
      </PageLayout>
    );
    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
    fireEvent.click(toggleButton);
    expect(screen.getByText('Test Sidebar')).not.toBeVisible();
  });

  it('respects custom sidebar width', () => {
    renderWithChakra(
      <PageLayout sidebar={<div>Test Sidebar</div>} sidebarWidth="300px">
        <div>Test Content</div>
      </PageLayout>
    );
    const sidebar = screen.getByText('Test Sidebar').parentElement;
    expect(sidebar).toHaveStyle({ width: '300px' });
  });

  it('respects custom max width', () => {
    renderWithChakra(
      <PageLayout maxWidth="800px">
        <div>Test Content</div>
      </PageLayout>
    );
    const main = screen.getByText('Test Content').parentElement;
    expect(main).toHaveStyle({ maxWidth: '800px' });
  });

  it('respects custom padding', () => {
    renderWithChakra(
      <PageLayout padding="8">
        <div>Test Content</div>
      </PageLayout>
    );
    const main = screen.getByText('Test Content').parentElement;
    expect(main).toHaveStyle({ padding: '8' });
  });

  it('handles sidebar collapse', () => {
    renderWithChakra(
      <PageLayout sidebar={<div>Test Sidebar</div>} isSidebarCollapsed={true}>
        <div>Test Content</div>
      </PageLayout>
    );
    expect(screen.getByText('Test Sidebar')).not.toBeVisible();
  });

  it('calls onSidebarToggle when sidebar is toggled', () => {
    const onSidebarToggle = jest.fn();
    renderWithChakra(
      <PageLayout sidebar={<div>Test Sidebar</div>} onSidebarToggle={onSidebarToggle}>
        <div>Test Content</div>
      </PageLayout>
    );
    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
    fireEvent.click(toggleButton);
    expect(onSidebarToggle).toHaveBeenCalled();
  });
});
