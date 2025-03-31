import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/users/profile-image/route';
import { prismaMock } from '@/tests/mocks/prisma';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

describe('Profile Image API', () => {
  const mockSession = {
    user: { id: 'user123', email: 'test@example.com' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe('POST /api/users/profile-image', () => {
    it('handles valid image upload', async () => {
      const imageBuffer = Buffer.from('fake-image-data');
      const formData = new FormData();
      formData.append('image', new Blob([imageBuffer], { type: 'image/png' }), 'test.png');

      const request = new NextRequest('http://localhost:3000/api/users/profile-image', {
        method: 'POST',
        body: formData,
      });

      prismaMock.user.update.mockResolvedValue({
        id: 'user123',
        image: imageBuffer,
        imageType: 'image/webp',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.url).toMatch(/^data:image\/webp;base64,/);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: expect.objectContaining({
          imageType: 'image/webp',
        }),
      });
    });

    it('rejects files that are too large', async () => {
      const largeBuffer = Buffer.alloc(3 * 1024 * 1024); // 3MB
      const formData = new FormData();
      formData.append('image', new Blob([largeBuffer], { type: 'image/png' }), 'large.png');

      const request = new NextRequest('http://localhost:3000/api/users/profile-image', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('File too large');
    });

    it('rejects non-image files', async () => {
      const formData = new FormData();
      formData.append('image', new Blob(['test'], { type: 'text/plain' }), 'test.txt');

      const request = new NextRequest('http://localhost:3000/api/users/profile-image', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid file type');
    });
  });

  describe('GET /api/users/profile-image', () => {
    it('returns stored image', async () => {
      const imageBuffer = Buffer.from('fake-image-data');
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user123',
        image: imageBuffer,
        imageType: 'image/webp',
      });

      const request = new NextRequest('http://localhost:3000/api/users/profile-image');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('image/webp');
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000');

      const responseBuffer = await response.arrayBuffer();
      expect(Buffer.from(responseBuffer)).toEqual(imageBuffer);
    });

    it('handles missing image', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user123',
        image: null,
        imageType: null,
      });

      const request = new NextRequest('http://localhost:3000/api/users/profile-image');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('No image found');
    });
  });
});