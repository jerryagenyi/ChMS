import { z } from 'zod';

export interface QRData {
  classId: string;
  timestamp: number;
  expiryMinutes: number;
}

export const qrDataSchema = z.object({
  classId: z.string().uuid(),
  timestamp: z.number(),
  expiryMinutes: z.number(),
});

export function generateQRData(classId: string, expiryMinutes: number): QRData {
  return {
    classId,
    timestamp: Date.now(),
    expiryMinutes,
  };
}

export function validateQRData(data: unknown): QRData {
  const parsed = qrDataSchema.parse(data);
  
  // Check if QR code has expired
  const expiryTime = parsed.timestamp + (parsed.expiryMinutes * 60 * 1000);
  if (Date.now() > expiryTime) {
    throw new Error('QR code has expired');
  }

  return parsed;
}

export function encodeQRData(data: QRData): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

export function decodeQRData(encoded: string): QRData {
  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    return validateQRData(JSON.parse(decoded));
  } catch (error) {
    throw new Error('Invalid QR code data');
  }
} 