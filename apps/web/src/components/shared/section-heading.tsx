type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-2">
      <p className="muted-label">{eyebrow}</p>
      <h2 className="headline-balance font-serif text-[1.9rem] text-ink sm:text-[2.35rem]">
        {title}
      </h2>
      {description ? (
        <p className="text-[15px] leading-7 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
