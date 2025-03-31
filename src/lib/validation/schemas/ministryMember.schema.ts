import { z } from "zod"

export const MemberRole = {
  LEADER: "LEADER",
  ASSISTANT_LEADER: "ASSISTANT_LEADER",
  SECRETARY: "SECRETARY",
  TREASURER: "TREASURER",
  MEMBER: "MEMBER",
} as const

export const MembershipStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
  PROBATION: "PROBATION",
} as const

export const ministryMemberSchema = z.object({
  ministryUnitId: z.string(),
  memberId: z.string(),
  role: z.enum(Object.values(MemberRole) as [string, ...string[]]),
  status: z.enum(Object.values(MembershipStatus) as [string, ...string[]]).default("ACTIVE"),
  startDate: z.date(),
  endDate: z.date().optional(),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
})

export type MinistryMemberFormData = z.infer<typeof ministryMemberSchema>