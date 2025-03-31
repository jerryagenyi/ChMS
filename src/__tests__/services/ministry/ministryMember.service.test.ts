import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MinistryMemberService } from '@/services/ministry/ministryMember.service'
import { createMockContext, mockMinistryUnitMember, mockMember } from '../../utils/test-helpers'
import { PrismaClient } from '@prisma/client'

vi.mock('@/lib/prisma', () => {
  const { createMockContext } = require('../../utils/test-helpers')
  return {
    prisma: createMockContext().prisma,
  }
})

describe('MinistryMemberService', () => {
  const { prisma } = createMockContext()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('assign', () => {
    it('assigns a member to a unit', async () => {
      prisma.ministryUnitMember.create.mockResolvedValue(mockMinistryUnitMember)

      const result = await MinistryMemberService.assign({
        ministryUnitId: 'unit1',
        memberId: 'member1',
        role: 'MEMBER',
        status: 'ACTIVE',
        startDate: new Date(),
      })

      expect(result).toEqual(mockMinistryUnitMember)
      expect(prisma.ministryUnitMember.create).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateAssignment', () => {
    it('updates a member assignment', async () => {
      const updatedAssignment = { ...mockMinistryUnitMember, role: 'LEADER' }
      prisma.ministryUnitMember.update.mockResolvedValue(updatedAssignment)

      const result = await MinistryMemberService.updateAssignment(
        'unit1',
        'member1',
        { role: 'LEADER' }
      )

      expect(result).toEqual(updatedAssignment)
      expect(prisma.ministryUnitMember.update).toHaveBeenCalledWith({
        where: {
          ministryUnitId_memberId: {
            ministryUnitId: 'unit1',
            memberId: 'member1',
          },
        },
        data: { role: 'LEADER' },
        include: {
          member: true,
          ministryUnit: true,
        },
      })
    })
  })

  describe('getUnitMembers', () => {
    it('gets members with filters', async () => {
      prisma.ministryUnitMember.findMany.mockResolvedValue([mockMinistryUnitMember])

      const result = await MinistryMemberService.getUnitMembers('unit1', {
        role: 'MEMBER',
      })

      expect(result).toEqual([mockMinistryUnitMember])
      expect(prisma.ministryUnitMember.findMany).toHaveBeenCalledWith({
        where: {
          ministryUnitId: 'unit1',
          status: 'ACTIVE',
          role: 'MEMBER',
        },
        include: {
          member: true,
          ministryUnit: true,
        },
        orderBy: {
          member: {
            lastName: 'asc',
          },
        },
      })
    })
  })

  describe('getMemberUnits', () => {
    it('gets units for a member', async () => {
      prisma.ministryUnitMember.findMany.mockResolvedValue([mockMinistryUnitMember])

      const result = await MinistryMemberService.getMemberUnits('member1')

      expect(result).toEqual([mockMinistryUnitMember])
      expect(prisma.ministryUnitMember.findMany).toHaveBeenCalledWith({
        where: {
          memberId: 'member1',
          status: 'ACTIVE',
        },
        include: {
          ministryUnit: true,
          member: true,
        },
        orderBy: {
          ministryUnit: {
            name: 'asc',
          },
        },
      })
    })
  })
})