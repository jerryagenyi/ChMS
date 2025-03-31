import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemberForm } from '@/components/members/MemberForm';
import { MemberList } from '@/components/members/MemberList';
import { SearchBar } from '@/components/common/SearchBar';
import { ProfileImageUpload } from '@/components/members/ProfileImageUpload';
import { useMemberStore } from '@/store/members';

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test data
const mockMember = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  address: '123 Church St',
  profileImage: null,
};

const mockImage = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

describe('Member Management Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMemberStore.setState({ members: [] });
  });

  describe('Create → Update', () => {
    it('creates new member successfully', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMember),
        })
      );

      render(<MemberForm />);

      // Fill form
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: mockMember.firstName },
      });
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: mockMember.lastName },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: mockMember.email },
      });
      fireEvent.change(screen.getByLabelText(/phone/i), {
        target: { value: mockMember.phone },
      });
      fireEvent.change(screen.getByLabelText(/address/i), {
        target: { value: mockMember.address },
      });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/members',
          expect.objectContaining({
            method: 'POST',
            body: expect.any(String),
          })
        );
      });
    });

    it('updates existing member', async () => {
      const updatedMember = { ...mockMember, firstName: 'Johnny' };
      mockFetch
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockMember),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(updatedMember),
          })
        );

      render(<MemberForm memberId={mockMember.id} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toHaveValue(mockMember.firstName);
      });

      // Update first name
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'Johnny' },
      });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          `/api/members/${mockMember.id}`,
          expect.objectContaining({
            method: 'PUT',
            body: expect.any(String),
          })
        );
      });
    });
  });

  describe('Search → Basic Ops', () => {
    it('searches and filters members', async () => {
      const members = [
        mockMember,
        { ...mockMember, id: '456', firstName: 'Jane', lastName: 'Smith' },
      ];

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(members),
        })
      );

      render(
        <>
          <SearchBar />
          <MemberList />
        </>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      // Search for 'John'
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'John' },
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });
    });

    it('handles pagination and sorting', async () => {
      const members = Array.from({ length: 25 }, (_, i) => ({
        ...mockMember,
        id: `${i}`,
        firstName: `Member ${i}`,
      }));

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(members),
        })
      );

      render(<MemberList />);

      await waitFor(() => {
        expect(screen.getByText('Member 0')).toBeInTheDocument();
      });

      // Test sorting
      fireEvent.click(screen.getByText(/name/i));
      await waitFor(() => {
        const items = screen.getAllByRole('row');
        expect(items[1]).toHaveTextContent('Member 0');
      });

      // Test pagination
      fireEvent.click(screen.getByText('2'));
      await waitFor(() => {
        expect(screen.getByText('Member 20')).toBeInTheDocument();
      });
    });
  });

  describe('Profile Image Management', () => {
    it('uploads and displays profile image', async () => {
      mockFetch
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                url: 'https://example.com/image.jpg',
              }),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                ...mockMember,
                profileImage: 'https://example.com/image.jpg',
              }),
          })
        );

      render(
        <ProfileImageUpload memberId={mockMember.id} currentImage={mockMember.profileImage} />
      );

      const input = screen.getByLabelText(/upload image/i);
      Object.defineProperty(input, 'files', {
        value: [mockImage],
      });
      fireEvent.change(input);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/members/123/image'),
          expect.any(Object)
        );
      });

      // Verify image display
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('validates image upload requirements', async () => {
      const largeFile = new File(['test'.repeat(1000000)], 'large.jpg', {
        type: 'image/jpeg',
      });

      render(
        <ProfileImageUpload memberId={mockMember.id} currentImage={mockMember.profileImage} />
      );

      const input = screen.getByLabelText(/upload image/i);
      Object.defineProperty(input, 'files', {
        value: [largeFile],
      });
      fireEvent.change(input);

      await waitFor(() => {
        expect(screen.getByText(/file size too large/i)).toBeInTheDocument();
      });
    });

    it('handles image upload errors', async () => {
      mockFetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

      render(
        <ProfileImageUpload memberId={mockMember.id} currentImage={mockMember.profileImage} />
      );

      const input = screen.getByLabelText(/upload image/i);
      Object.defineProperty(input, 'files', {
        value: [mockImage],
      });
      fireEvent.change(input);

      await waitFor(() => {
        expect(screen.getByText(/failed to upload image/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles validation errors', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () =>
            Promise.resolve({
              error: 'Validation failed',
              details: { email: 'Invalid email format' },
            }),
        })
      );

      render(<MemberForm />);

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'invalid-email' },
      });
      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('handles network errors gracefully', async () => {
      mockFetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

      render(<MemberForm />);

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: mockMember.firstName },
      });
      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });
});
