import { z } from "zod"

export const organizationSchema = z.object({
  name: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  address: z
    .string()
    .max(200, "Address must be less than 200 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits")
    .optional(),
  email: z
    .string()
    .email("Invalid email address")
    .optional(),
})

export type OrganizationFormData = z.infer<typeof organizationSchema>