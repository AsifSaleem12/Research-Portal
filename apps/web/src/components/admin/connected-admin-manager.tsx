'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminPanelCard } from './admin-panel-card';
import { AdminTable } from './admin-table';
import { adminResourceConfigs } from '../../features/admin/admin-resource-config';
import type { AdminResourceName } from '../../lib/admin-resource-api';

type ConnectedAdminManagerProps = {
  resource: AdminResourceName;
};

type ApiListPayload = {
  data?: {
    data?: Record<string, any>[];
  };
  message?: string;
};

type ApiItemPayload = {
  data?: Record<string, any>;
  message?: string;
};

export function ConnectedAdminManager({ resource }: ConnectedAdminManagerProps) {
  const config = adminResourceConfigs[resource];
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string | number | boolean>>(config.emptyForm);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const records = useMemo(() => items.map(config.toRecord), [config, items]);
  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );
  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedId) ?? null,
    [records, selectedId],
  );

  useEffect(() => {
    void loadItems();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setForm(config.toFormValues(selectedItem));
      return;
    }

    setForm(config.emptyForm);
  }, [config, selectedItem]);

  async function loadItems(nextSearch = search) {
    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        pageSize: '100',
      });

      if (nextSearch.trim()) {
        params.set('search', nextSearch.trim());
      }

      const response = await fetch(
        `/api/admin/resources/${config.resource}?${params.toString()}`,
        { cache: 'no-store' },
      );

      const payload = (await response.json().catch(() => null)) as ApiListPayload | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? 'Unable to load records.');
      }

      const nextItems = payload?.data?.data ?? [];
      setItems(nextItems);
      setSelectedId((current) =>
        nextItems.some((item) => item.id === current) ? current : nextItems[0]?.id ?? null,
      );
    } catch (caughtError) {
      setItems([]);
      setSelectedId(null);
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load records.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit() {
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(
        selectedItem
          ? `/api/admin/resources/${config.resource}/${selectedItem.id}`
          : `/api/admin/resources/${config.resource}`,
        {
          method: selectedItem ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config.toPayload(form)),
        },
      );

      const payload = (await response.json().catch(() => null)) as ApiItemPayload | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? 'Unable to save record.');
      }

      const saved = payload?.data;

      if (saved) {
        setItems((current) => {
          if (selectedItem) {
            return current.map((item) => (item.id === saved.id ? saved : item));
          }

          return [saved, ...current];
        });
        setSelectedId(saved.id);
      } else {
        await loadItems();
      }

      setMessage(selectedItem ? 'Record updated successfully.' : 'Record created successfully.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to save record.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedItem) {
      return;
    }

    const confirmed = window.confirm(`Delete "${selectedRecord?.title ?? 'this record'}"?`);
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/admin/resources/${config.resource}/${selectedItem.id}`, {
        method: 'DELETE',
      });
      const payload = (await response.json().catch(() => null)) as ApiItemPayload | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? 'Unable to delete record.');
      }

      setItems((current) => current.filter((item) => item.id !== selectedItem.id));
      setSelectedId(null);
      setForm(config.emptyForm);
      setMessage('Record deleted successfully.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to delete record.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      <AdminPanelCard
        title={selectedItem ? `Create Record or Edit ${selectedRecord?.title ?? 'Record'}` : 'Create Record'}
        description="Use this card to add a new record or edit the selected one from the table below."
      >
        <div className="grid gap-4">
          {config.fields.map((field) => (
            <label key={field.name} className="grid gap-2 text-sm">
              <span className="font-medium text-slate-700">{field.label}</span>
              {field.type === 'textarea' ? (
                <textarea
                  value={String(form[field.name] ?? '')}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, [field.name]: event.target.value }))
                  }
                  rows={5}
                  className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
                />
              ) : field.type === 'select' ? (
                <select
                  value={String(form[field.name] ?? '')}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, [field.name]: event.target.value }))
                  }
                  className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center gap-3 rounded-2xl border border-line bg-slate-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={Boolean(form[field.name])}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field.name]: event.target.checked,
                      }))
                    }
                  />
                  <span className="text-sm text-slate-600">Enable this option</span>
                </div>
              ) : (
                <input
                  type={field.type}
                  required={field.required}
                  value={String(form[field.name] ?? '')}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, [field.name]: event.target.value }))
                  }
                  className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
                />
              )}
            </label>
          ))}

          {message ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isSaving}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : selectedItem ? 'Save Changes' : 'Create Record'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedId(null);
                setForm(config.emptyForm);
                setMessage('');
                setError('');
              }}
              className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-slate-700"
            >
              Reset
            </button>
            {selectedItem ? (
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            ) : null}
          </div>
        </div>
      </AdminPanelCard>

      <AdminPanelCard
        title="Created Record Display"
        description="View created records in tabular form and select any row to load it into the create record card."
      >
        <div className="mb-5 flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search records"
            className="min-w-[220px] flex-1 rounded-2xl border border-line bg-slate-50 px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={() => void loadItems(search)}
            className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Search
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-[22px] border border-line bg-slate-50 px-4 py-8 text-sm text-slate-500">
            Loading records...
          </div>
        ) : (
          <AdminTable records={records} onSelect={(record) => setSelectedId(record.id)} />
        )}
      </AdminPanelCard>
    </div>
  );
}
