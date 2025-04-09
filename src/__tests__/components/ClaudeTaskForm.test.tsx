import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClaudeTaskForm } from '@/components/ClaudeTaskForm';
import { ChakraProvider } from '@chakra-ui/react';
import { vi } from 'vitest';

// Mock the fetch function
global.fetch = vi.fn();

// Mock the toast function
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => vi.fn(),
  };
});

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('ClaudeTaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the form correctly', () => {
    renderWithChakra(<ClaudeTaskForm />);
    
    expect(screen.getByText('Ask Claude')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your question or task description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });
  
  it('handles form submission with success response', async () => {
    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, data: 'Mock response from Claude' }),
      ok: true,
    });
    
    renderWithChakra(<ClaudeTaskForm />);
    
    // Fill in the form
    const textarea = screen.getByPlaceholderText(/Enter your question or task description/i);
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);
    
    // Check loading state
    expect(submitButton).toHaveAttribute('disabled');
    
    // Wait for the response
    await waitFor(() => {
      expect(screen.getByText('Response:')).toBeInTheDocument();
      expect(screen.getByText('Mock response from Claude')).toBeInTheDocument();
    });
    
    // Verify fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith('/api/claude/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'Test prompt' }),
    });
  });
  
  it('handles form submission with error response', async () => {
    // Mock error fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: false, error: 'API error' }),
      ok: true,
    });
    
    renderWithChakra(<ClaudeTaskForm />);
    
    // Fill in the form
    const textarea = screen.getByPlaceholderText(/Enter your question or task description/i);
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);
    
    // Wait for the error to be handled
    await waitFor(() => {
      expect(submitButton).not.toHaveAttribute('disabled');
    });
    
    // Result should not be displayed
    expect(screen.queryByText('Response:')).not.toBeInTheDocument();
  });
  
  it('handles network errors', async () => {
    // Mock network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    renderWithChakra(<ClaudeTaskForm />);
    
    // Fill in the form
    const textarea = screen.getByPlaceholderText(/Enter your question or task description/i);
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);
    
    // Wait for the error to be handled
    await waitFor(() => {
      expect(submitButton).not.toHaveAttribute('disabled');
    });
    
    // Result should not be displayed
    expect(screen.queryByText('Response:')).not.toBeInTheDocument();
  });
});
