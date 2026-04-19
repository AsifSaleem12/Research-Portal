import { ConnectedAdminManager } from '../../../components/admin/connected-admin-manager';
import { AdminPageHeader } from '../../../components/admin/admin-page-header';

export default function AdminDepartmentsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Departments"
        title="Maintain academic unit descriptions and visibility"
        description="Control how departments appear in public discovery flows and keep academic context aligned across records."
      />
      <ConnectedAdminManager resource="departments" />
    </div>
  );
}
