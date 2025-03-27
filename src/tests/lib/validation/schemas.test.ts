import { describe, it, expect } from 'vitest';
import { 
  userSchema, 
  createUserSchema 
} from '@/lib/validation/schemas';

describe('Validation Schemas', () => {
  describe('userSchema', () => {
    it('validates correct user data', () => {
      const validUser = {
        id: 'cuid123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        organisationId: 'org123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('fails for invalid email', () => {
      const invalidUser = {
        id: 'cuid123',
        email: 'invalid-email',
        name: 'Test User',
        role: 'admin',
        organisationId: 'org123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('fails for invalid role', () => {
      const invalidUser = {
        id: 'cuid123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'invalid_role',
        organisationId: 'org123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('createUserSchema', () => {
    it('validates correct create user data', () => {
      const validCreateUser = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        organisationId: 'org123',
      };

      const result = createUserSchema.safeParse(validCreateUser);
      expect(result.success).toBe(true);
    });

    it('fails for missing required fields', () => {
      const invalidCreateUser = {
        email: 'test@example.com',
        role: 'admin',
      };

      const result = createUserSchema.safeParse(invalidCreateUser);
      expect(result.success).toBe(false);
    });
  });
});