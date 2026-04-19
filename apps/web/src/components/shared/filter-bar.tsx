import Link from 'next/link';

type FilterBarProps = {
  basePath: string;
  filters: { label: string; value: string }[];
  active?: string;
  paramName?: string;
};

export function FilterBar({
  basePath,
  filters,
  active,
  paramName = 'filter',
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={basePath}
        className={`rounded-full border px-4 py-2 text-sm font-medium ${
          !active
            ? 'border-accent bg-accent text-white'
            : 'border-line bg-white text-slate-700 hover:border-accent'
        }`}
      >
        All
      </Link>
      {filters.map((filter) => (
        <Link
          key={filter.value}
          href={`${basePath}?${paramName}=${encodeURIComponent(filter.value)}`}
          className={`rounded-full border px-4 py-2 text-sm font-medium ${
            active === filter.value
              ? 'border-accent bg-accent text-white'
              : 'border-line bg-white text-slate-700 hover:border-accent'
          }`}
        >
          {filter.label}
        </Link>
      ))}
    </div>
  );
}

