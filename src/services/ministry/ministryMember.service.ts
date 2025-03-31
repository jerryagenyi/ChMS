import { prisma } from '@/lib/prisma'
import type { MinistryMemberFormData } from '@/lib/validation/schemas/ministryMember.schema'
import type { MinistryUnitMember } from '@prisma/client'

export class MinistryMemberService {
  static async assign(data: MinistryMemberFormData): Promise<MinistryUnitMember> {
    return prisma.ministryUnitMember.create({
      data,
    })
  }

  static async updateAssignment(
    ministryUnitId: string,
    memberId: string,
    data: Partial<MinistryMemberFormData>
  ): Promise<MinistryUnitMember> {
    return prisma.ministryUnitMember.update({
      where: {
        ministryUnitId_memberId: {
          ministryUnitId,
          memberId,
        },
      },
      data,
    })
  }

  static async removeFromUnit(
    ministryUnitId: string,
    memberId: string
  ): Promise<MinistryUnitMember> {
    return prisma.ministryUnitMember.delete({
      where: {
        ministryUnitId_memberId: {
          ministryUnitId,
          memberId,
        },
      },
    })
  }

  static async getUnitMembers(ministryUnitId: string): Promise<MinistryUnitMember[]> {
    return prisma.ministryUnitMember.findMany({
      where: { 
        ministryUnitId,
        status: 'ACTIVE',
      },
      include: {
        member: true,
      },
    })
  }

  static async getMemberUnits(memberId: string): Promise<MinistryUnitMember[]> {
    return prisma.ministryUnitMember.findMany({
      where: { 
        memberId,
        status: 'ACTIVE',
      },
      include: {
        ministryUnit: true,
      },
    })
  }
}