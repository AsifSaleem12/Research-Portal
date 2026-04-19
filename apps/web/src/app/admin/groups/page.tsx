import { ConnectedAdminManager } from '../../../components/admin/connected-admin-manager';
import { AdminPageHeader } from '../../../components/admin/admin-page-header';

export default function AdminGroupsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Groups"
        title="Manage labs and research groups"
        description="Maintain group descriptions, leadership assignments, and publication visibility for public-facing lab pages."
      />
      <ConnectedAdminManager resource="groups" />
    </div>
  );
}
