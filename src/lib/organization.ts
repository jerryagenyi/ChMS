import { prisma } from './prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';

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

export async function getCurrentOrganizationId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) {
    throw new Error('No organization ID found in session');
  }
  return session.user.organizationId;
}
