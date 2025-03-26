import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AppError, handleError } from '../lib/errors';
import { logger } from '../lib/logger';

export function errorHandler(
  handler: (req: NextRequest) => Promise<Response>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      const appError = handleError(error);

      // Log error details using our logger
      logger.error('API Error', appError, undefined, {
        path: req.nextUrl.pathname,
        method: req.method,
        query: Object.fromEntries(req.nextUrl.searchParams),
      });

      return NextResponse.json(
        {
          error: {
            message: appError.message,
            code: appError.code,
            details: appError.details,
          },
        },
        { status: appError.statusCode }
      );
    }
  };
} 