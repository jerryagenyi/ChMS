
import sharp from 'sharp';

export const PROFILE_IMAGE_SIZE = 256; // pixels
export const PROFILE_IMAGE_QUALITY = 80; // 0-100

export async function optimizeImage(file: Buffer): Promise<{ 
  data: Buffer;
  type: string;
}> {
  const optimizedImage = await sharp(file)
    .resize(PROFILE_IMAGE_SIZE, PROFILE_IMAGE_SIZE, {
      fit: 'cover',
      position: 'center',
    })
    .webp({ quality: PROFILE_IMAGE_QUALITY })
    .toBuffer();

  return {
    data: optimizedImage,
    type: 'image/webp'
  };
}

// Helper to convert stored binary data to base64 for frontend display
export function imageToBase64(data: Buffer, type: string): string {
  return `data:${type};base64,${data.toString('base64')}`;
}
