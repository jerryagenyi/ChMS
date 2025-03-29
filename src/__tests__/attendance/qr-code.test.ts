import { describe, it, expect, beforeEach } from 'vitest';
import { generateServiceQR, validateQRCode } from '@/lib/attendance/qr';
import { createMockPrismaClient } from '@/tests/setup/test-setup';
import type { MockPrismaClient } from '@/tests/setup/test-setup';

describe('QR Code Functions', () => {
  let prismaMock: MockPrismaClient;

  beforeEach(() => {
    prismaMock = createMockPrismaClient();
  });

  describe('generateServiceQR', () => {
    it('generates valid QR code data', async () => {
      const mockService = {
        id: '123',
        name: 'Sunday Service',
        date: new Date('2024-03-01'),
      };

      const qrData = await generateServiceQR(mockService);
      expect(qrData).toBeTruthy();
      expect(qrData).toContain(mockService.id);
    });
  });

  describe('validateQRCode', () => {
    it('validates QR code data correctly', async () => {
      const mockQRData = 'valid-qr-data-123';
      
      prismaMock.service.findUnique.mockResolvedValue({
        id: '123',
        name: 'Sunday Service',
        date: new Date('2024-03-01'),
      } as any);

      const result = await validateQRCode(mockQRData);
      expect(result).toBeTruthy();
    });
  });
});
