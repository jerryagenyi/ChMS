import { vi } from 'vitest';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';
import { ImageService } from '@/services/image/ImageService';
import { prisma } from '@/lib/prisma';

// Mock sharp
vi.mock('sharp', () => ({
  default: vi.fn(() => ({
    resize: vi.fn().mockReturnThis(),
    toFormat: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from('mock-image-data')),
  })),
}));

// Mock Prisma
type MockPrismaClient = {
  image: {
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };
};

vi.mock('@/lib/prisma', () => ({
  prisma: {
    image: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
  } as MockPrismaClient,
}));

describe('ImageService', () => {
  let service: ImageService;
  const mockImageBuffer = Buffer.from('mock-image-data');

  beforeEach(() => {
    service = new ImageService();
    vi.clearAllMocks();
  });

  describe('optimizeImage', () => {
    test('should optimize image with correct parameters', async () => {
      const width = 800;
      const height = 600;
      const format = 'webp';

      await service.optimizeImage(mockImageBuffer, { width, height, format });

      expect(sharp).toHaveBeenCalledWith(mockImageBuffer);
      expect(sharp().resize).toHaveBeenCalledWith(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
      expect(sharp().toFormat).toHaveBeenCalledWith(format, {
        quality: 80,
      });
    });

    test('should handle optimization errors', async () => {
      const error = new Error('Optimization failed');
      (sharp as any).mockImplementationOnce(() => {
        throw error;
      });

      await expect(
        service.optimizeImage(mockImageBuffer, {
          width: 800,
          height: 600,
          format: 'webp',
        })
      ).rejects.toThrow('Image optimization failed');
    });
  });

  describe('convertFormat', () => {
    test('should convert image to specified format', async () => {
      const format = 'webp';

      await service.convertFormat(mockImageBuffer, format);

      expect(sharp).toHaveBeenCalledWith(mockImageBuffer);
      expect(sharp().toFormat).toHaveBeenCalledWith(format, {
        quality: 80,
      });
    });

    test('should handle conversion errors', async () => {
      const error = new Error('Conversion failed');
      (sharp as any).mockImplementationOnce(() => {
        throw error;
      });

      await expect(
        service.convertFormat(mockImageBuffer, 'webp')
      ).rejects.toThrow('Image conversion failed');
    });
  });

  describe('storeImage', () => {
    const mockImageData = {
      id: '1',
      path: '/images/test.webp',
      size: 1024,
      format: 'webp',
    };

    test('should store image metadata in database', async () => {
      (prisma.image.create as any).mockResolvedValue(mockImageData);

      const result = await service.storeImage({
        buffer: mockImageBuffer,
        originalName: 'test.jpg',
        size: 1024,
      });

      expect(prisma.image.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          path: expect.any(String),
          size: 1024,
          format: 'webp',
        }),
      });
      expect(result).toEqual(mockImageData);
    });

    test('should handle storage errors', async () => {
      const error = new Error('Storage failed');
      (prisma.image.create as any).mockRejectedValue(error);

      await expect(
        service.storeImage({
          buffer: mockImageBuffer,
          originalName: 'test.jpg',
          size: 1024,
        })
      ).rejects.toThrow('Failed to store image');
    });
  });

  describe('deleteImage', () => {
    test('should delete image from database', async () => {
      const imageId = '1';
      (prisma.image.delete as any).mockResolvedValue({ id: imageId });

      await service.deleteImage(imageId);

      expect(prisma.image.delete).toHaveBeenCalledWith({
        where: { id: imageId },
      });
    });

    test('should handle deletion errors', async () => {
      const error = new Error('Deletion failed');
      (prisma.image.delete as any).mockRejectedValue(error);

      await expect(service.deleteImage('1')).rejects.toThrow('Failed to delete image');
    });
  });

  describe('getImage', () => {
    const mockImage = {
      id: '1',
      path: '/images/test.webp',
      size: 1024,
      format: 'webp',
    };

    test('should retrieve image metadata from database', async () => {
      (prisma.image.findUnique as any).mockResolvedValue(mockImage);

      const result = await service.getImage('1');

      expect(prisma.image.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockImage);
    });

    test('should handle retrieval errors', async () => {
      const error = new Error('Retrieval failed');
      (prisma.image.findUnique as any).mockRejectedValue(error);

      await expect(service.getImage('1')).rejects.toThrow('Failed to retrieve image');
    });

    test('should return null for non-existent image', async () => {
      (prisma.image.findUnique as any).mockResolvedValue(null);

      const result = await service.getImage('1');

      expect(result).toBeNull();
    });
  });
});