import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '../../components/admin/admin-sidebar';
import { AdminTopbar } from '../../components/admin/admin-topbar';
import { getAdminUserFromCookie } from '../../lib/admin-auth';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getAdminUserFromCookie();

  if (!user) {
    redirect('/login?next=/admin');
  }

  return (
    <div className="container-shell py-10">
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <AdminSidebar user={user} />
        <div className="space-y-6">
          <AdminTopbar user={user} />
          {children}
        </div>
      </div>
    </div>
  );
}
