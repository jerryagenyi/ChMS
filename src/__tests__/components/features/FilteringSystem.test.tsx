import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilteringSystem } from '@/components/features/FilteringSystem';
import { ChakraProvider } from '@chakra-ui/react';

describe('FilteringSystem', () => {
  const mockFilters = [
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: ['Active', 'Inactive', 'Pending'],
    },
    {
      id: 'date',
      label: 'Date',
      type: 'date' as const,
    },
  ];

  const mockOnChange = vi.fn();
  const mockOnReset = vi.fn();

  const renderComponent = () => {
    return render(
      <ChakraProvider>
        <FilteringSystem filters={mockFilters} onChange={mockOnChange} onReset={mockOnReset} />
      </ChakraProvider>
    );
  };

  it('renders all filters correctly', () => {
    renderComponent();

    // Check if all filter labels are rendered and associated with form controls
    mockFilters.forEach(filter => {
      expect(screen.getByLabelText(filter.label)).toBeInTheDocument();
    });
  });

  it('handles select filter changes', () => {
    renderComponent();

    const select = screen.getByLabelText('Status');
    fireEvent.change(select, { target: { value: 'Active' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      status: 'Active',
    });
  });

  it('handles date filter changes', () => {
    renderComponent();

    const dateInput = screen.getByLabelText('Date');
    const testDate = '2024-03-20';
    fireEvent.change(dateInput, { target: { value: testDate } });

    expect(mockOnChange).toHaveBeenCalledWith({
      date: testDate,
    });
  });

  it('resets all filters when reset button is clicked', () => {
    renderComponent();

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith({});
  });

  it('initializes with provided values', () => {
    const initialValues = {
      status: 'Active',
      date: '2024-03-20',
    };

    render(
      <ChakraProvider>
        <FilteringSystem
          filters={mockFilters}
          onChange={mockOnChange}
          onReset={mockOnReset}
          initialValues={initialValues}
        />
      </ChakraProvider>
    );

    const statusSelect = screen.getByLabelText('Status');
    const dateInput = screen.getByLabelText('Date');

    expect(statusSelect).toHaveValue('Active');
    expect(dateInput).toHaveValue('2024-03-20');
  });
});
