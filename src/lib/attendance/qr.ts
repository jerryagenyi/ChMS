import QRCode from 'qrcode';

export interface QRData {
  serviceId: string;
  memberId?: string;
  type: 'SERVICE' | 'MEMBER';
}

export async function generateQRCode(data: QRData): Promise<string> {
  const qrData = JSON.stringify(data);
  return await QRCode.toDataURL(qrData);
}

export function parseQRCode(qrData: string): QRData {
  try {
    return JSON.parse(qrData) as QRData;
  } catch (error) {
    throw new Error('Invalid QR code data');
  }
} 