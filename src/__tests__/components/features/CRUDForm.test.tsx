import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CRUDForm } from '@/components/features/CRUDForm';
import { ChakraProvider } from '@chakra-ui/react';

describe('CRUDForm', () => {
  const mockFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validation: (value: string) => {
        if (!value.includes('@')) {
          return 'Invalid email format';
        }
        return '';
      },
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      required: false,
    },
  ];

  const mockOnSubmit = vi.fn();

  const renderComponent = (props = {}) => {
    return render(
      <ChakraProvider>
        <CRUDForm fields={mockFields} onSubmit={mockOnSubmit} {...props} />
      </ChakraProvider>
    );
  };

  it('renders all fields correctly', () => {
    renderComponent();

    // Check for input fields
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Age' })).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    renderComponent();

    const nameInput = screen.getByRole('textbox', { name: 'Name' });
    const emailInput = screen.getByRole('textbox', { name: 'Email' });
    const ageInput = screen.getByRole('spinbutton', { name: 'Age' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(ageInput, { target: { value: '30' } });

    const submitButton = screen.getByRole('button');
    fireEvent.submit(submitButton.closest('form')!);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        age: '30',
      });
    });
  });

  it('shows validation errors for required fields', async () => {
    renderComponent();

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      const nameError = screen.getByText('Name is required');
      const emailError = screen.getByText('Email is required');
      expect(nameError).toBeInTheDocument();
      expect(emailError).toBeInTheDocument();
    });
  });

  it('shows custom validation errors', async () => {
    renderComponent();

    const emailInput = screen.getByRole('textbox', { name: 'Email' });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      const emailError = screen.getByText('Invalid email format');
      expect(emailError).toBeInTheDocument();
    });
  });

  it('initializes with provided values', () => {
    const initialValues = {
      name: 'John Doe',
      email: 'john@example.com',
      age: '30',
    };

    renderComponent({ initialValues, isEdit: true });

    const nameInput = screen.getByRole('textbox', { name: 'Name' });
    const emailInput = screen.getByRole('textbox', { name: 'Email' });
    const ageInput = screen.getByRole('spinbutton', { name: 'Age' });
    const updateButton = screen.getByRole('button', { name: 'Update' });

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(ageInput).toHaveValue(30);
    expect(updateButton).toBeInTheDocument();
  });

  it('handles submission errors', async () => {
    const mockError = new Error('Submission failed');
    const mockOnSubmitWithError = vi.fn().mockRejectedValue(mockError);

    renderComponent({ onSubmit: mockOnSubmitWithError });

    const nameInput = screen.getByRole('textbox', { name: 'Name' });
    const emailInput = screen.getByRole('textbox', { name: 'Email' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Submission failed')).toBeInTheDocument();
    });
  });
});
