import { z } from 'zod';

// Common validation patterns
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional();

export const dateSchema = z.string().datetime('Invalid date format');

export const idSchema = z.string().uuid('Invalid ID format');

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  ...paginationSchema.shape,
});

// Validation error formatter
export function formatValidationError(error: z.ZodError) {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

// Type guard for Zod errors
export function isZodError(error: unknown): error is z.ZodError {
  return error instanceof z.ZodError;
}

// Validation helper function
export async function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: { field: string; message: string }[] }> {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (isZodError(error)) {
      return { success: false, errors: formatValidationError(error) };
    }
    throw error;
  }
} 