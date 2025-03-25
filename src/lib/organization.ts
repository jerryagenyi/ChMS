import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function createOrganization(name: string) {
  return await prisma.organisation.create({
    data: {
      name,
      description: null
    }
  });
}

export async function addUserToOrganization(userId: string, organisationId: string, role: Role) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      organisationId,
      role
    }
  });
}
