import { ConnectedAdminManager } from '../../../components/admin/connected-admin-manager';
import { AdminPageHeader } from '../../../components/admin/admin-page-header';

export default function AdminThesesPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Theses"
        title="Moderate thesis repository records"
        description="Review student submissions, supervisor alignment, metadata quality, and archival publication readiness."
      />
      <ConnectedAdminManager resource="theses" />
    </div>
  );
}
