'use client';

import { useState } from 'react';
import { AdminPanelCard } from './admin-panel-card';
import type { AdminUser } from '../../types/admin';

export function AdminUsersPanel({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Researcher');

  return (
    <div className="space-y-6">
      <AdminPanelCard
        title="Create Record"
        description="Create a new admin, staff, or researcher account stub for onboarding."
      >
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700">Role</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
            >
              <option>Researcher</option>
              <option>Department Coordinator</option>
              <option>ORIC Staff</option>
              <option>Portal Admin</option>
              <option>Super Admin</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              if (!name || !email) return;
              setUsers((current) => [
                {
                  id: `user-${Date.now()}`,
                  name,
                  email,
                  role,
                  status: 'Invited',
                },
                ...current,
              ]);
              setName('');
              setEmail('');
              setRole('Researcher');
            }}
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-accent"
          >
            Send Invitation
          </button>
        </div>
      </AdminPanelCard>

      <AdminPanelCard
        title="Created Record Display"
        description="Created users displayed in tabular form."
      >
        <div className="overflow-hidden rounded-[24px] border border-line">
          <table className="min-w-full divide-y divide-line text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Role</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-4 font-medium text-ink">{user.name}</td>
                  <td className="px-4 py-4 text-slate-600">{user.email}</td>
                  <td className="px-4 py-4 text-slate-600">{user.role}</td>
                  <td className="px-4 py-4 text-slate-600">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanelCard>
    </div>
  );
}
