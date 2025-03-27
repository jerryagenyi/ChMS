import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateQRData, validateQRData } from '@/lib/qr';

describe('QR Code Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('generateQRData', () => {
    it('generates valid QR data', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      const classId = '123e4567-e89b-12d3-a456-426614174000';
      const expiryMinutes = 5;

      const result = generateQRData(classId, expiryMinutes);

      expect(result).toEqual({
        classId,
        timestamp: now,
        expiryMinutes,
      });
    });
  });

  describe('validateQRData', () => {
    it('validates correct QR data', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      const data = {
        classId: '123e4567-e89b-12d3-a456-426614174000',
        timestamp: now,
        expiryMinutes: 5,
      };

      const result = validateQRData(data);
      expect(result).toEqual(data);
    });

    it('throws error for expired QR code', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      const data = {
        classId: '123e4567-e89b-12d3-a456-426614174000',
        timestamp: now - (6 * 60 * 1000), // 6 minutes ago
        expiryMinutes: 5,
      };

      expect(() => validateQRData(data)).toThrow('QR code has expired');
    });

    it('throws error for invalid data structure', () => {
      const invalidData = {
        classId: 'not-a-uuid',
        timestamp: 'not-a-number',
        expiryMinutes: 'not-a-number',
      };

      expect(() => validateQRData(invalidData)).toThrow();
    });
  });
});