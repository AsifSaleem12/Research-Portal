type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="surface p-6">
      <div className="text-3xl font-semibold text-ink">{value}</div>
      <div className="mt-2 text-sm text-slate-600">{label}</div>
    </div>
  );
}

