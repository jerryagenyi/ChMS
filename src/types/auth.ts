export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  VIEWER = 'VIEWER'
}

export type Permission =
  // Member Management
  | 'read:members'
  | 'write:members'
  | 'delete:members'
  
  // Attendance Management
  | 'read:attendance'
  | 'write:attendance'
  | 'manage:attendance'
  
  // Event Management
  | 'read:events'
  | 'write:events'
  | 'manage:events'
  
  // Report Management
  | 'read:reports'
  | 'write:reports'
  | 'manage:reports'
  
  // Settings & Configuration
  | 'manage:settings'
  | 'manage:users'
  | 'manage:roles'
  
  // Ministry Units Management
  | 'read:ministry_units'
  | 'write:ministry_units'
  | 'manage:ministry_units'
  
  // Class Management
  | 'read:classes'
  | 'write:classes'
  | 'manage:classes'
  
  // Family Management
  | 'read:families'
  | 'write:families'
  | 'manage:families'
  
  // Visitor Management
  | 'read:visitors'
  | 'write:visitors'
  | 'manage:visitors'
  
  // Communication
  | 'read:communications'
  | 'write:communications'
  | 'manage:communications';

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
  description: string;
}

export interface UserRole {
  userId: string;
  role: Role;
  organizationId: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions: Permission[];
  organizationId: string;
}

export const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
  SUPER_ADMIN: {
    role: Role.SUPER_ADMIN,
    permissions: [/* all permissions */],
    description: 'Full system access with all permissions',
  },
  ADMIN: {
    role: Role.ADMIN,
    permissions: [
      'read:members', 'write:members',
      'read:attendance', 'write:attendance', 'manage:attendance',
      'read:events', 'write:events', 'manage:events',
      'read:reports', 'write:reports',
      'manage:settings',
      'manage:ministry_units',
      'manage:classes',
      'manage:families',
      'manage:visitors',
      'manage:communications'
    ],
    description: 'Organization-level administrative access',
  },
  MANAGER: {
    role: Role.MANAGER,
    permissions: [
      'read:members', 'write:members',
      'read:attendance', 'write:attendance',
      'read:events', 'write:events',
      'read:reports', 'write:reports',
      'read:ministry_units', 'write:ministry_units',
      'read:classes', 'write:classes',
      'read:families', 'write:families',
      'read:visitors', 'write:visitors'
    ],
    description: 'Department/Ministry unit management access',
  },
  STAFF: {
    role: Role.STAFF,
    permissions: [
      'read:members', 'write:members',
      'read:attendance', 'write:attendance',
      'read:events',
      'read:reports',
      'read:ministry_units',
      'read:classes',
      'read:families',
      'read:visitors'
    ],
    description: 'Basic staff access for daily operations',
  },
  VIEWER: {
    role: Role.VIEWER,
    permissions: [
      'read:members',
      'read:attendance',
      'read:events',
      'read:reports'
    ],
    description: 'Read-only access for viewing data',
  },
}; 
