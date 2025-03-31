import { prisma } from '@/lib/prisma';
import { Role, Permission, ROLE_PERMISSIONS } from '@/types/auth';
import { AuthorizationError } from '@/lib/errors';

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