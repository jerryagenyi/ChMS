import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Permission, Role } from '../types/auth';
import { hasPermission } from '../services/auth/roles';
import { AuthenticationError, AuthorizationError, AppError } from '@/lib/errors';
import { logger } from '../lib/logger';

interface AuthOptions {
  requiredPermissions?: Permission[];
  requireAllPermissions?: boolean;
  allowedRoles?: Role[];
}

export function withAuth(options: AuthOptions = {}) {
  return async (handler: (req: Request) => Promise<Response>) => {
    return async (req: Request) => {
      try {
        const session = await getServerSession();

        if (!session?.user) {
          throw new AuthenticationError();
        }

        const userId = session.user.id;
        const userRole = session.user.role as Role;

        // Check if user's role is allowed
        if (options.allowedRoles && !options.allowedRoles.includes(userRole)) {
          throw new AuthorizationError('Your role does not have access to this resource');
        }

        // Check if user has required permissions
        if (options.requiredPermissions) {
          const permissionChecks = await Promise.all(
            options.requiredPermissions.map(permission => 
              hasPermission(userId, permission)
            )
          );

          const hasRequiredPermissions = options.requireAllPermissions
            ? permissionChecks.every(Boolean)
            : permissionChecks.some(Boolean);

          if (!hasRequiredPermissions) {
            throw new AuthorizationError('You do not have permission to perform this action');
          }
        }

        return handler(req);
      } catch (error) {
        const appError = error instanceof AppError ? error : new AppError('Authentication error');
        logger.error('Auth middleware error', {
          error: appError,
          path: new URL(req.url).pathname,
          method: req.method,
        });

        if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
          return NextResponse.json(
            { error: { message: error.message, code: error.code } },
            { status: error.statusCode }
          );
        }

        throw error;
      }
    };
  };
}
