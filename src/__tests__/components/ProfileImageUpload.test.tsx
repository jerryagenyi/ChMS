import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ProfileImageUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the upload button and help text', () => {
    render(<ProfileImageUpload />);

    expect(screen.getByLabelText('Choose profile picture')).toBeInTheDocument();
    expect(screen.getByText('Accepted formats: JPG, PNG, GIF (max 5MB)')).toBeInTheDocument();
  });

  it('shows loading state during upload', async () => {
    mockFetch.mockImplementationOnce(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ url: 'https://example.com/image.jpg' }),
              }),
            100
          )
        )
    );

    render(<ProfileImageUpload />);

    const input = screen.getByLabelText('Choose profile picture');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });

  it('displays the uploaded image after successful upload', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ url: 'https://example.com/image.jpg' }),
      })
    );

    render(<ProfileImageUpload />);

    const input = screen.getByLabelText('Choose profile picture');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText('Profile picture preview')).toBeInTheDocument();
    });

    expect(screen.getByText('Change profile picture')).toBeInTheDocument();
  });

  it('handles upload errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Upload failed' }),
      })
    );

    render(<ProfileImageUpload />);

    const input = screen.getByLabelText('Choose profile picture');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Upload error:', expect.any(Error));
    });

    consoleError.mockRestore();
  });

  it('maintains accessibility during state changes', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ url: 'https://example.com/image.jpg' }),
      })
    );

    render(<ProfileImageUpload />);

    // Check initial accessibility attributes
    expect(screen.getByRole('group')).toHaveAttribute('aria-labelledby', 'profile-image-group');
    expect(screen.getByLabelText('Choose profile picture')).toBeInTheDocument();

    const input = screen.getByLabelText('Choose profile picture');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file] } });

    // Check loading state accessibility
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');

    await waitFor(() => {
      // Check final state accessibility
      expect(screen.getByAltText('Profile picture preview')).toBeInTheDocument();
    });
  });

  it('validates file input', () => {
    render(<ProfileImageUpload />);

    const input = screen.getByLabelText('Choose profile picture');

    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toHaveAttribute('type', 'file');
  });

  it('disables input during upload', async () => {
    mockFetch.mockImplementationOnce(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ url: 'https://example.com/image.jpg' }),
              }),
            100
          )
        )
    );

    render(<ProfileImageUpload />);

    const input = screen.getByLabelText('Choose profile picture');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(input).toBeDisabled();

    await waitFor(() => {
      expect(input).not.toBeDisabled();
    });
  });

  it('sends correct data to the server', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ url: 'https://example.com/image.jpg' }),
      })
    );

    render(<ProfileImageUpload />);

    const input = screen.getByLabelText('Choose profile picture');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/users/profile-image', {
        method: 'POST',
        body: expect.any(FormData),
      });
    });

    const formData = mockFetch.mock.calls[0][1].body;
    expect(formData.get('image')).toBeInstanceOf(File);
    expect(formData.get('image').name).toBe('test.jpg');
  });
});
