import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { Role, ROLE_PERMISSIONS } from '../src/types/auth';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: Role.SUPER_ADMIN }
    });

    if (existingSuperAdmin) {
      console.log('Super admin already exists');
      return;
    }

    const hashedPassword = await hash(process.env.SUPER_ADMIN_INITIAL_PASSWORD || 'changeMe123!', 12);

    const superAdmin = await prisma.user.create({
      data: {
        email: process.env.SUPER_ADMIN_EMAIL || 'super.admin@church.org',
        name: 'Super Administrator',
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        emailVerified: new Date(),
      }
    });

    // Create permissions for super admin
    const permissions = ROLE_PERMISSIONS[Role.SUPER_ADMIN].permissions;
    
    // Use the correct model name from your Prisma schema
    await prisma.permission.createMany({
      data: permissions.map(permission => ({
        userId: superAdmin.id,
        name: permission
      }))
    });

    console.log('Super admin created successfully');
  } catch (error) {
    console.error('Failed to create super admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
