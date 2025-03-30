import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { SectionLayout } from './SectionLayout';
import theme from '@/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('SectionLayout', () => {
  it('renders children', () => {
    renderWithChakra(
      <SectionLayout>
        <div>Test Content</div>
      </SectionLayout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders title', () => {
    renderWithChakra(
      <SectionLayout title="Test Title">
        <div>Test Content</div>
      </SectionLayout>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description', () => {
    renderWithChakra(
      <SectionLayout description="Test Description">
        <div>Test Content</div>
      </SectionLayout>
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('respects custom spacing', () => {
    renderWithChakra(
      <SectionLayout spacing="8">
        <div>Test Content 1</div>
        <div>Test Content 2</div>
      </SectionLayout>
    );
    const stack = screen.getByText('Test Content 1').parentElement;
    expect(stack).toHaveStyle({ gap: '8' });
  });

  it('respects custom padding', () => {
    renderWithChakra(
      <SectionLayout padding="8">
        <div>Test Content</div>
      </SectionLayout>
    );
    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveStyle({ padding: '8' });
  });

  it('respects custom background', () => {
    renderWithChakra(
      <SectionLayout background="red.500">
        <div>Test Content</div>
      </SectionLayout>
    );
    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveStyle({ backgroundColor: 'red.500' });
  });

  it('respects custom border', () => {
    renderWithChakra(
      <SectionLayout border="2px solid">
        <div>Test Content</div>
      </SectionLayout>
    );
    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveStyle({ border: '2px solid' });
  });

  it('respects custom shadow', () => {
    renderWithChakra(
      <SectionLayout shadow="lg">
        <div>Test Content</div>
      </SectionLayout>
    );
    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveStyle({ boxShadow: 'lg' });
  });

  it('applies default variant styles', () => {
    renderWithChakra(
      <SectionLayout variant="default">
        <div>Test Content</div>
      </SectionLayout>
    );
    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveStyle({ backgroundColor: 'transparent' });
  });

  it('applies subtle variant styles', () => {
    renderWithChakra(
      <SectionLayout variant="subtle">
        <div>Test Content</div>
      </SectionLayout>
    );
    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveStyle({ backgroundColor: 'gray.50' });
  });

  it('applies elevated variant styles', () => {
    renderWithChakra(
      <SectionLayout variant="elevated">
        <div>Test Content</div>
      </SectionLayout>
    );
    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveStyle({ backgroundColor: 'white' });
    expect(container).toHaveStyle({ boxShadow: 'md' });
  });

  it('applies bordered variant styles', () => {
    renderWithChakra(
      <SectionLayout variant="bordered">
        <div>Test Content</div>
      </SectionLayout>
    );
    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveStyle({ backgroundColor: 'white' });
    expect(container).toHaveStyle({ border: '1px' });
  });
});
