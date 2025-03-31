import { z } from 'zod';

export const createBaseSchema = <T extends z.ZodRawShape>(schema: T) => {
  return z.object({
    ...schema,
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  });
};

export const createInputSchema = <T extends z.ZodRawShape>(schema: T) => {
  return createBaseSchema(schema).strict();
};