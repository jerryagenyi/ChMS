import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/features/forms/RegisterForm';
import { EventForm } from '@/components/events/EventForm';
import SettingsForm from '@/components/features/settings/SettingsForm';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

const mockOrganization = {
  id: '1',
  name: 'Test Church',
  description: 'Test Description',
  createdAt: new Date(),
  updatedAt: new Date(),
  settings: {
    id: '1',
    organizationId: '1',
    timezone: 'UTC',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  },
};

describe('Form Validation Tests', () => {
  // Login Form Tests
  describe('LoginForm', () => {
    it('validates required fields', async () => {
      renderWithProviders(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('validates email format', async () => {
      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
    });

    it('shows loading state during submission', async () => {
      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      expect(submitButton).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('Signing in')).toBeInTheDocument();
    });
  });

  // Settings Form Tests
  describe('SettingsForm', () => {
    it('validates color format', async () => {
      renderWithProviders(<SettingsForm organization={mockOrganization} />);

      const colorInput = screen.getByTestId('primary-color-input');
      fireEvent.change(colorInput, { target: { value: 'invalid-color' } });

      const submitButton = screen.getByTestId('save-settings-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid hex color')).toBeInTheDocument();
      });
    });

    it('validates URL format for logo and favicon', async () => {
      renderWithProviders(<SettingsForm organization={mockOrganization} />);

      const logoInput = screen.getByTestId('logo-url-input');
      fireEvent.change(logoInput, { target: { value: 'invalid-url' } });

      const submitButton = screen.getByTestId('save-settings-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid url')).toBeInTheDocument();
      });
    });

    it('validates required fields in localization section', async () => {
      renderWithProviders(<SettingsForm organization={mockOrganization} />);

      const submitButton = screen.getByTestId('save-settings-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getAllByText('Required')).toHaveLength(3); // language, currency, timezone
      });
    });
  });

  // Event Form Tests
  describe('EventForm', () => {
    const mockOnSubmit = vi.fn();

    it('validates required fields', async () => {
      renderWithProviders(<EventForm onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByRole('button', { name: /create event/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Event name is required')).toBeInTheDocument();
        expect(screen.getByText('Start date is required')).toBeInTheDocument();
      });
    });

    it('validates date range', async () => {
      renderWithProviders(<EventForm onSubmit={mockOnSubmit} />);

      const startDateInput = screen.getByLabelText(/start date/i);
      const endDateInput = screen.getByLabelText(/end date/i);

      fireEvent.change(startDateInput, { target: { value: '2024-03-15T10:00' } });
      fireEvent.change(endDateInput, { target: { value: '2024-03-14T10:00' } });

      const submitButton = screen.getByRole('button', { name: /create event/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('End date must be after start date')).toBeInTheDocument();
      });
    });

    it('validates capacity as a positive number', async () => {
      renderWithProviders(<EventForm onSubmit={mockOnSubmit} />);

      const capacityInput = screen.getByLabelText(/capacity/i);
      fireEvent.change(capacityInput, { target: { value: '-5' } });

      const submitButton = screen.getByRole('button', { name: /create event/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Capacity must be a positive number')).toBeInTheDocument();
      });
    });
  });

  // Register Form Tests
  describe('RegisterForm', () => {
    it('validates required fields', async () => {
      renderWithProviders(<RegisterForm />);

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    it('validates social media URLs', async () => {
      renderWithProviders(<RegisterForm />);

      const tiktokInput = screen.getByPlaceholderText(/tiktok/i);
      fireEvent.change(tiktokInput, { target: { value: 'invalid-url' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid TikTok URL')).toBeInTheDocument();
      });
    });

    it('shows loading state during submission', async () => {
      renderWithProviders(<RegisterForm />);

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      expect(submitButton).toHaveAttribute('disabled');
      expect(screen.getByText('Creating account...')).toBeInTheDocument();
    });
  });
});
