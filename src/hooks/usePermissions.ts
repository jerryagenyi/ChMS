import { useSession } from 'next-auth/react';
import { Permission, Role } from '../types/auth';
import { checkPermission, checkPermissions } from '../lib/auth/permissions';

export function usePermissions() {
  const { data: session } = useSession();
  const userRole = session?.user?.role as Role;

  const hasPermission = (permission: Permission): boolean => {
    if (!userRole) return false;
    return checkPermission(userRole, permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!userRole) return false;
    return checkPermissions(userRole, permissions);
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!userRole) return false;
    return checkPermissions(userRole, permissions, true);
  };

  const hasRole = (role: Role): boolean => {
    return userRole === role;
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    if (!userRole) return false;
    return roles.includes(userRole);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    userRole,
  };
}