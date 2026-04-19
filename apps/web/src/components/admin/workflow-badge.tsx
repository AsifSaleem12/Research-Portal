import { cn } from '../../lib/utils';
import type { WorkflowState } from '../../types/admin';

const workflowClasses: Record<WorkflowState, string> = {
  Draft: 'bg-slate-100 text-slate-700',
  Submitted: 'bg-amber-100 text-amber-800',
  'Under Review': 'bg-blue-100 text-blue-800',
  Approved: 'bg-emerald-100 text-emerald-800',
  Rejected: 'bg-rose-100 text-rose-800',
  Published: 'bg-accentSoft text-accent',
  Archived: 'bg-stone-200 text-stone-700',
};

export function WorkflowBadge({ value }: { value: WorkflowState }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        workflowClasses[value],
      )}
    >
      {value}
    </span>
  );
}

