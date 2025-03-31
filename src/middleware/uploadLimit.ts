import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SECURITY_CONSTANTS } from '@/config/security';
import securityMetrics from '@/lib/monitoring';

export async function uploadLimitMiddleware(request: NextRequest) {
  // Only check POST/PUT requests with content-type including multipart/form-data
  if (
    !['POST', 'PUT'].includes(request.method) ||
    !request.headers.get('content-type')?.includes('multipart/form-data')
  ) {
    return NextResponse.next();
  }

  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  const path = request.nextUrl.pathname;

  try {
    if (contentLength > SECURITY_CONSTANTS.MAX_FILE_SIZE) {
      // Log failed upload attempt
      securityMetrics.logUploadSize(path, contentLength, false);

      return new NextResponse(
        JSON.stringify({
          error: 'File too large',
          message: `File size exceeds the maximum limit of ${Math.floor(SECURITY_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024))}MB`,
        }),
        {
          status: 413,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Log successful upload size check
    securityMetrics.logUploadSize(path, contentLength, true);
    return NextResponse.next();
  } catch (error) {
    securityMetrics.logError('upload_size', error as Error, { path, size: contentLength });
    // Fail open - allow request if size check fails
    return NextResponse.next();
  }
} 