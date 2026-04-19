type PortalSearchBarProps = {
  scope?: string;
  className?: string;
};

export function PortalSearchBar({
  scope = 'all',
  className = '',
}: PortalSearchBarProps) {
  return (
    <form
      action="/search"
      className={`flex flex-col gap-3 rounded-[22px] border border-line bg-white p-3 shadow-sm sm:flex-row ${className}`.trim()}
    >
      <input type="hidden" name="scope" value={scope} />
      <input
        type="search"
        name="q"
        placeholder="Search the portal"
        className="min-w-0 flex-1 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-ink outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-accent"
        aria-label="Search the portal"
      />
      <button
        type="submit"
        className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent"
      >
        Search
      </button>
    </form>
  );
}
