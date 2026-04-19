type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
}: AdminPageHeaderProps) {
  return (
    <div className="space-y-3">
      <p className="muted-label">{eyebrow}</p>
      <h1 className="font-serif text-4xl text-ink">{title}</h1>
      <p className="max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

