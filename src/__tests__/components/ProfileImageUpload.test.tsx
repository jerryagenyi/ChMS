import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { vi } from 'vitest';

describe('ProfileImageUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload input', () => {
    render(<ProfileImageUpload />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows loading state during upload', async () => {
    global.fetch = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<ProfileImageUpload />);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByRole('button');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });

  it('displays uploaded image after successful upload', async () => {
    const mockImageUrl = 'data:image/webp;base64,TEST_IMAGE_DATA';
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ url: mockImageUrl }),
    });

    render(<ProfileImageUpload />);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByRole('button');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByAltText('Profile')).toHaveAttribute('src', mockImageUrl);
    });
  });
});