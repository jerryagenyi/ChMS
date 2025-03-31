import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import { FilteringSystem } from '../../../components/features/FilteringSystem';
import { CRUDForm } from '../../../components/features/CRUDForm';
import { ListView } from '../../../components/features/ListView';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('Feature Components', () => {
  describe('FilteringSystem', () => {
    const mockFilters = [
      { id: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] },
      { id: 'role', label: 'Role', type: 'select' as const, options: ['Admin', 'User'] },
      { id: 'date', label: 'Date', type: 'date' as const },
    ];

    test('renders filter options', () => {
      const onChange = vi.fn();
      const onReset = vi.fn();
      renderWithChakra(
        <FilteringSystem filters={mockFilters} onChange={onChange} onReset={onReset} />
      );

      mockFilters.forEach(filter => {
        expect(screen.getByLabelText(filter.label)).toBeInTheDocument();
      });
    });

    test('handles filter changes', () => {
      const onChange = vi.fn();
      const onReset = vi.fn();
      renderWithChakra(
        <FilteringSystem filters={mockFilters} onChange={onChange} onReset={onReset} />
      );

      fireEvent.change(screen.getByLabelText('Status'), {
        target: { value: 'Active' },
      });

      expect(onChange).toHaveBeenCalledWith({
        status: 'Active',
      });
    });

    test('supports filter reset', () => {
      const onChange = vi.fn();
      const onReset = vi.fn();
      renderWithChakra(
        <FilteringSystem
          filters={mockFilters}
          onChange={onChange}
          onReset={onReset}
          initialValues={{ status: 'Active' }}
        />
      );

      fireEvent.click(screen.getByText('Reset'));
      expect(onChange).toHaveBeenCalledWith({});
      expect(onReset).toHaveBeenCalled();
    });

    test('handles multiple filters', () => {
      const onChange = vi.fn();
      const onReset = vi.fn();
      renderWithChakra(
        <FilteringSystem filters={mockFilters} onChange={onChange} onReset={onReset} />
      );

      fireEvent.change(screen.getByLabelText('Status'), {
        target: { value: 'Active' },
      });
      fireEvent.change(screen.getByLabelText('Role'), {
        target: { value: 'Admin' },
      });

      expect(onChange).toHaveBeenCalledWith({
        status: 'Active',
        role: 'Admin',
      });
    });
  });

  describe('CRUDForm', () => {
    const mockFields = [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'role', label: 'Role', type: 'text' },
    ];

    test('renders form fields', () => {
      const onSubmit = vi.fn();
      renderWithChakra(<CRUDForm fields={mockFields} onSubmit={onSubmit} />);

      expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Role' })).toBeInTheDocument();
    });

    test('handles form submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      renderWithChakra(<CRUDForm fields={mockFields} onSubmit={onSubmit} />);

      fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByRole('textbox', { name: 'Email' }), {
        target: { value: 'john@example.com' },
      });

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
        });
      });
    });

    test('validates required fields', async () => {
      const onSubmit = vi.fn();
      renderWithChakra(<CRUDForm fields={mockFields} onSubmit={onSubmit} />);

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    test('supports edit mode', () => {
      const onSubmit = vi.fn();
      const initialValues = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
      };

      renderWithChakra(
        <CRUDForm
          fields={mockFields}
          onSubmit={onSubmit}
          initialValues={initialValues}
          isEdit={true}
        />
      );

      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('John Doe');
      expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('john@example.com');
      expect(screen.getByRole('textbox', { name: 'Role' })).toHaveValue('Admin');
      expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
    });
  });

  describe('ListView', () => {
    const mockItems = [
      { id: '1', title: 'Item 1', description: 'Description 1' },
      { id: '2', title: 'Item 2', description: 'Description 2' },
    ];

    test('renders list items', () => {
      renderWithChakra(<ListView items={mockItems} />);
      mockItems.forEach(item => {
        expect(screen.getByText(item.title)).toBeInTheDocument();
        expect(screen.getByText(item.description)).toBeInTheDocument();
      });
    });

    test('handles item selection', () => {
      const onSelect = vi.fn();
      renderWithChakra(<ListView items={mockItems} onSelect={onSelect} />);

      const checkbox = screen.getByRole('checkbox', { name: 'Item 1' });
      fireEvent.click(checkbox);
      expect(onSelect).toHaveBeenCalledWith(['1']);
    });

    test('supports different view modes', () => {
      renderWithChakra(<ListView items={mockItems} viewMode="grid" />);
      expect(screen.getByTestId('grid-container')).toHaveStyle({ display: 'grid' });

      renderWithChakra(<ListView items={mockItems} viewMode="list" />);
      expect(screen.getByTestId('list-container')).toHaveStyle({ display: 'flex' });
    });

    test('handles empty state', () => {
      renderWithChakra(<ListView items={[]} />);
      expect(screen.getByTestId('list-container')).toBeEmptyDOMElement();
    });

    test('supports load more', () => {
      const onLoadMore = vi.fn();
      renderWithChakra(<ListView items={mockItems} onLoadMore={onLoadMore} hasMore={true} />);

      const loadMoreButton = screen.getByRole('button', { name: /load more/i });
      fireEvent.click(loadMoreButton);
      expect(onLoadMore).toHaveBeenCalled();
    });
  });
});
