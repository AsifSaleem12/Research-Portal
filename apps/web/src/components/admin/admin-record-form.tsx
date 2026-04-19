'use client';

import { useEffect, useState } from 'react';
import type { AdminRecord, WorkflowState } from '../../types/admin';

type AdminRecordFormProps = {
  selected: AdminRecord | null;
  titleLabel: string;
  descriptionLabel: string;
  onSave: (record: AdminRecord) => void;
  onCreate: (record: AdminRecord) => void;
};

const workflowOptions: WorkflowState[] = [
  'Draft',
  'Submitted',
  'Under Review',
  'Approved',
  'Rejected',
  'Published',
  'Archived',
];

function blankRecord(): AdminRecord {
  return {
    id: '',
    title: '',
    slug: '',
    summary: '',
    department: '',
    owner: '',
    type: '',
    workflow: 'Draft',
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

export function AdminRecordForm({
  selected,
  titleLabel,
  descriptionLabel,
  onSave,
  onCreate,
}: AdminRecordFormProps) {
  const [form, setForm] = useState<AdminRecord>(selected ?? blankRecord());

  useEffect(() => {
    setForm(selected ?? blankRecord());
  }, [selected]);

  const submitLabel = selected ? 'Save Changes' : 'Create Record';

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">{titleLabel}</span>
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Slug</span>
          <input
            value={form.slug ?? ''}
            onChange={(event) => setForm({ ...form, slug: event.target.value })}
            className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm">
        <span className="font-medium text-slate-700">{descriptionLabel}</span>
        <textarea
          value={form.summary ?? ''}
          onChange={(event) => setForm({ ...form, summary: event.target.value })}
          rows={5}
          className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Department</span>
          <input
            value={form.department ?? ''}
            onChange={(event) => setForm({ ...form, department: event.target.value })}
            className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Owner</span>
          <input
            value={form.owner ?? ''}
            onChange={(event) => setForm({ ...form, owner: event.target.value })}
            className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700">Type</span>
          <input
            value={form.type ?? ''}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
            className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm md:max-w-xs">
        <span className="font-medium text-slate-700">Workflow status</span>
        <select
          value={form.workflow}
          onChange={(event) =>
            setForm({ ...form, workflow: event.target.value as WorkflowState })
          }
          className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
        >
          {workflowOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            const next = {
              ...form,
              id: form.id || `new-${Date.now()}`,
              updatedAt: new Date().toISOString().slice(0, 10),
            };
            if (selected) {
              onSave(next);
            } else {
              onCreate(next);
              setForm(blankRecord());
            }
          }}
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-accent"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={() => setForm(blankRecord())}
          className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-slate-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

