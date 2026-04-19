type TagListProps = {
  items: string[];
};

export function TagList({ items }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-accent"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

