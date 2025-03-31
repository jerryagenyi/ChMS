import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function logPermissionChange({
  userId,
  changedBy,
  oldRole,
  newRole,
  oldPermissions,
  newPermissions,
}: {
  userId: string;
  changedBy: string;
  oldRole?: string;
  newRole?: string;
  oldPermissions?: string[];
  newPermissions?: string[];
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        changedBy,
        action: 'PERMISSION_CHANGE',
        details: {
          oldRole,
          newRole,
          oldPermissions,
          newPermissions,
        },
      },
    });

    logger.info('Permission change logged', {
      userId,
      changedBy,
      oldRole,
      newRole,
    });
  } catch (error) {
    logger.error('Failed to log permission change', error);
  }
}