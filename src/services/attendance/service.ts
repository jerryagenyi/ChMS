import { prisma } from '@/lib/prisma';

export interface Service {
  id: string;
  name: string;
  startTime: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export async function createService(data: Omit<Service, 'id'>) {
  return await prisma.service.create({
    data
  });
}

export async function updateService(id: string, data: Partial<Omit<Service, 'id'>>) {
  return await prisma.service.update({
    where: { id },
    data
  });
}

export async function getService(id: string) {
  return await prisma.service.findUnique({
    where: { id }
  });
}

export async function listServices() {
  return await prisma.service.findMany({
    orderBy: { startTime: 'desc' }
  });
}

export async function deleteService(id: string) {
  return await prisma.service.delete({
    where: { id }
  });
} 