import { z } from "zod"

export const socialMediaSchema = z.object({
  twitter: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  facebook: z.string().url().optional(),
  instagram: z.string().url().optional(),
  tiktok: z.string()
    .url()
    .regex(/^https:\/\/(www\.)?tiktok\.com\/@[\w.-]+/, "Invalid TikTok URL")
    .optional(),
}).partial();

export const registerSchema = z.object({
  // Personal Information
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  
  // Additional Information
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    postalCode: z.string().optional(),
  }),
  occupation: z.enum([
    "STUDENT",
    "GOVERNMENT",
    "NONPROFIT",
    "PRIVATE_SECTOR",
    "SELF_EMPLOYED",
    "RELIGIOUS_WORKER",
    "RETIRED",
    "OTHER"
  ]),
  
  // Optional Information
  dateOfBirth: z.date().optional(),
  memorableDates: z.object({
    weddingAnniversary: z.date().optional(),
    baptismDate: z.date().optional(),
    conversionDate: z.date().optional(),
  }).optional(),
  
  // Social Media Profiles
  socialMedia: socialMediaSchema,

  // Organization Information
  organization: z.object({
    type: z.enum(["new", "existing"]),
    id: z.string().optional(),
    inviteCode: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
  }),
})

export type RegisterFormData = z.infer<typeof registerSchema>
