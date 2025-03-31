import { describe, it, expect } from 'vitest'
import { ministryUnitSchema } from '@/lib/validation/schemas/ministryUnit.schema'
import { createTestDate } from '../../utils/test-helpers'

describe('MinistryUnit Schema', () => {
  it('validates correct ministry unit data', () => {
    const validData = {
      name: 'Worship Team',
      description: 'Main worship team',
      type: 'TEAM',
      category: 'WORSHIP',
      organizationId: 'org1',
      isActive: true,
    }

    const result = ministryUnitSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('fails with invalid name', () => {
    const invalidData = {
      name: 'A', // Too short
      type: 'TEAM',
      category: 'WORSHIP',
      organizationId: 'org1',
    }

    const result = ministryUnitSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('fails with invalid type', () => {
    const invalidData = {
      name: 'Worship Team',
      type: 'INVALID_TYPE',
      category: 'WORSHIP',
      organizationId: 'org1',
    }

    const result = ministryUnitSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('allows optional fields to be undefined', () => {
    const minimalData = {
      name: 'Worship Team',
      type: 'TEAM',
      category: 'WORSHIP',
      organizationId: 'org1',
    }

    const result = ministryUnitSchema.safeParse(minimalData)
    expect(result.success).toBe(true)
  })
})