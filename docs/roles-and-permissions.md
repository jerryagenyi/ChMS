# Roles and Permissions Guide

## Role Hierarchy

1. **Super Admin**
   - Full system access
   - Can manage all roles and permissions
   - Can create other super admins
   - Has access to audit logs and system settings
   - Cannot be deleted through the interface

2. **Admin**
   - Organization-level administrative access
   - Can manage users, roles, and permissions (except super admin)
   - Full access to all ministry management features
   - Can view audit logs
   - Cannot modify system settings

3. **Manager**
   - Department/Ministry unit management
   - Can manage assigned ministry units
   - Can manage members and attendance
   - Can create and manage events
   - Cannot access system settings or audit logs

4. **Staff**
   - Basic operational access
   - Can record attendance
   - Can view and update member information
   - Can view events and reports
   - Cannot modify system settings

5. **Viewer**
   - Read-only access
   - Can view members, attendance, and events
   - Cannot modify any data
   - Cannot access sensitive information

## Permission Categories

### Member Management
- `read:members`: View member information
- `write:members`: Create/update member records
- `delete:members`: Remove member records

### Attendance Management
- `read:attendance`: View attendance records
- `write:attendance`: Record attendance
- `manage:attendance`: Modify/delete attendance records

### Event Management
- `read:events`: View events
- `write:events`: Create/update events
- `manage:events`: Full event management including deletion

### Report Management
- `read:reports`: View reports
- `write:reports`: Create custom reports
- `manage:reports`: Manage report templates and settings

### Settings & Configuration
- `manage:settings`: Access to system settings
- `manage:users`: User management
- `manage:roles`: Role and permission management

### Ministry Units Management
- `read:ministry_units`: View ministry units
- `write:ministry_units`: Create/update ministry units
- `manage:ministry_units`: Full ministry unit management

## Best Practices

1. **Role Assignment**
   - Always use the principle of least privilege
   - Regularly review user roles and permissions
   - Document any role changes in the audit log

2. **Permission Management**
   - Only super admins should modify system-level permissions
   - Keep audit logs of all permission changes
   - Regular backup of permission configurations

3. **Security Considerations**
   - All role changes require two-factor authentication
   - Permission changes are logged and monitored
   - Regular security audits of role assignments

## Audit Logging

All changes to roles and permissions are automatically logged with:
- Who made the change
- What was changed
- When it was changed
- Previous and new values
- Reason for change (if provided)

Access to audit logs is restricted to Super Admins and Admins.