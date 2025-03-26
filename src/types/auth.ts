export type Permission = 
  | 'read:members'
  | 'write:members'
  | 'delete:members'
  | 'read:attendance'
  | 'write:attendance'
  | 'read:reports'
  | 'write:reports'
  | 'manage:settings'
  | 'manage:users'
  | 'manage:roles'
  | 'manage:departments'
  | 'manage:classes'
  | 'manage:families'
  | 'manage:visitors'
  | 'manage:communications';

export type Role = 
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'staff'
  | 'viewer';

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
  description: string;
}

export interface UserRole {
  userId: string;
  role: Role;
  organisationId: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions: Permission[];
  organisationId: string;
}

export const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
  super_admin: {
    role: 'super_admin',
    permissions: [
      'read:members',
      'write:members',
      'delete:members',
      'read:attendance',
      'write:attendance',
      'read:reports',
      'write:reports',
      'manage:settings',
      'manage:users',
      'manage:roles',
      'manage:departments',
      'manage:classes',
      'manage:families',
      'manage:visitors',
      'manage:communications',
    ],
    description: 'Full system access with all permissions',
  },
  admin: {
    role: 'admin',
    permissions: [
      'read:members',
      'write:members',
      'read:attendance',
      'write:attendance',
      'read:reports',
      'write:reports',
      'manage:settings',
      'manage:departments',
      'manage:classes',
      'manage:families',
      'manage:visitors',
      'manage:communications',
    ],
    description: 'Organisation-level administrative access',
  },
  manager: {
    role: 'manager',
    permissions: [
      'read:members',
      'write:members',
      'read:attendance',
      'write:attendance',
      'read:reports',
      'write:reports',
      'manage:departments',
      'manage:classes',
      'manage:families',
      'manage:visitors',
    ],
    description: 'Department-level management access',
  },
  staff: {
    role: 'staff',
    permissions: [
      'read:members',
      'write:members',
      'read:attendance',
      'write:attendance',
      'read:reports',
    ],
    description: 'Basic staff access for daily operations',
  },
  viewer: {
    role: 'viewer',
    permissions: [
      'read:members',
      'read:attendance',
      'read:reports',
    ],
    description: 'Read-only access for viewing data',
  },
}; 