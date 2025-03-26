import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ValidationError } from '../lib/errors';
import { logger } from '../lib/logger';

interface ValidationOptions {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

export function validate(options: ValidationOptions = {}) {
  return async (handler: (req: Request) => Promise<Response>) => {
    return async (req: Request) => {
      try {
        const url = new URL(req.url);
        const validatedData: Record<string, unknown> = {};

        // Validate query parameters
        if (options.query) {
          const queryParams = Object.fromEntries(url.searchParams);
          validatedData.query = await options.query.parseAsync(queryParams);
        }

        // Validate URL parameters
        if (options.params) {
          const params = url.pathname.match(/\[([^\]]+)\]/g)?.reduce((acc, param) => {
            const key = param.slice(1, -1);
            const value = url.pathname.split('/').find((segment, index, array) => 
              array[index - 1] === `[${key}]`
            ) as string;
            if (value) {
              acc[key] = value;
            }
            return acc;
          }, {} as Record<string, string>) || {};
          validatedData.params = await options.params.parseAsync(params);
        }

        // Validate request body
        if (options.body && req.body) {
          const body = await req.json();
          validatedData.body = await options.body.parseAsync(body);
        }

        // Create a new request with validated data
        const validatedRequest = new Request(req.url, {
          headers: req.headers,
          method: req.method,
          body: options.body ? JSON.stringify(validatedData.body) : req.body,
        });

        // @ts-ignore - Adding validated data to request
        validatedRequest.validatedData = validatedData;

        return handler(validatedRequest);
      } catch (error) {
        if (error instanceof z.ZodError) {
          logger.error('Validation error', new ValidationError('Invalid input data', error.errors), undefined, {
            path: new URL(req.url).pathname,
            method: req.method,
          });

          return NextResponse.json(
            {
              error: {
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: error.errors.map(err => ({
                  field: err.path.join('.'),
                  message: err.message,
                })),
              },
            },
            { status: 400 }
          );
        }

        throw error;
      }
    };
  };
} 