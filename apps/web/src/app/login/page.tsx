import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from '../../components/admin/admin-login-form';
import { AuthShell } from '../../components/auth/auth-shell';
import { getAdminRedirectTarget, getAdminUserFromCookie } from '../../lib/admin-auth';

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const user = await getAdminUserFromCookie();

  if (user) {
    redirect(getAdminRedirectTarget(searchParams?.next ?? null));
  }

  return (
    <AuthShell
      eyebrow="Sign In"
      title="Research Office Console"
      description="Use your administrative credentials to continue to the protected research management workspace."
    >
      <AdminLoginForm />
      <div className="mt-6 rounded-[22px] bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500">
        Public visitors can continue to browse researchers, publications, groups, projects,
        and theses from the main portal.
      </div>
      <div className="mt-4 text-center text-sm text-slate-500">
        Need institutional access first?{' '}
        <Link href="/signup" className="font-semibold text-accent transition hover:text-ink">
          Create an account
        </Link>
      </div>
    </AuthShell>
  );
}
