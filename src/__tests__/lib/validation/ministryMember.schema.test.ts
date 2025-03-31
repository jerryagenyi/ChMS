import { describe, it, expect } from 'vitest'
import { ministryMemberSchema } from '@/lib/validation/schemas/ministryMember.schema'
import { createTestDate } from '../../utils/test-helpers'

describe('MinistryMember Schema', () => {
  it('validates correct ministry member data', () => {
    const validData = {
      ministryUnitId: 'unit1',
      memberId: 'member1',
      role: 'MEMBER',
      status: 'ACTIVE',
      startDate: '2024-01-01',
      notes: 'Test notes',
    }

    const result = ministryMemberSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('coerces string dates to Date objects', () => {
    const data = {
      ministryUnitId: 'unit1',
      memberId: 'member1',
      role: 'MEMBER',
      status: 'ACTIVE',
      startDate: '2024-01-01',
    }

    const result = ministryMemberSchema.parse(data)
    expect(result.startDate).toBeInstanceOf(Date)
  })

  it('fails with invalid role', () => {
    const invalidData = {
      ministryUnitId: 'unit1',
      memberId: 'member1',
      role: 'INVALID_ROLE',
      status: 'ACTIVE',
      startDate: '2024-01-01',
    }

    const result = ministryMemberSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('fails with invalid status', () => {
    const invalidData = {
      ministryUnitId: 'unit1',
      memberId: 'member1',
      role: 'MEMBER',
      status: 'INVALID_STATUS',
      startDate: '2024-01-01',
    }

    const result = ministryMemberSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})