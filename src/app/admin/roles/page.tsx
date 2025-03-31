import { DataTable } from '@/components/DataTable';
import { RoleManagementActions } from './RoleManagementActions';
import { withAuth } from '@/middleware/withAuth';

export default withAuth({
  allowedRoles: ['super_admin', 'admin']
})(function RoleManagementPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Role Management</h1>
      <DataTable 
        columns={[
          { header: 'User', accessorKey: 'name' },
          { header: 'Email', accessorKey: 'email' },
          { header: 'Current Role', accessorKey: 'role' },
          { header: 'Actions', cell: RoleManagementActions },
        ]}
      />
    </div>
  );
});