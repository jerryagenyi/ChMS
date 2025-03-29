import { Permission, Role, ROLE_PERMISSIONS } from '../../types/auth';

export class PermissionChecker {
  private permissions: Permission[];

  constructor(role: Role) {
    this.permissions = ROLE_PERMISSIONS[role].permissions;
  }

  hasPermission(permission: Permission): boolean {
    return this.permissions.includes(permission);
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  getPermissions(): Permission[] {
    return [...this.permissions];
  }
}

export function checkPermission(userRole: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole].permissions.includes(permission);
}

export function checkPermissions(userRole: Role, permissions: Permission[], requireAll: boolean = false): boolean {
  if (requireAll) {
    return permissions.every(permission => checkPermission(userRole, permission));
  }
  return permissions.some(permission => checkPermission(userRole, permission));
}

export function getRolePermissions(role: Role): Permission[] {
  return [...ROLE_PERMISSIONS[role].permissions];
}

export function getRoleDescription(role: Role): string {
  return ROLE_PERMISSIONS[role].description;
} 