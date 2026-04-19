import { ConnectedAdminManager } from '../../../components/admin/connected-admin-manager';
import { AdminPageHeader } from '../../../components/admin/admin-page-header';

export default function AdminResearchAreasPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Research Areas"
        title="Curate the LGU research taxonomy"
        description="Create and revise research-area labels that power filtering, related content, and discoverability across the portal."
      />
      <ConnectedAdminManager resource="research-areas" />
    </div>
  );
}
