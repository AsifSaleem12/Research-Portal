type AdminPanelCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AdminPanelCard({
  title,
  description,
  children,
}: AdminPanelCardProps) {
  return (
    <section className="rounded-[28px] border border-line bg-white p-6 shadow-card">
      <div className="mb-5">
        <h2 className="font-serif text-2xl text-ink">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

