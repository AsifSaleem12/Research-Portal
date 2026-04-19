'use client';

import { useState } from 'react';
import type { AdminSettingsSection } from '../../types/admin';
import { AdminPanelCard } from './admin-panel-card';

export function AdminSettingsPanel({
  sections,
}: {
  sections: AdminSettingsSection[];
}) {
  const [state, setState] = useState(sections);
  const summaryItems = state.flatMap((section) =>
    section.fields.map((field) => ({
      id: `${section.id}-${field.id}`,
      section: section.title,
      label: field.label,
      value: field.value,
    })),
  );

  return (
    <div className="space-y-6">
      <AdminPanelCard
        title="Create Record"
        description="Update portal settings from one consolidated configuration card."
      >
        <div className="space-y-6">
          {state.map((section) => (
            <div key={section.id} className="rounded-[22px] border border-line bg-slate-50 p-4">
              <div className="font-medium text-ink">{section.title}</div>
              <div className="mt-1 text-sm leading-6 text-slate-500">{section.description}</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {section.fields.map((field) => (
                  <label key={field.id} className="grid gap-2 text-sm">
                    <span className="font-medium text-slate-700">{field.label}</span>
                    <input
                      value={field.value}
                      onChange={(event) =>
                        setState((current) =>
                          current.map((item) =>
                            item.id === section.id
                              ? {
                                  ...item,
                                  fields: item.fields.map((entry) =>
                                    entry.id === field.id
                                      ? { ...entry, value: event.target.value }
                                      : entry,
                                  ),
                                }
                              : item,
                          ),
                        )
                      }
                      className="rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-accent"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AdminPanelCard>

      <AdminPanelCard
        title="Created Record Display"
        description="Current settings shown in table form."
      >
        <div className="overflow-hidden rounded-[24px] border border-line">
          <table className="min-w-full divide-y divide-line text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Section</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Field</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {summaryItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4 text-slate-600">{item.section}</td>
                  <td className="px-4 py-4 font-medium text-ink">{item.label}</td>
                  <td className="px-4 py-4 text-slate-600">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanelCard>
    </div>
  );
}
