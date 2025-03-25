import { generateServiceQR, validateQRCode } from '@/lib/attendance/qr';
import { prismaMock } from '../mocks/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: prismaMock
}));

describe('QR Code System', () => {
  const mockService = {
    id: '1',
    name: 'Sunday Service',
    locationId: 'loc1',
    startTime: new Date(),
    endTime: new Date(),
    qrCode: null
  };

  it('generates unique QR code for service', async () => {
    prismaMock.service.update.mockResolvedValue({
      ...mockService,
      qrCode: expect.any(String)
    });

    const qrCode = await generateServiceQR(mockService.id);
    
    expect(qrCode).toBeTruthy();
    expect(typeof qrCode).toBe('string');
    expect(qrCode.length).toBeGreaterThan(0);
  });

  it('validates QR code format', async () => {
    const qrCode = 'SERVICE_1_20240215';
    
    const isValid = await validateQRCode(qrCode);
    
    expect(isValid).toBe(true);
  });

  it('rejects expired QR codes', async () => {
    const oldQRCode = 'SERVICE_1_20230101';
    
    const isValid = await validateQRCode(oldQRCode);
    
    expect(isValid).toBe(false);
  });
});