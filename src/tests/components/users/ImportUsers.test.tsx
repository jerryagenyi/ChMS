import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ImportUsers from '@/components/users/ImportUsers';
import { vi } from 'vitest';

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('ImportUsers Component', () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders import form with all elements', () => {
    renderWithChakra(<ImportUsers />);

    expect(screen.getByText('Download Template')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload CSV File')).toBeInTheDocument();
    expect(screen.getByText('Import Users')).toBeInTheDocument();
  });

  it('handles template download', async () => {
    const mockCreateElement = vi.spyOn(document, 'createElement');
    const mockClick = vi.fn();
    mockCreateElement.mockImplementation(() => ({
      href: '',
      download: '',
      click: mockClick,
    } as any));

    renderWithChakra(<ImportUsers />);

    fireEvent.click(screen.getByText('Download Template'));

    expect(mockClick).toHaveBeenCalled();
    expect(mockCreateElement).toHaveBeenCalledWith('a');
  });

  it('handles file selection', () => {
    renderWithChakra(<ImportUsers />);

    const file = new File(['test csv content'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Upload CSV File');

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('Import Users')).not.toBeDisabled();
  });

  it('handles successful import', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        successful: 2,
        failed: 0,
        errors: []
      })
    });

    renderWithChakra(<ImportUsers />);

    const file = new File(['test csv content'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Upload CSV File');

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText('Import Users'));

    await waitFor(() => {
      expect(screen.getByText('Successfully imported: 2')).toBeInTheDocument();
    });
  });

  it('handles import with errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        successful: 1,
        failed: 1,
        errors: ['Invalid email format for row 2']
      })
    });

    renderWithChakra(<ImportUsers />);

    const file = new File(['test csv content'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Upload CSV File');

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText('Import Users'));

    await waitFor(() => {
      expect(screen.getByText('Successfully imported: 1')).toBeInTheDocument();
      expect(screen.getByText('Failed: 1')).toBeInTheDocument();
      expect(screen.getByText('Invalid email format for row 2')).toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithChakra(<ImportUsers />);

    const file = new File(['test csv content'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Upload CSV File');

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText('Import Users'));

    await waitFor(() => {
      expect(screen.getByText('Import Failed')).toBeInTheDocument();
    });
  });

  it('shows loading state during import', async () => {
    mockFetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithChakra(<ImportUsers />);

    const file = new File(['test csv content'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Upload CSV File');

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText('Import Users'));

    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });
});