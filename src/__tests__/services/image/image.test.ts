import { describe, it, expect } from 'vitest';
import { optimizeImage, imageToBase64 } from '@/services/image/image';
import sharp from 'sharp';

describe('Image Service', () => {
  describe('optimizeImage', () => {
    it('optimizes image to correct size and format', async () => {
      // Create a test image
      const inputImage = await sharp({
        create: {
          width: 1000,
          height: 1000,
          channels: 4,
          background: { r: 255, g: 0, b: 0, alpha: 1 }
        }
      }).png().toBuffer();

      const { data, type } = await optimizeImage(inputImage);
      
      // Verify output format
      expect(type).toBe('image/webp');

      // Verify dimensions
      const metadata = await sharp(data).metadata();
      expect(metadata.width).toBe(256);
      expect(metadata.height).toBe(256);
      expect(metadata.format).toBe('webp');
    });

    it('handles invalid image data', async () => {
      const invalidBuffer = Buffer.from('not an image');
      
      await expect(optimizeImage(invalidBuffer)).rejects.toThrow();
    });
  });

  describe('imageToBase64', () => {
    it('converts buffer to base64 string', () => {
      const buffer = Buffer.from('test data');
      const type = 'image/webp';
      
      const result = imageToBase64(buffer, type);
      
      expect(result).toMatch(/^data:image\/webp;base64,/);
      expect(result).toContain(buffer.toString('base64'));
    });
  });
});