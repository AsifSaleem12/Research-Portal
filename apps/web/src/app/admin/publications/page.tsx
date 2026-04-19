import { ConnectedAdminManager } from '../../../components/admin/connected-admin-manager';
import { AdminPageHeader } from '../../../components/admin/admin-page-header';

export default function AdminPublicationsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Publications"
        title="Publication ingestion and approval workflow"
        description="Review new publication records, edit metadata, adjust workflow state, and publish verified scholarly outputs."
      />
      <ConnectedAdminManager resource="publications" />
    </div>
  );
}
