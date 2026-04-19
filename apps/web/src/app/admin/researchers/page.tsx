import { ConnectedAdminManager } from '../../../components/admin/connected-admin-manager';
import { AdminPageHeader } from '../../../components/admin/admin-page-header';

export default function AdminResearchersPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Researchers"
        title="Manage faculty and researcher profiles"
        description="Create profile stubs, revise biography and expertise content, and move researcher records through review and publication states."
      />
      <ConnectedAdminManager resource="researchers" />
    </div>
  );
}
