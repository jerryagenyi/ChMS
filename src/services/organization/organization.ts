import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function createOrganization(name: string) {
  return await prisma.organization.create({
    data: {
      name,
      description: null
    }
  });
}

export async function addUserToOrganization(userId: string, organizationId: string, role: Role) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      organizationId,
      role
    }
  });
}
