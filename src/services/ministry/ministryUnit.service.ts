import { prisma } from '@/lib/prisma'
import type { MinistryUnitFormData } from '@/lib/validation/schemas/ministryUnit.schema'
import type { MinistryUnit } from '@prisma/client'

export class MinistryUnitService {
  static async create(data: MinistryUnitFormData): Promise<MinistryUnit> {
    return prisma.ministryUnit.create({
      data,
    })
  }

  static async update(id: string, data: Partial<MinistryUnitFormData>): Promise<MinistryUnit> {
    return prisma.ministryUnit.update({
      where: { id },
      data,
    })
  }

  static async delete(id: string): Promise<MinistryUnit> {
    return prisma.ministryUnit.delete({
      where: { id },
    })
  }

  static async getById(id: string): Promise<MinistryUnit | null> {
    return prisma.ministryUnit.findUnique({
      where: { id },
      include: {
        leaders: true,
        members: true,
        childUnits: true,
      },
    })
  }

  static async getByOrganization(organizationId: string): Promise<MinistryUnit[]> {
    return prisma.ministryUnit.findMany({
      where: { 
        organizationId,
        isActive: true,
      },
      include: {
        leaders: true,
        members: true,
      },
    })
  }

  static async getHierarchy(organizationId: string): Promise<MinistryUnit[]> {
    return prisma.ministryUnit.findMany({
      where: {
        organizationId,
        parentUnitId: null, // Get top-level units
        isActive: true,
      },
      include: {
        childUnits: {
          include: {
            childUnits: true, // Nested units
            leaders: true,
            members: true,
          },
        },
        leaders: true,
        members: true,
      },
    })
  }
}