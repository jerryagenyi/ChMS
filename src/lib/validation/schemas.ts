import { z } from 'zod';
import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  dateSchema,
  idSchema,
} from './base';
import { Permission, Role } from '../../types/auth';

// User schemas
export const userSchema = z.object({
  id: idSchema,
  email: emailSchema,
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['super_admin', 'admin', 'manager', 'staff', 'viewer'] as const),
  organisationId: idSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createUserSchema.partial();

// Member schemas
export const memberSchema = z.object({
  id: idSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: emailSchema.optional(),
  phone: phoneSchema,
  dateOfBirth: dateSchema.optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional(),
  departmentId: idSchema.optional(),
  familyId: idSchema.optional(),
  organisationId: idSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const createMemberSchema = memberSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateMemberSchema = createMemberSchema.partial();

// Family schemas
export const familySchema = z.object({
  id: idSchema,
  name: z.string().min(1, 'Family name is required'),
  headOfFamily: idSchema,
  members: z.array(idSchema),
  organisationId: idSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const createFamilySchema = familySchema.omit({
  id: true,
  members: true,
  createdAt: true,
  updatedAt: true,
});

export const updateFamilySchema = createFamilySchema.partial();

// Department schemas
export const departmentSchema = z.object({
  id: idSchema,
  name: z.string().min(1, 'Department name is required'),
  description: z.string().optional(),
  leaderId: idSchema.optional(),
  organisationId: idSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const createDepartmentSchema = departmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

// Class schemas
export const classSchema = z.object({
  id: idSchema,
  name: z.string().min(1, 'Class name is required'),
  description: z.string().optional(),
  departmentId: idSchema,
  teacherId: idSchema.optional(),
  schedule: z.string().optional(),
  organisationId: idSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const createClassSchema = classSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateClassSchema = createClassSchema.partial();

// Attendance schemas
export const attendanceSchema = z.object({
  id: idSchema,
  memberId: idSchema,
  classId: idSchema.optional(),
  date: dateSchema,
  status: z.enum(['present', 'absent', 'late']),
  notes: z.string().optional(),
  organisationId: idSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const createAttendanceSchema = z.object({
  memberId: z.string().uuid(),
  classId: z.string().uuid(),
  date: z.string().datetime(),
  status: z.enum(['present', 'absent', 'late']),
  notes: z.string().optional(),
});

export const updateAttendanceSchema = createAttendanceSchema.partial();

export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;

// Organisation settings schemas
export const organisationSettingsSchema = z.object({
  id: idSchema,
  organisationId: idSchema,
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid primary color'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid secondary color'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid background color'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid accent color'),
  language: z.string().default('en'),
  timezone: z.string().default('UTC'),
  currency: z.string().default('USD'),
  logo: z.string().url('Invalid logo URL').optional(),
  favicon: z.string().url('Invalid favicon URL').optional(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const updateOrganisationSettingsSchema = organisationSettingsSchema
  .omit({
    id: true,
    organisationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial(); 