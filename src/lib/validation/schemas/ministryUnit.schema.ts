import { z } from "zod"

// Enums should match Prisma schema
export const MinistryUnitType = {
  DEPARTMENT: "DEPARTMENT",
  TEAM: "TEAM",
  COMMITTEE: "COMMITTEE",
  GROUP: "GROUP",
} as const

export const MinistryCategory = {
  WORSHIP: "WORSHIP",
  OUTREACH: "OUTREACH",
  DISCIPLESHIP: "DISCIPLESHIP",
  ADMINISTRATION: "ADMINISTRATION",
  PASTORAL: "PASTORAL",
  OTHER: "OTHER",
} as const

export const ministryUnitSchema = z.object({
  name: z
    .string()
    .min(2, "Unit name must be at least 2 characters")
    .max(100, "Unit name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  type: z.enum(Object.values(MinistryUnitType) as [string, ...string[]]),
  category: z.enum(Object.values(MinistryCategory) as [string, ...string[]]),
  parentUnitId: z.string().optional(),
  organizationId: z.string(),
  isActive: z.boolean().default(true),
})

export type MinistryUnitFormData = z.infer<typeof ministryUnitSchema>