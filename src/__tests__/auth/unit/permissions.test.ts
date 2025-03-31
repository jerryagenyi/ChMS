import { describe, it, expect, beforeEach } from 'vitest';
import { Role, ROLE_PERMISSIONS } from '@/types/auth';

describe('Permissions', () => {
  describe('ROLE_PERMISSIONS', () => {
    it('should define permissions for all roles', () => {
      expect(ROLE_PERMISSIONS).toHaveProperty('SUPER_ADMIN');
      expect(ROLE_PERMISSIONS).toHaveProperty('ADMIN');
      expect(ROLE_PERMISSIONS).toHaveProperty('MANAGER');
      expect(ROLE_PERMISSIONS).toHaveProperty('VIEWER');
    });

    it('should have appropriate permissions for SUPER_ADMIN', () => {
      const superAdminPerms = ROLE_PERMISSIONS[Role.SUPER_ADMIN].permissions;
      expect(superAdminPerms).toContain('manage:all');
      expect(superAdminPerms).toContain('manage:users');
      expect(superAdminPerms).toContain('manage:organizations');
    });
  });
});