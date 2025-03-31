import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ListView } from '@/components/features/ListView';
import { ChakraProvider } from '@chakra-ui/react';

describe('ListView', () => {
  const mockItems = [
    { id: '1', title: 'Item 1', description: 'Description 1' },
    { id: '2', title: 'Item 2', description: 'Description 2' },
    { id: '3', title: 'Item 3', description: 'Description 3' },
  ];

  const mockOnSelect = vi.fn();
  const mockOnLoadMore = vi.fn();

  const renderComponent = (props = {}) => {
    return render(
      <ChakraProvider>
        <ListView
          items={mockItems}
          onSelect={mockOnSelect}
          onLoadMore={mockOnLoadMore}
          hasMore={true}
          isLoading={false}
          viewMode="list"
          {...props}
        />
      </ChakraProvider>
    );
  };

  it('renders items correctly', () => {
    renderComponent();

    mockItems.forEach(item => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });
  });

  it('handles item selection', () => {
    renderComponent();

    const firstItemCheckbox = screen.getByRole('checkbox', { name: mockItems[0].title });
    fireEvent.click(firstItemCheckbox);

    expect(mockOnSelect).toHaveBeenCalledWith(['1']);
  });

  it('handles multiple item selection', () => {
    renderComponent();

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    expect(mockOnSelect).toHaveBeenCalledWith(['1', '2']);
  });

  it('shows loading state', () => {
    renderComponent({ isLoading: true });
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('handles load more', () => {
    renderComponent();

    const loadMoreButton = screen.getByRole('button', { name: /load more/i });
    fireEvent.click(loadMoreButton);

    expect(mockOnLoadMore).toHaveBeenCalled();
  });

  it('supports grid view mode', () => {
    renderComponent({ viewMode: 'grid' });
    const gridContainer = screen.getByTestId('grid-container');
    expect(gridContainer).toHaveStyle({ display: 'grid' });
  });

  it('supports list view mode', () => {
    renderComponent({ viewMode: 'list' });
    const listContainer = screen.getByTestId('list-container');
    expect(listContainer).toHaveStyle({ display: 'flex' });
  });

  it('disables load more button while loading', () => {
    renderComponent({ isLoading: true, hasMore: true });
    const loadMoreButton = screen.queryByRole('button', { name: /load more/i });
    expect(loadMoreButton).not.toBeInTheDocument();
  });
});
