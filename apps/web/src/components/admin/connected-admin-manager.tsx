'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminPanelCard } from './admin-panel-card';
import { AdminTable } from './admin-table';
import { adminResourceConfigs } from '../../features/admin/admin-resource-config';
import type { AdminResourceName } from '../../lib/admin-resource-api';
import { getApiBaseUrl } from '../../lib/admin-auth';

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

type SupportFaculty = {
  id: string;
  name: string;
};

type SupportDepartment = {
  id: string;
  name: string;
  facultyId?: string | null;
  faculty?: {
    id?: string;
    name?: string;
  } | null;
};

type SupportResearcher = {
  id: string;
  firstName: string;
  lastName: string;
  departmentId?: string | null;
  facultyId?: string | null;
};

type SupportGroup = {
  id: string;
  name: string;
  departmentId?: string | null;
  facultyId?: string | null;
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
  const [supportData, setSupportData] = useState<{
    faculties: SupportFaculty[];
    departments: SupportDepartment[];
    researchers: SupportResearcher[];
    groups: SupportGroup[];
  }>({
    faculties: [],
    departments: [],
    researchers: [],
    groups: [],
  });
  const [isLoadingSupportData, setIsLoadingSupportData] = useState(false);

  const records = useMemo(() => items.map(config.toRecord), [config, items]);
  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );
  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedId) ?? null,
    [records, selectedId],
  );
  const selectedDepartmentId = String(form.departmentId ?? '');
  const availableResearchers = useMemo(
    () =>
      supportData.researchers.filter(
        (researcher) =>
          !selectedDepartmentId || researcher.departmentId === selectedDepartmentId,
      ),
    [selectedDepartmentId, supportData.researchers],
  );
  const availableGroups = useMemo(
    () =>
      supportData.groups.filter(
        (group) => !selectedDepartmentId || group.departmentId === selectedDepartmentId,
      ),
    [selectedDepartmentId, supportData.groups],
  );
  const selectedFaculty = useMemo(() => {
    const facultyId = String(form.facultyId ?? '');

    if (!facultyId) {
      return null;
    }

    return supportData.faculties.find((faculty) => faculty.id === facultyId) ?? null;
  }, [form.facultyId, supportData.faculties]);
  const shouldLoadSupportData = config.fields.some((field) =>
    [
      'departmentId',
      'facultyId',
      'groupId',
      'principalInvestigatorId',
      'leadResearcherId',
      'supervisorId',
      'coSupervisorId',
    ].includes(field.name),
  );

  useEffect(() => {
    void loadItems();
  }, []);

  useEffect(() => {
    if (!shouldLoadSupportData) {
      return;
    }

    void loadSupportData();
  }, [shouldLoadSupportData]);

  useEffect(() => {
    if (selectedItem) {
      setForm(config.toFormValues(selectedItem));
      return;
    }

    setForm(config.emptyForm);
  }, [config, selectedItem]);

  useEffect(() => {
    if (resource !== 'researchers' || selectedItem || !form.departmentId) {
      return;
    }

    const nextEmployeeId = buildNextResearcherEmployeeId(
      String(form.departmentId),
      supportData.departments,
      items,
    );

    setForm((current) => {
      if (current.employeeId === nextEmployeeId) {
        return current;
      }

      return {
        ...current,
        employeeId: nextEmployeeId,
      };
    });
  }, [form.departmentId, items, resource, selectedItem, supportData.departments]);

  useEffect(() => {
    if (!selectedDepartmentId || !config.fields.some((field) => field.name === 'facultyId')) {
      return;
    }

    const department = supportData.departments.find(
      (item) => item.id === selectedDepartmentId,
    );

    if (!department?.facultyId || form.facultyId === department.facultyId) {
      return;
    }

    setForm((current) => ({
      ...current,
      facultyId: department.facultyId ?? '',
    }));
  }, [config.fields, form.facultyId, selectedDepartmentId, supportData.departments]);

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
        current && nextItems.some((item) => item.id === current) ? current : null,
      );
    } catch (caughtError) {
      setItems([]);
      setSelectedId(null);
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load records.');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadSupportData() {
    setIsLoadingSupportData(true);

    try {
      const apiBaseUrl = getApiBaseUrl();
      const [facultiesResponse, departmentsResponse, researchersResponse, groupsResponse] =
        await Promise.all([
          fetch(`${apiBaseUrl}/faculties?pageSize=100`, { cache: 'no-store' }),
          fetch(`${apiBaseUrl}/departments?pageSize=100`, { cache: 'no-store' }),
          fetch(`${apiBaseUrl}/researchers?pageSize=100`, { cache: 'no-store' }),
          fetch(`${apiBaseUrl}/groups?pageSize=100`, { cache: 'no-store' }),
        ]);

      const [facultiesPayload, departmentsPayload, researchersPayload, groupsPayload] =
        (await Promise.all([
          facultiesResponse.json().catch(() => null),
          departmentsResponse.json().catch(() => null),
          researchersResponse.json().catch(() => null),
          groupsResponse.json().catch(() => null),
        ])) as (ApiListPayload | null)[];

      if (!facultiesResponse.ok) {
        throw new Error(facultiesPayload?.message ?? 'Unable to load faculties.');
      }

      if (!departmentsResponse.ok) {
        throw new Error(departmentsPayload?.message ?? 'Unable to load departments.');
      }

      if (!researchersResponse.ok) {
        throw new Error(researchersPayload?.message ?? 'Unable to load researchers.');
      }

      if (!groupsResponse.ok) {
        throw new Error(groupsPayload?.message ?? 'Unable to load groups.');
      }

      setSupportData({
        faculties: (facultiesPayload?.data?.data as SupportFaculty[] | undefined) ?? [],
        departments: (departmentsPayload?.data?.data as SupportDepartment[] | undefined) ?? [],
        researchers:
          (researchersPayload?.data?.data as SupportResearcher[] | undefined) ?? [],
        groups: (groupsPayload?.data?.data as SupportGroup[] | undefined) ?? [],
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to load admin form options.',
      );
    } finally {
      setIsLoadingSupportData(false);
    }
  }

  function renderField(field: (typeof config.fields)[number]) {
    if (resource === 'researchers' && field.name === 'employeeId') {
      return (
        <input
          type="text"
          readOnly
          value={String(form[field.name] ?? '')}
          placeholder="Select a department first"
          className="rounded-2xl border border-line bg-slate-100 px-4 py-3 text-slate-600 outline-none"
        />
      );
    }

    if (field.name === 'departmentId') {
      return (
        <select
          value={String(form[field.name] ?? '')}
          onChange={(event) => {
            const departmentId = event.target.value;
            const department = supportData.departments.find((item) => item.id === departmentId);

            setForm((current) => {
              const nextForm: Record<string, string | number | boolean> = {
                ...current,
                departmentId,
              };

              if (config.fields.some((configField) => configField.name === 'facultyId')) {
                nextForm.facultyId = department?.facultyId ?? '';
              }

              if (config.fields.some((configField) => configField.name === 'groupId')) {
                const selectedGroup = supportData.groups.find(
                  (group) => group.id === current.groupId,
                );

                if (selectedGroup?.departmentId && selectedGroup.departmentId !== departmentId) {
                  nextForm.groupId = '';
                }
              }

              for (const researcherField of [
                'principalInvestigatorId',
                'leadResearcherId',
                'supervisorId',
                'coSupervisorId',
              ]) {
                if (!config.fields.some((configField) => configField.name === researcherField)) {
                  continue;
                }

                const selectedResearcher = supportData.researchers.find(
                  (researcher) => researcher.id === current[researcherField],
                );

                if (
                  selectedResearcher?.departmentId &&
                  selectedResearcher.departmentId !== departmentId
                ) {
                  nextForm[researcherField] = '';
                }
              }

              if (resource === 'researchers') {
                nextForm.employeeId = selectedItem
                  ? current.employeeId
                  : buildNextResearcherEmployeeId(departmentId, supportData.departments, items);
              }

              return nextForm;
            });
          }}
          className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
        >
          <option value="">
            {isLoadingSupportData ? 'Loading departments...' : 'Select a department'}
          </option>
          {supportData.departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      );
    }

    if (field.name === 'facultyId' && resource === 'departments') {
      return (
        <select
          value={String(form[field.name] ?? '')}
          onChange={(event) =>
            setForm((current) => ({ ...current, [field.name]: event.target.value }))
          }
          className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
        >
          <option value="">
            {isLoadingSupportData ? 'Loading faculties...' : 'Select a faculty'}
          </option>
          {supportData.faculties.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.name}
            </option>
          ))}
        </select>
      );
    }

    if (resource === 'researchers' && field.name === 'facultyId') {
      const selectedDepartment = supportData.departments.find(
        (department) => department.id === form.departmentId,
      );
      const facultyLabel = selectedDepartment?.faculty?.name ?? '';

      return (
        <input
          type="text"
          readOnly
          value={
            form[field.name]
              ? facultyLabel
                ? `${facultyLabel} (${String(form[field.name])})`
                : String(form[field.name])
              : ''
          }
          placeholder="Select a department first"
          className="rounded-2xl border border-line bg-slate-100 px-4 py-3 text-slate-600 outline-none"
        />
      );
    }

    if (field.name === 'facultyId') {
      return (
        <input
          type="text"
          readOnly
          value={
            form[field.name]
              ? selectedFaculty?.name
                ? `${selectedFaculty.name} (${String(form[field.name])})`
                : String(form[field.name])
              : ''
          }
          placeholder="Select a department first"
          className="rounded-2xl border border-line bg-slate-100 px-4 py-3 text-slate-600 outline-none"
        />
      );
    }

    if (field.name === 'groupId') {
      return (
        <select
          value={String(form[field.name] ?? '')}
          onChange={(event) =>
            setForm((current) => ({ ...current, [field.name]: event.target.value }))
          }
          className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
        >
          <option value="">{isLoadingSupportData ? 'Loading groups...' : 'Select a group'}</option>
          {availableGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      );
    }

    if (
      ['principalInvestigatorId', 'leadResearcherId', 'supervisorId', 'coSupervisorId'].includes(
        field.name,
      )
    ) {
      return (
        <select
          value={String(form[field.name] ?? '')}
          onChange={(event) =>
            setForm((current) => ({ ...current, [field.name]: event.target.value }))
          }
          className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
        >
          <option value="">
            {isLoadingSupportData ? 'Loading researchers...' : `Select ${field.label.toLowerCase()}`}
          </option>
          {availableResearchers.map((researcher) => (
            <option key={researcher.id} value={researcher.id}>
              {researcher.firstName} {researcher.lastName}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={String(form[field.name] ?? '')}
          onChange={(event) =>
            setForm((current) => ({ ...current, [field.name]: event.target.value }))
          }
          rows={5}
          className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
        />
      );
    }

    if (field.type === 'select') {
      return (
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
      );
    }

    if (field.type === 'checkbox') {
      return (
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
      );
    }

    return (
      <input
        type={field.type}
        required={field.required}
        value={String(form[field.name] ?? '')}
        onChange={(event) =>
          setForm((current) => ({ ...current, [field.name]: event.target.value }))
        }
        className="rounded-2xl border border-line bg-slate-50 px-4 py-3 outline-none focus:border-accent"
      />
    );
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
              {renderField(field)}
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

function buildNextResearcherEmployeeId(
  departmentId: string,
  departments: SupportDepartment[],
  researchers: Record<string, any>[],
) {
  if (!departmentId) {
    return '';
  }

  const department = departments.find((item) => item.id === departmentId);

  if (!department) {
    return '';
  }

  const prefix = getDepartmentCode(department.name);
  const matchingNumbers = researchers
    .map((researcher) => researcher.employeeId)
    .filter((value): value is string => typeof value === 'string')
    .map((value) => {
      const match = value.match(new RegExp(`^LGU-${prefix}-(\\d+)$`));
      return match ? Number(match[1]) : null;
    })
    .filter((value): value is number => value !== null && Number.isFinite(value));

  const nextNumber = matchingNumbers.length ? Math.max(...matchingNumbers) + 1 : 1001;
  return `LGU-${prefix}-${String(nextNumber).padStart(4, '0')}`;
}

function getDepartmentCode(name: string) {
  const normalized = name
    .replace(/^Department of\s+/i, '')
    .trim();
  const words = normalized
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Za-z]/g, ''))
    .filter(Boolean);

  if (!words.length) {
    return 'GEN';
  }

  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }

  return words.map((word) => word[0]).join('').slice(0, 3).toUpperCase();
}
