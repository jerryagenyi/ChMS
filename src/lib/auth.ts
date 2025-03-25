import { prisma } from './prisma';
import { hash } from 'bcryptjs';
import { Role } from '@prisma/client';

interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role?: Role;
}

export async function createUser(data: CreateUserData) {
  const hashedPassword = await hash(data.password, 10);
  
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role || Role.MEMBER,
    },
  });
} 
