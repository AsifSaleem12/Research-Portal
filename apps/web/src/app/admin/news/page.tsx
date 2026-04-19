import { ConnectedAdminManager } from '../../../components/admin/connected-admin-manager';
import { AdminPageHeader } from '../../../components/admin/admin-page-header';

export default function AdminNewsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="News"
        title="Manage research news, activities, and events"
        description="Draft updates, schedule institutional announcements, and publish activity items with workflow visibility."
      />
      <ConnectedAdminManager resource="news" />
    </div>
  );
}
