import { render, screen, fireEvent, within } from '@testing-library/react';
import { vi } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import { DataTable } from '@/components/ui/DataTable';
import { Navigation } from '@/components/ui/Navigation';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { SearchComponent } from '@/components/ui/SearchComponent';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('Main UI Components', () => {
  describe('DataTable', () => {
    const mockData = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];

    const columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
    ];

    test('renders table with data', () => {
      renderWithChakra(<DataTable data={mockData} columns={columns} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(3); // header + 2 rows
    });

    test('handles sorting', () => {
      const onSort = vi.fn();
      renderWithChakra(<DataTable data={mockData} columns={columns} onSort={onSort} />);

      fireEvent.click(screen.getByText('Name'));
      expect(onSort).toHaveBeenCalledWith('name', 'asc');
    });

    test('handles pagination', () => {
      const onPageChange = vi.fn();
      renderWithChakra(
        <DataTable data={mockData} columns={columns} pagination onPageChange={onPageChange} />
      );

      fireEvent.click(screen.getByLabelText('Next page'));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    test('supports row selection', () => {
      const onSelect = vi.fn();
      renderWithChakra(
        <DataTable data={mockData} columns={columns} selectable onRowSelect={onSelect} />
      );

      const checkbox = screen.getAllByRole('checkbox')[1]; // First row checkbox
      fireEvent.click(checkbox);
      expect(onSelect).toHaveBeenCalledWith([mockData[0]]);
    });
  });

  describe('NavigationElements', () => {
    const mockRoutes = [
      { path: '/', label: 'Home' },
      { path: '/members', label: 'Members' },
      { path: '/attendance', label: 'Attendance' },
    ];

    test('renders navigation items', () => {
      renderWithChakra(<Navigation routes={mockRoutes} />);
      mockRoutes.forEach(route => {
        expect(screen.getByText(route.label)).toBeInTheDocument();
      });
    });

    test('handles active route', () => {
      renderWithChakra(<Navigation routes={mockRoutes} currentPath="/members" />);
      const activeLink = screen.getByText('Members').closest('a');
      expect(activeLink).toHaveAttribute('aria-current', 'page');
    });

    test('supports mobile responsiveness', () => {
      renderWithChakra(<Navigation routes={mockRoutes} />);
      const menuButton = screen.getByLabelText('Toggle navigation');

      fireEvent.click(menuButton);
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    test('handles nested routes', () => {
      const nestedRoutes = [
        ...mockRoutes,
        {
          path: '/settings',
          label: 'Settings',
          children: [
            { path: '/settings/profile', label: 'Profile' },
            { path: '/settings/account', label: 'Account' },
          ],
        },
      ];

      renderWithChakra(<Navigation routes={nestedRoutes} />);
      fireEvent.click(screen.getByText('Settings'));
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });
  });

  describe('ErrorBoundary', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    test('catches and displays errors', () => {
      const onError = vi.fn();
      renderWithChakra(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(onError).toHaveBeenCalled();
    });

    test('renders fallback UI', () => {
      const fallback = <div>Custom error message</div>;
      renderWithChakra(
        <ErrorBoundary fallback={fallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    test('supports error recovery', () => {
      renderWithChakra(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByText(/try again/i);
      fireEvent.click(retryButton);
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  describe('SearchComponents', () => {
    const mockResults = [
      { id: 1, title: 'First Result' },
      { id: 2, title: 'Second Result' },
    ];

    test('handles input changes', async () => {
      const onSearch = vi.fn().mockResolvedValue(mockResults);
      renderWithChakra(<SearchComponent onSearch={onSearch} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'test' } });

      expect(onSearch).toHaveBeenCalledWith('test');
    });

    test('displays search results', async () => {
      const onSearch = vi.fn().mockResolvedValue(mockResults);
      renderWithChakra(<SearchComponent onSearch={onSearch} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'test' } });

      const results = await screen.findByRole('listbox');
      expect(within(results).getByText('First Result')).toBeInTheDocument();
    });

    test('handles loading state', () => {
      const onSearch = vi.fn().mockImplementation(() => new Promise(() => {}));
      renderWithChakra(<SearchComponent onSearch={onSearch} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'test' } });

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('supports keyboard navigation', async () => {
      const onSearch = vi.fn().mockResolvedValue(mockResults);
      const onSelect = vi.fn();
      renderWithChakra(<SearchComponent onSearch={onSearch} onSelect={onSelect} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'test' } });

      await screen.findByRole('listbox');
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onSelect).toHaveBeenCalledWith(mockResults[0]);
    });
  });
});
