import { prisma } from './prisma';

interface OrganizationData {
  name: string;
  description?: string;
}

export async function createOrganization(data: OrganizationData) {
  return prisma.organization.create({
    data,
  });
}

export async function addUserToOrganization(userId: string, organizationId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      organization: {
        connect: { id: organizationId },
      },
      role: 'MEMBER',
    },
  });
} 