import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingsForm from '@/components/settings/SettingsForm';
import { ChakraProvider } from '@chakra-ui/react';

// Mock next/navigation
const mockRouter = {
  refresh: vi.fn(),
  push: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

const mockOrganisation = {
  id: '1',
  name: 'Test Org',
  description: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  settings: {
    id: '1',
    organisationId: '1',
    primaryColor: '#000000',
    secondaryColor: '#666666',
    backgroundColor: '#FFFFFF',
    accentColor: '#F5F5F5',
    language: 'en',
    currency: 'GBP',
    timezone: 'Europe/London',
    logoUrl: null,
    faviconUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('SettingsForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders all form elements', () => {
    renderWithProviders(<SettingsForm organisation={mockOrganisation} />);

    expect(screen.getByTestId('primary-color-input')).toBeInTheDocument();
    expect(screen.getByTestId('secondary-color-input')).toBeInTheDocument();
    expect(screen.getByTestId('logo-url-input')).toBeInTheDocument();
    expect(screen.getByTestId('favicon-url-input')).toBeInTheDocument();
    expect(screen.getByTestId('save-settings-button')).toBeInTheDocument();
  });

  it('loads existing settings', () => {
    renderWithProviders(<SettingsForm organisation={mockOrganisation} />);

    const primaryColorInput = screen.getByTestId('primary-color-input') as HTMLInputElement;
    expect(primaryColorInput.value).toBe('#000000');
  });

  it('handles form submission', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOrganisation.settings),
    });
    global.fetch = mockFetch;

    renderWithProviders(<SettingsForm organisation={mockOrganisation} />);

    const primaryColorInput = screen.getByTestId('primary-color-input');
    fireEvent.change(primaryColorInput, { target: { value: '#FF0000' } });

    const submitButton = screen.getByTestId('save-settings-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"primaryColor":"#FF0000"'),
      });
    });
  });

  it('handles validation errors', async () => {
    renderWithProviders(<SettingsForm organisation={mockOrganisation} />);

    // Get the input and change its value to an invalid color
    const primaryColorInput = screen.getByTestId('primary-color-input');
    fireEvent.change(primaryColorInput, { target: { value: 'invalid' } });

    // Submit the form
    const submitButton = screen.getByTestId('save-settings-button');
    fireEvent.click(submitButton);

    // Wait for and verify the validation error
    await waitFor(() => {
      const errorMessage = screen.getByTestId('primary-color-error');
      expect(errorMessage).toHaveTextContent('Invalid hex color');
    });

    // Verify the form wasn't submitted
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('handles API errors', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
    });
    global.fetch = mockFetch;

    renderWithProviders(<SettingsForm organisation={mockOrganisation} />);

    const submitButton = screen.getByTestId('save-settings-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to update settings. Please try again.')).toBeInTheDocument();
    });
  });
});
