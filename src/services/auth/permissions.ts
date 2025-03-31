import { prisma } from '@/lib/prisma';
import { Permission, Role, ROLE_PERMISSIONS } from '@/types/auth';

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

export function checkPermissions(
  userRole: Role, 
  permissions: Permission[], 
  requireAll: boolean = false
): boolean {
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

// New function for checking permissions directly with userId
export async function hasUserPermission(userId: string, permission: Permission): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user) return false;
  return checkPermission(user.role as Role, permission);
}
