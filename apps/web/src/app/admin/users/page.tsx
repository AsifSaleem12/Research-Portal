import { AdminPageHeader } from '../../../components/admin/admin-page-header';
import { AdminUsersPanel } from '../../../components/admin/admin-users-panel';
import { adminUsers } from '../../../features/admin/admin-data';

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Users"
        title="Manage accounts, roles, and onboarding"
        description="Assign platform roles, invite new users, and keep access aligned to LGU research workflows."
      />
      <AdminUsersPanel initialUsers={adminUsers} />
    </div>
  );
}
