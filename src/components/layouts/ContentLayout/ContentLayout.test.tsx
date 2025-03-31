import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ContentLayout } from './ContentLayout';
import theme from '@/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('ContentLayout', () => {
  it('renders children', () => {
    renderWithChakra(
      <ContentLayout>
        <div>Test Content</div>
      </ContentLayout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderWithChakra(
      <ContentLayout breadcrumbs={<div>Test Breadcrumbs</div>}>
        <div>Test Content</div>
      </ContentLayout>
    );
    expect(screen.getByText('Test Breadcrumbs')).toBeInTheDocument();
  });

  it('respects custom max width', () => {
    renderWithChakra(
      <ContentLayout maxWidth="800px">
        <div>Test Content</div>
      </ContentLayout>
    );
    const content = screen.getByText('Test Content').parentElement;
    expect(content).toHaveStyle({ maxWidth: '800px' });
  });

  it('respects custom padding', () => {
    renderWithChakra(
      <ContentLayout padding="8">
        <div>Test Content</div>
      </ContentLayout>
    );
    const content = screen.getByText('Test Content').parentElement;
    expect(content).toHaveStyle({ padding: '8' });
  });

  it('respects custom spacing', () => {
    renderWithChakra(
      <ContentLayout spacing="8">
        <div>Test Content 1</div>
        <div>Test Content 2</div>
      </ContentLayout>
    );
    const stack = screen.getByText('Test Content 1').parentElement;
    expect(stack).toHaveStyle({ gap: '8' });
  });

  it('respects custom background', () => {
    renderWithChakra(
      <ContentLayout background="red.500">
        <div>Test Content</div>
      </ContentLayout>
    );
    const container = screen.getByText('Test Content').parentElement?.parentElement;
    expect(container).toHaveStyle({ backgroundColor: 'red.500' });
  });

  it('respects custom border', () => {
    renderWithChakra(
      <ContentLayout border="2px solid">
        <div>Test Content</div>
      </ContentLayout>
    );
    const container = screen.getByText('Test Content').parentElement?.parentElement;
    expect(container).toHaveStyle({ border: '2px solid' });
  });

  it('respects custom shadow', () => {
    renderWithChakra(
      <ContentLayout shadow="lg">
        <div>Test Content</div>
      </ContentLayout>
    );
    const container = screen.getByText('Test Content').parentElement?.parentElement;
    expect(container).toHaveStyle({ boxShadow: 'lg' });
  });

  it('handles ministry unit content layout', () => {
    renderWithChakra(
      <ContentLayout
        breadcrumbs={<div>Home / Ministry Units / Department Name</div>}
        title="Department Overview"
      >
        <div>Ministry Unit Details</div>
      </ContentLayout>
    );

    expect(screen.getByText('Department Overview')).toBeInTheDocument();
    expect(screen.getByText('Home / Ministry Units / Department Name')).toBeInTheDocument();
  });

  it('supports ministry management actions', () => {
    renderWithChakra(
      <ContentLayout
        actions={
          <div>
            <button>Add Member</button>
            <button>Edit Unit</button>
          </div>
        }
      >
        <div>Unit Content</div>
      </ContentLayout>
    );

    expect(screen.getByRole('button', { name: 'Add Member' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit Unit' })).toBeInTheDocument();
  });

  it('handles loading states', () => {
    renderWithChakra(
      <ContentLayout isLoading>
        <div>Loading Content...</div>
      </ContentLayout>
    );

    expect(screen.getByText('Loading Content...')).toBeInTheDocument();
  });
});
