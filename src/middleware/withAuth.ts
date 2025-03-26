 import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Permission, Role } from '../types/auth';
import { checkPermission, checkPermissions } from '../lib/auth/permissions';
import { AuthenticationError, AuthorizationError, AppError } from '../lib/errors';
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

        const userRole = session.user.role as Role;

        // Check if user's role is allowed
        if (options.allowedRoles && !options.allowedRoles.includes(userRole)) {
          throw new AuthorizationError('Your role does not have access to this resource');
        }

        // Check if user has required permissions
        if (options.requiredPermissions) {
          const hasPermission = options.requireAllPermissions
            ? checkPermissions(userRole, options.requiredPermissions, true)
            : checkPermissions(userRole, options.requiredPermissions);

          if (!hasPermission) {
            throw new AuthorizationError('You do not have permission to perform this action');
          }
        }

        // Add user and role information to the request
        const requestWithAuth = new Request(req.url, {
          headers: req.headers,
          method: req.method,
          body: req.body,
        });

        // @ts-ignore - Adding custom properties to Request
        requestWithAuth.user = session.user;
        // @ts-ignore
        requestWithAuth.role = userRole;

        return handler(requestWithAuth);
      } catch (error) {
        const appError = error instanceof AppError ? error : new AppError('Authentication error');
        logger.error('Auth middleware error', appError, undefined, {
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