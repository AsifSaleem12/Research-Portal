import { AdminPageHeader } from '../../../components/admin/admin-page-header';
import { AdminSettingsPanel } from '../../../components/admin/admin-settings-panel';
import { adminSettings } from '../../../features/admin/admin-data';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Settings"
        title="Portal configuration"
        description="Configure portal identity, workflow routing, and search/indexing behavior from one settings area."
      />
      <AdminSettingsPanel sections={adminSettings} />
    </div>
  );
}
