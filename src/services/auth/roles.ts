
import { prisma } from '@/lib/prisma';
import { Permission, ROLE_PERMISSIONS } from '@/types/auth';
import { AuthorizationError } from '@/lib/errors';
import { Role } from '@prisma/client';

export const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 90,
  MANAGER: 80,
  STAFF: 70,
  MEMBER: 60,
  VIEWER: 50,
};

export function isRoleAtLeast(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canManageRole(userRole: Role, targetRole: Role): boolean {
  // Users can only manage roles lower than their own
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole];
}

export function getManageableRoles(userRole: Role): Role[] {
  return Object.entries(ROLE_HIERARCHY)
    .filter(([_, value]) => value < ROLE_HIERARCHY[userRole])
    .map(([role]) => role as Role);
}

export async function assignRole(userId: string, role: Role, assignedBy: string) {
  // Check if assigner has permission to assign roles
  const assigner = await prisma.user.findUnique({
    where: { id: assignedBy }
  });

  if (!assigner || !['super_admin', 'admin'].includes(assigner.role)) {
    throw new AuthorizationError('Not authorized to assign roles');
  }

  // Update user role
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role }
  });

  // Get permissions for the role
  const permissions = ROLE_PERMISSIONS[role].permissions;

  // Update user permissions
  await prisma.userPermission.deleteMany({
    where: { userId }
  });

  await prisma.userPermission.createMany({
    data: permissions.map(permission => ({
      userId,
      permission
    }))
  });

  return user;
}

export async function getUserPermissions(userId: string): Promise<Permission[]> {
  const permissions = await prisma.userPermission.findMany({
    where: { userId }
  });
  
  return permissions.map(p => p.permission as Permission);
}

export async function hasPermission(userId: string, permission: Permission): Promise<boolean> {
  const count = await prisma.userPermission.count({
    where: {
      userId,
      permission
    }
  });
  
  return count > 0;
}
