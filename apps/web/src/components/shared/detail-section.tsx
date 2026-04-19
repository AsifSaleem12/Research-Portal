type DetailSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <section className="surface p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <div className="mt-5 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

