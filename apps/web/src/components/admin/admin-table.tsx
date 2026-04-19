import { WorkflowBadge } from './workflow-badge';
import type { AdminRecord } from '../../types/admin';

type AdminTableProps = {
  records: AdminRecord[];
  onSelect: (record: AdminRecord) => void;
};

export function AdminTable({ records, onSelect }: AdminTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-line">
      <table className="min-w-full divide-y divide-line text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-slate-600">Title</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Department</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Owner</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Type</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Workflow</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-white">
          {records.map((record) => (
            <tr
              key={record.id}
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => onSelect(record)}
            >
              <td className="px-4 py-4">
                <div className="font-medium text-ink">{record.title}</div>
                {record.summary ? (
                  <div className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                    {record.summary}
                  </div>
                ) : null}
              </td>
              <td className="px-4 py-4 text-slate-600">{record.department ?? 'Central'}</td>
              <td className="px-4 py-4 text-slate-600">{record.owner ?? 'Unassigned'}</td>
              <td className="px-4 py-4 text-slate-600">{record.type ?? 'Record'}</td>
              <td className="px-4 py-4">
                <WorkflowBadge value={record.workflow} />
              </td>
              <td className="px-4 py-4 text-slate-600">{record.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

