import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MinistryUnitService } from '@/services/ministry/ministryUnit.service'
import { createMockContext, mockMinistryUnit } from '@/__tests__/utils/helpers'
import { PrismaClient } from '@prisma/client'

vi.mock('@/lib/prisma', () => {
  const { createMockContext } = require('@/__tests__/utils/helpers')
  return {
    prisma: createMockContext().prisma,
  }
})

describe('MinistryUnitService', () => {
  const { prisma } = createMockContext()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('creates a ministry unit', async () => {
      prisma.ministryUnit.create.mockResolvedValue(mockMinistryUnit)

      const result = await MinistryUnitService.create({
        name: 'Worship Team',
        type: 'TEAM',
        category: 'WORSHIP',
        organizationId: 'org1',
      })

      expect(result).toEqual(mockMinistryUnit)
      expect(prisma.ministryUnit.create).toHaveBeenCalledTimes(1)
    })
  })

  describe('update', () => {
    it('updates a ministry unit', async () => {
      const updatedUnit = { ...mockMinistryUnit, name: 'Updated Team' }
      prisma.ministryUnit.update.mockResolvedValue(updatedUnit)

      const result = await MinistryUnitService.update('unit1', {
        name: 'Updated Team',
      })

      expect(result).toEqual(updatedUnit)
      expect(prisma.ministryUnit.update).toHaveBeenCalledWith({
        where: { id: 'unit1' },
        data: { name: 'Updated Team' },
        include: { leaders: true, members: true },
      })
    })
  })

  describe('getByOrganization', () => {
    it('gets units with filters', async () => {
      prisma.ministryUnit.findMany.mockResolvedValue([mockMinistryUnit])

      const result = await MinistryUnitService.getByOrganization('org1', {
        type: 'TEAM',
        category: 'WORSHIP',
      })

      expect(result).toEqual([mockMinistryUnit])
      expect(prisma.ministryUnit.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: 'org1',
          isActive: true,
          type: 'TEAM',
          category: 'WORSHIP',
        },
        include: {
          leaders: {
            include: {
              member: true,
            },
          },
          members: {
            include: {
              member: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      })
    })
  })

  describe('getHierarchy', () => {
    it('gets hierarchical structure', async () => {
      prisma.ministryUnit.findMany.mockResolvedValue([mockMinistryUnit])

      const result = await MinistryUnitService.getHierarchy('org1')

      expect(result).toEqual([mockMinistryUnit])
      expect(prisma.ministryUnit.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: 'org1',
          parentUnitId: null,
          isActive: true,
        },
        include: expect.any(Object),
        orderBy: {
          name: 'asc',
        },
      })
    })
  })
})