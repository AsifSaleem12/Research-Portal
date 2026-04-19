import { ConnectedAdminManager } from '../../../components/admin/connected-admin-manager';
import { AdminPageHeader } from '../../../components/admin/admin-page-header';

export default function AdminProjectsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Projects"
        title="Track research projects from submission to publication"
        description="Manage project summaries, funding information, ownership, and approval routing across coordinators and ORIC."
      />
      <ConnectedAdminManager resource="projects" />
    </div>
  );
}
